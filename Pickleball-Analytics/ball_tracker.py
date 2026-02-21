"""
Ball tracking module

Purpose
-------
Runs YOLO ball detection per frame, draws the box on the main view, and projects
the ball center into bird’s-eye coordinates using a homography.

What it does
------------
- detect_frame(frame): YOLO inference → {1: [x1, y1, x2, y2]} if ball found
- interpolate_ball_positions(list_of_dicts): fills gaps across frames (NaN interpolation)
- draw_bbox(frame, bbox): annotate main view
- project_ball(bbox, H): perspectiveTransform of bbox center with homography H
- process_and_project(ball_dict, frame, H): convenience wrapper returning (bbox, proj_point)

Inputs
------
- BGR frame (OpenCV), homography matrix H (3×3)

Outputs
-------
- Ball bbox on the main frame (visual) and (x, y) point in bird coordinates

Assumptions
-----------
- Single ball tracked; dictionary uses key=1 for consistency
- Homography H is valid when projection is requested
"""


import cv2
import numpy as np
from ultralytics import YOLO
import pandas as pd

class BallTracker:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

        # Bounce detection state
        self._y_history = []           # recent y-center values
        self._history_len = 5          # how many frames to look back
        self._was_going_down = False   # was the ball moving downward?
        self._bounce_cooldown = 0      # frames remaining in cooldown
        self._bounce_cooldown_max = 15 # min frames between bounces
        self._bounce_flag = False      # True on the frame a bounce is detected
        self._bounce_display_frames = 0  # counter to keep "BOUNCE!" on screen
        self._bounce_display_max = 3    # show label for this many frames
        self.bounce_count = 0          # total bounces detected

        # Side & double-bounce tracking (for scoring)
        self._last_ball_side = None            # "top" or "bottom"
        self._side_bounce_counts = {"top": 0, "bottom": 0}  # consecutive bounces per side

    def detect_frame(self, frame):
        """Detect ball in a single frame, return dict with bbox if found"""
        results = self.model.predict(frame, conf=0.15)[0]
        ball_dict = {}
        for box in results.boxes:
            bbox = box.xyxy.tolist()[0]
            ball_dict[1] = bbox  # using key=1 to be consistent
        return ball_dict

    def detect_bounce(self, ball_dict):
        """
        Detect a bounce by watching the ball's y-center.
        A bounce = ball was going DOWN (y increasing) then starts going UP (y decreasing).
        Returns True on the frame the bounce is first detected.
        """
        self._bounce_flag = False

        # Tick cooldown
        if self._bounce_cooldown > 0:
            self._bounce_cooldown -= 1

        # Tick display counter
        if self._bounce_display_frames > 0:
            self._bounce_display_frames -= 1

        if 1 not in ball_dict:
            return False

        bbox = ball_dict[1]
        y_center = (bbox[1] + bbox[3]) / 2  # average of y1, y2

        self._y_history.append(y_center)
        if len(self._y_history) > self._history_len:
            self._y_history.pop(0)

        if len(self._y_history) < 3:
            return False

        # Check recent direction: compare last few points
        # "going down" means y is increasing (screen coords: top=0)
        recent = self._y_history[-3:]
        going_down = recent[-2] > recent[-3]  # was moving down
        going_up = recent[-1] < recent[-2]    # now moving up

        if self._was_going_down and going_up and self._bounce_cooldown == 0:
            self._bounce_flag = True
            self._bounce_cooldown = self._bounce_cooldown_max
            self._bounce_display_frames = self._bounce_display_max
            self.bounce_count += 1
            print(f"[BOUNCE DETECTED] Bounce #{self.bounce_count} at y={y_center:.1f}")

        # Update direction state
        if going_down:
            self._was_going_down = True
        elif going_up:
            self._was_going_down = False

        return self._bounce_flag

    def draw_bounce(self, frame):
        """Draw a prominent BOUNCE! label on the frame if a bounce was recently detected."""
        if self._bounce_display_frames > 0:
            h, w = frame.shape[:2]
            text = "BOUNCE!"
            font = cv2.FONT_HERSHEY_SIMPLEX
            scale = 1.8
            thickness = 4
            (tw, th), baseline = cv2.getTextSize(text, font, scale, thickness)
            tx = (w - tw) // 2
            ty = 60 + th

            # Background rectangle for readability
            pad = 15
            cv2.rectangle(frame, (tx - pad, ty - th - pad),
                          (tx + tw + pad, ty + baseline + pad), (0, 0, 0), -1)
            cv2.rectangle(frame, (tx - pad, ty - th - pad),
                          (tx + tw + pad, ty + baseline + pad), (0, 255, 255), 3)

            # Text
            cv2.putText(frame, text, (tx, ty), font, scale, (0, 255, 255), thickness)

            # Bounce count below
            count_text = f"Total: {self.bounce_count}"
            (cw, ch), _ = cv2.getTextSize(count_text, font, 0.7, 2)
            cv2.putText(frame, count_text, (tx + (tw - cw) // 2, ty + ch + 20),
                        font, 0.7, (255, 255, 255), 2)

    def get_ball_side(self, ball_proj, kitchen_y_mid):
        """
        Determine which side of the court the ball is on using bird's-eye coords.
        Returns 'top' or 'bottom' based on kitchen midline, or None if no data.
        """
        if ball_proj is None or kitchen_y_mid is None:
            return self._last_ball_side
        _, y = ball_proj
        side = "top" if y < kitchen_y_mid else "bottom"
        prev_side = self._last_ball_side
        self._last_ball_side = side

        # If ball crossed sides, reset bounce counts for the new side
        if prev_side is not None and side != prev_side:
            self._side_bounce_counts[side] = 0

        return side

    def update_side_bounce(self):
        """Call after detect_bounce — if a bounce just happened, increment the current side's count."""
        if self._bounce_flag and self._last_ball_side is not None:
            self._side_bounce_counts[self._last_ball_side] += 1

    def has_double_bounce(self):
        """Returns the side ('top'/'bottom') that has >= 2 consecutive bounces, or None."""
        for side, count in self._side_bounce_counts.items():
            if count >= 2:
                return side
        return None

    def reset_rally_state(self):
        """Reset side-bounce tracking for a new rally."""
        self._side_bounce_counts = {"top": 0, "bottom": 0}

    def interpolate_ball_positions(self, ball_positions):
        """
        Given list of dicts per frame, interpolate missing detections (NaNs).
        Returns list of dicts with interpolated bboxes.
        """
        # Extract bbox coords into dataframe, fill missing with NaN
        data = []
        for d in ball_positions:
            if 1 in d:
                data.append(d[1])
            else:
                data.append([np.nan, np.nan, np.nan, np.nan])
        df = pd.DataFrame(data, columns=['x1', 'y1', 'x2', 'y2'])
        df_interp = df.interpolate().bfill().ffill()

        # Reconstruct list of dicts with interpolated coords
        interp_positions = [{1: row.tolist()} for idx, row in df_interp.iterrows()]
        return interp_positions

    def draw_bbox(self, frame, bbox):
        """Draw bounding box and label on frame"""
        x1, y1, x2, y2 = map(int, bbox)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
        cv2.putText(frame, "Ball", (x1, y1 - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)

    def project_ball(self, bbox, H):
        """Project the ball center to bird's eye view"""
        x1, y1, x2, y2 = bbox
        cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
        point = np.array([[[cx, cy]]], dtype=np.float32)
        proj = cv2.perspectiveTransform(point, H)[0][0]
        return tuple(proj)

    def process_and_project(self, ball_dict, frame, H):
        """
        Convenience method: draw bbox on frame and return projected point (if available)
        """
        if 1 in ball_dict:
            bbox = ball_dict[1]
            self.draw_bbox(frame, bbox)
            if H is not None:
                proj = self.project_ball(bbox, H)
                return bbox, proj
            return bbox, None
        return None, None
