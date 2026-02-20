import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import demoThumb from "@/assets/demo-thumbnail.jpg";

const timelineMarkers = [
  { position: 12, type: "score", label: "Score 1-0" },
  { position: 25, type: "foul", label: "Foot Fault" },
  { position: 38, type: "score", label: "Score 3-2" },
  { position: 52, type: "key", label: "Rally 14 shots" },
  { position: 65, type: "foul", label: "Kitchen Violation" },
  { position: 74, type: "score", label: "Score 8-6" },
  { position: 88, type: "key", label: "Match Point" },
];

const markerColors: Record<string, string> = {
  score: "bg-primary",
  foul: "bg-destructive",
  key: "bg-stat-highlight",
};

interface VideoPlayerProps {
  jobId?: string;
  liveData?: any;
}

const VideoPlayer = ({ jobId, liveData }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
  const progress = liveData?.progress ? liveData.progress * 100 : 0;
  const status = liveData?.status ? liveData.status.toUpperCase() : "PROCESSING";
  
  const hasVideo = !!jobId;

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden neon-border bg-card flex flex-col">
      {/* Video area */}
      <div className="relative flex-1 min-h-0">
        {hasVideo ? (
          playing ? (
            <img
              src={`http://127.0.0.1:8000/api/stream/${jobId}`}
              className="absolute inset-0 w-full h-full object-contain bg-black"
              onClick={togglePlay}
              alt="Live frame stream"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center text-muted-foreground" onClick={togglePlay}>
              Stream Paused
            </div>
          )
        ) : (
          <img
            src={demoThumb}
            alt="Match footage"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-background/20 pointer-events-none" />

        {/* Camera label */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-destructive/90 text-destructive-foreground text-[10px] font-mono font-bold px-2 py-0.5 rounded">
            REC
          </span>
          <span className="text-[10px] font-mono text-foreground/80 bg-background/60 px-2 py-0.5 rounded">
            CAM 01 – NORTH BASELINE
          </span>
        </div>

        {/* FPS indicator */}
        <div className="absolute top-3 right-3 text-[10px] font-mono text-foreground/60 bg-background/60 px-2 py-0.5 rounded">
          RealTime Live 120 FPS
        </div>

        {/* Tracking boxes */}
        <div className="absolute bottom-[35%] left-[40%] w-16 h-24 tracking-box rounded-sm">
          <span className="absolute -top-4 left-0 text-[9px] font-mono neon-text bg-background/70 px-1 rounded">
            Player A (0.97)
          </span>
        </div>

        {/* Speed overlay */}
        <div className="absolute bottom-[38%] right-[30%] text-[10px] font-mono neon-text bg-background/70 px-1.5 py-0.5 rounded">
          42 mph →
        </div>

        {/* Processing badge */}
        <div className="absolute bottom-14 right-3 flex items-center gap-1.5 bg-primary/20 border border-primary/40 rounded px-2 py-1">
          {status === "PROCESSING" && <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />}
          <span className="text-[10px] font-mono text-primary font-semibold">
            {status === "PROCESSING" ? "LIVE – PROCESSING" : status}
          </span>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="bg-background/90 p-3 shrink-0">
        {/* Timeline with markers */}
        <div className="relative w-full mb-2">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-secondary rounded-full cursor-pointer relative">
            <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_6px_hsl(145_80%_42%_/_0.6)]" />
            </div>

            {/* Timeline markers */}
            {timelineMarkers.map((marker, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 z-10"
                style={{ left: `${marker.position}%` }}
                onMouseEnter={() => setHoveredMarker(i)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <div className={`w-2 h-2 rounded-full ${markerColors[marker.type]} cursor-pointer ring-1 ring-background`} />
                {hoveredMarker === i && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border px-2 py-1 rounded text-[9px] font-mono text-foreground shadow-lg z-20">
                    {marker.label}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Marker legend */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[8px] font-mono text-muted-foreground">Score</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
              <span className="text-[8px] font-mono text-muted-foreground">Foul</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-stat-highlight" />
              <span className="text-[8px] font-mono text-muted-foreground">Key Moment</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="text-foreground/70 hover:text-foreground transition-colors">
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </button>
            <button className="text-foreground/70 hover:text-foreground transition-colors">
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{progress.toFixed(1)}% / 100%</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
