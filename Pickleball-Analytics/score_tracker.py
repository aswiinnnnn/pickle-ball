"""
Score tracking module

Purpose
-------
Determines who won each point using heuristics evaluated when a rally ends.
Maintains a running score and renders an overlay on the video.

Heuristics (priority order)
---------------------------
1. Double bounce on one side → opposite side wins
2. Ball went out of bounds → opposite side of last ball position wins
3. Last ball position fallback → opposite side wins (ball "died" there)
"""

import cv2

class ScoreTracker:
    def __init__(self):
        self.score = {"top": 0, "bottom": 0}
        self.point_log = []  # list of {"frame": N, "winner": "top"/"bottom", "reason": "..."}

        self._last_ball_side = None
        self._ball_was_in_bounds = False
        self._ball_went_oob = False  # went out of bounds during this rally

        # Display
        self._point_display_frames = 0
        self._point_display_max = 18
        self._last_point_winner = None
        self._last_point_reason = None

    @staticmethod
    def _opposite(side):
        return "bottom" if side == "top" else "top"

    def update(self, ball_proj, ball_in_bounds, ball_side):
        """Called every frame to track ball state for scoring."""
        if ball_side is not None:
            self._last_ball_side = ball_side

        # Track out-of-bounds transition
        if self._ball_was_in_bounds and not ball_in_bounds and ball_proj is not None:
            self._ball_went_oob = True

        self._ball_was_in_bounds = ball_in_bounds

        # Tick display counter
        if self._point_display_frames > 0:
            self._point_display_frames -= 1

    def on_rally_end(self, frame_idx, ball_tracker):
        """
        Called when a rally ends. Evaluate heuristics and award the point.
        Returns (winner, reason) or (None, None) if can't determine.
        """
        winner = None
        reason = None

        # Heuristic 1: Double bounce
        double_side = ball_tracker.has_double_bounce()
        if double_side is not None:
            winner = self._opposite(double_side)
            reason = f"double bounce on {double_side} side"

        # Heuristic 2: Out of bounds
        if winner is None and self._ball_went_oob and self._last_ball_side is not None:
            winner = self._opposite(self._last_ball_side)
            reason = f"ball out of bounds (last on {self._last_ball_side} side)"

        # Heuristic 3: Last position fallback
        if winner is None and self._last_ball_side is not None:
            winner = self._opposite(self._last_ball_side)
            reason = f"ball last on {self._last_ball_side} side"

        if winner is not None:
            self.score[winner] += 1
            self.point_log.append({
                "frame": frame_idx,
                "winner": winner,
                "reason": reason,
            })
            self._point_display_frames = self._point_display_max
            self._last_point_winner = winner
            self._last_point_reason = reason

            winner_label = "Player A" if winner == "top" else "Player B"
            print(f"[POINT] {winner_label} scores! ({reason}) | "
                  f"Score: A {self.score['top']} - B {self.score['bottom']}")

        # Reset for next rally
        self._ball_went_oob = False
        ball_tracker.reset_rally_state()

        return winner, reason

    def draw_score(self, frame):
        """Draw always-on scoreboard and brief POINT flash."""
        h, w = frame.shape[:2]
        font = cv2.FONT_HERSHEY_SIMPLEX

        # --- Always-on scoreboard (top-right) ---
        score_text = f"A: {self.score['top']}  |  B: {self.score['bottom']}"
        scale = 0.8
        thickness = 2
        (tw, th), baseline = cv2.getTextSize(score_text, font, scale, thickness)
        tx = w - tw - 20
        ty = 35

        # Background
        pad = 8
        cv2.rectangle(frame, (tx - pad, ty - th - pad),
                      (tx + tw + pad, ty + baseline + pad), (0, 0, 0), -1)
        cv2.rectangle(frame, (tx - pad, ty - th - pad),
                      (tx + tw + pad, ty + baseline + pad), (255, 255, 255), 2)
        cv2.putText(frame, score_text, (tx, ty), font, scale, (255, 255, 255), thickness)

        # --- Brief POINT flash (centered) ---
        if self._point_display_frames > 0:
            winner_label = "Player A" if self._last_point_winner == "top" else "Player B"
            pt_text = f"POINT - {winner_label}!"
            pt_scale = 1.4
            pt_thick = 3
            (ptw, pth), pt_base = cv2.getTextSize(pt_text, font, pt_scale, pt_thick)
            ptx = (w - ptw) // 2
            pty = h - 80

            pad2 = 12
            cv2.rectangle(frame, (ptx - pad2, pty - pth - pad2),
                          (ptx + ptw + pad2, pty + pt_base + pad2), (0, 0, 0), -1)
            cv2.rectangle(frame, (ptx - pad2, pty - pth - pad2),
                          (ptx + ptw + pad2, pty + pt_base + pad2), (0, 200, 0), 3)
            cv2.putText(frame, pt_text, (ptx, pty), font, pt_scale, (0, 255, 0), pt_thick)

    def export_stats(self):
        """Return score data for JSON export."""
        return {
            "score": {
                "player_a_top": self.score["top"],
                "player_b_bottom": self.score["bottom"],
            },
            "points": self.point_log,
        }
