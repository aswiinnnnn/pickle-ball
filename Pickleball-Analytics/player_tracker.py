"""
Player detection & projection module

Purpose
-------
Runs YOLO to detect players each frame, then projects each player’s bottom-center
point into bird’s-eye space for analytics and overlays.

What it does
------------
- detect_players(frame): YOLO inference → list of [x1, y1, x2, y2] boxes
- project_player_positions(boxes, H): bottom-center of each box → perspectiveTransform
- detect_and_project(frame, H): convenience returning (boxes, projected_points)

Inputs
------
- BGR frame (OpenCV), homography H (3×3)

Outputs
-------
- Image-space bounding boxes and bird’s-eye (x, y) points

Assumptions
-----------
- Bottom-center of bbox reasonably approximates foot location for court placement
- Homography H is valid when projection is requested
"""


import cv2
import numpy as np
from ultralytics import YOLO

class PlayerTracker:
    def __init__(self, model_path, conf_threshold=0.5):
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold

    def detect_players(self, frame):
        """
        Run YOLO player detection on frame.
        Returns list of bounding boxes in format [x1, y1, x2, y2].
        """
        results = self.model.predict(frame, conf=self.conf_threshold, verbose=False)[0]
        boxes = []
        confs = []
        for box in results.boxes:
            bbox = box.xyxy.cpu().numpy()[0]
            conf = float(box.conf.cpu().numpy()[0])
            boxes.append(bbox.tolist())
            confs.append(conf)
        return boxes, confs


    def project_player_positions(self, boxes, H):
        """
        Given bounding boxes and homography H, project player bottom-center points.
        Returns list of projected (x, y) tuples in bird's eye space.
        """
        projected_pts = []
        if H is None:
            return projected_pts

        for box in boxes:
            x1, y1, x2, y2 = box
            cx = (x1 + x2) / 2
            cy = y2  # bottom center of bbox
            pt = np.array([[[cx, cy]]], dtype=np.float32)
            proj = cv2.perspectiveTransform(pt, H)[0][0]
            projected_pts.append(tuple(proj))
        return projected_pts

    def detect_and_project(self, frame, H):
        """
        Convenience method: detect players and get projected points.
        Returns tuple: (list of bounding boxes, list of projected points, list of confidences)

        Players are sorted by bird's-eye Y coordinate (ascending) so the
        top-side player is always index 0 (Player A) and bottom-side is
        index 1 (Player B).  This keeps IDs stable across frames even when
        YOLO detection order changes.
        """
        boxes, confs = self.detect_players(frame)
        projected_pts = self.project_player_positions(boxes, H)

        # Sort all three lists together by projected Y (top-side first)
        if projected_pts and len(projected_pts) == len(boxes):
            combined = list(zip(boxes, projected_pts, confs))
            combined.sort(key=lambda t: t[1][1])  # sort by bird's-eye Y
            boxes = [c[0] for c in combined]
            projected_pts = [c[1] for c in combined]
            confs = [c[2] for c in combined]

        return boxes, projected_pts, confs
