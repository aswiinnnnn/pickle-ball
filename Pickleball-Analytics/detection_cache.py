"""
Detection result cache

Purpose
-------
Caches per-frame YOLO detection outputs (ball, player, court) keyed by
video file SHA-256 hash.  On re-upload of the same video the expensive
model inference is skipped entirely and results are replayed from disk.

Storage layout
--------------
    detection_cache/<sha256>/
        detections.pkl   – pickled list[dict], one entry per frame
        meta.json        – original filename, frame count, timestamp

What is cached (per frame)
--------------------------
    {
        "court": {"keypoints": ndarray|None, "homography": ndarray|None},
        "players": {"boxes": list, "confs": list},
        "ball": {"bbox_dict": dict}
    }
"""

import hashlib
import json
import os
import pickle
from datetime import datetime
from typing import List, Optional

import numpy as np

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_ROOT = os.path.join(PROJECT_DIR, "detection_cache")


class DetectionCache:
    """Load / save per-frame detection results for a given video file."""

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    @staticmethod
    def get_cache_key(video_path: str) -> str:
        """Return SHA-256 hex digest of the video file."""
        h = hashlib.sha256()
        with open(video_path, "rb") as f:
            while True:
                chunk = f.read(1 << 20)  # 1 MB chunks
                if not chunk:
                    break
                h.update(chunk)
        return h.hexdigest()

    @staticmethod
    def _cache_dir(cache_key: str) -> str:
        return os.path.join(CACHE_ROOT, cache_key)

    @classmethod
    def has_cache(cls, video_path: str) -> bool:
        """True if a complete detection cache exists for this video."""
        key = cls.get_cache_key(video_path)
        pkl = os.path.join(cls._cache_dir(key), "detections.pkl")
        return os.path.isfile(pkl)

    @classmethod
    def load(cls, video_path: str) -> Optional[List[dict]]:
        """Load cached detections.  Returns None if no cache."""
        key = cls.get_cache_key(video_path)
        pkl_path = os.path.join(cls._cache_dir(key), "detections.pkl")
        if not os.path.isfile(pkl_path):
            return None
        with open(pkl_path, "rb") as f:
            data = pickle.load(f)
        print(f"[CACHE] Loaded {len(data)} cached frames for {os.path.basename(video_path)}")
        return data

    @classmethod
    def save(cls, video_path: str, frames_data: List[dict]) -> None:
        """Persist detection results for future runs."""
        key = cls.get_cache_key(video_path)
        cache_dir = cls._cache_dir(key)
        os.makedirs(cache_dir, exist_ok=True)

        pkl_path = os.path.join(cache_dir, "detections.pkl")
        with open(pkl_path, "wb") as f:
            pickle.dump(frames_data, f, protocol=pickle.HIGHEST_PROTOCOL)

        meta = {
            "original_filename": os.path.basename(video_path),
            "frame_count": len(frames_data),
            "cached_at": datetime.now().isoformat(),
            "sha256": key,
        }
        meta_path = os.path.join(cache_dir, "meta.json")
        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)

        print(f"[CACHE] Saved {len(frames_data)} frames to {cache_dir}")
