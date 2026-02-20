import os
import uuid
import threading
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from process_video import VideoProcessor

app = FastAPI(title="Pickleball Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job store
# Structure: { job_id: {"status": "processing"|"completed"|"failed", "progress": float, "result": dict|None, "error": str|None} }
jobs = {}

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_video_task(job_id: str, video_path: str):
    try:
        def progress_cb(val):
            jobs[job_id]["progress"] = val

        filters = {
            "player_heatmap": True,
            "rally_length": True,
            "ball_heatmap": True,
            "kitchen_detection": True,
        }
        processor = VideoProcessor(video_path, filters)
        
        # Generator for streaming
        for frame, stats in processor.process_video_stream(progress_callback=progress_cb):
            import cv2
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                jobs[job_id]["latest_frame"] = buffer.tobytes()
            jobs[job_id]["latest_stats"] = stats
            
            # Export heatmaps periodically
            frame_idx = stats.get("operational", {}).get("current_frame", 0)
            if frame_idx % 30 == 0:
                jobs[job_id]["player_heatmap"] = processor.analytics.get_player_heatmap_bytes()
                jobs[job_id]["ball_heatmap"] = processor.analytics.get_ball_heatmap_bytes()
            
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 1.0
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        print(f"Job {job_id} failed: {e}")

@app.post("/api/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    jobs[job_id] = {
        "status": "processing",
        "progress": 0.0,
        "result": None,
        "error": None,
        "latest_frame": None,
        "latest_stats": None,
        "player_heatmap": None,
        "ball_heatmap": None
    }
    
    # Run long-running process in a thread so we don't block asyncio loop
    threading.Thread(target=process_video_task, args=(job_id, file_path), daemon=True).start()
    
    return {"job_id": job_id, "message": "Video uploaded and processing started."}

@app.get("/api/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.get("/api/results/{job_id}")
async def get_results(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")
        
    # Return the parsed JSON stats plus URLs for assets
    import json
    stats_path = job["result"].get("stats_path")
    if stats_path and os.path.exists(stats_path):
        with open(stats_path, "r") as f:
            stats_data = json.load(f)
    else:
        stats_data = {}
        
    return {
        "job_id": job_id,
        "stats": stats_data,
        "assets": {
            "video_url": f"/api/assets/{job_id}/video",
            "player_heatmap_url": f"/api/assets/{job_id}/player_heatmap",
            "ball_heatmap_url": f"/api/assets/{job_id}/ball_heatmap",
        }
    }

@app.get("/api/assets/{job_id}/{asset_type}")
async def get_asset(job_id: str, asset_type: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = jobs[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")
        
    out_dir = job["result"].get("output_dir")
    
    if asset_type == "video":
        filepath = job["result"].get("video_path")
        media_type = "video/mp4"
    elif asset_type == "player_heatmap":
        filepath = os.path.join(out_dir, "player_heatmap.png")
        media_type = "image/png"
    elif asset_type == "ball_heatmap":
        filepath = os.path.join(out_dir, "ball_heatmap.png")
        media_type = "image/png"
    else:
        raise HTTPException(status_code=400, detail="Unknown asset type")
        
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Asset file not found")
        
    return FileResponse(filepath, media_type=media_type)

@app.get("/api/stream/{job_id}")
async def video_stream(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    def frame_generator():
        import time
        while jobs[job_id]["status"] == "processing":
            frame = jobs[job_id].get("latest_frame")
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            time.sleep(0.03)

    from fastapi.responses import StreamingResponse
    return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/api/live_stats/{job_id}")
async def get_live_stats(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "status": jobs[job_id]["status"],
        "progress": jobs[job_id]["progress"],
        "stats": jobs[job_id]["latest_stats"]
    }

from fastapi.responses import Response

@app.get("/api/live_heatmap/{asset_type}/{job_id}")
async def get_live_heatmap(asset_type: str, job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if asset_type not in ["player", "ball"]:
        raise HTTPException(status_code=400, detail="Invalid heatmap type")
        
    img_bytes = jobs[job_id].get(f"{asset_type}_heatmap")
    if not img_bytes:
        raise HTTPException(status_code=404, detail="Heatmap not yet generated")
        
    return Response(content=img_bytes, media_type="image/jpeg")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
