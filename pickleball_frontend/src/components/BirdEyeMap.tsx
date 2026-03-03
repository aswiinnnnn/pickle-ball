import { useState } from "react";

interface BirdEyeMapProps {
  jobId?: string;
  stats?: any;
}

const CourtSvg = ({ theme = "green" }: { theme?: "green" | "blue" }) => {
  const colors = theme === "blue" 
    ? {
        surface: "hsl(215 40% 20%)",
        kitchen: "hsl(215 50% 15% / 0.8)",
        lines: "hsl(0 0% 100% / 0.5)",
        net: "hsl(0 0% 100% / 0.7)"
      }
    : {
        surface: "hsl(145 35% 22%)",
        kitchen: "hsl(145 40% 18% / 0.6)",
        lines: "hsl(0 0% 100% / 0.4)",
        net: "hsl(0 0% 100% / 0.7)"
      };

  return (
    <svg viewBox="0 -10 400 900" className="w-full h-full drop-shadow-md">
      {/* Court surface */}
      <rect x="0" y="0" width="400" height="880" rx="4" fill={colors.surface} stroke={colors.lines} strokeWidth="4" />

      {/* Center line */}
      <line x1="200" y1="0" x2="200" y2="300" stroke={colors.lines} strokeWidth="4" />
      <line x1="200" y1="580" x2="200" y2="880" stroke={colors.lines} strokeWidth="4" />

      {/* Kitchen / NVZ */}
      <rect x="0" y="300" width="400" height="280" fill={colors.kitchen} stroke="none" />
      <line x1="0" y1="300" x2="400" y2="300" stroke={colors.lines} strokeWidth="4" />
      <line x1="0" y1="580" x2="400" y2="580" stroke={colors.lines} strokeWidth="4" />
      
      {/* Net line */}
      <line x1="-10" y1="440" x2="410" y2="440" stroke={colors.net} strokeWidth="6" strokeDasharray="8 4" />
      <circle cx="-10" cy="440" r="10" fill="hsl(0 0% 40%)" />
      <circle cx="410" cy="440" r="10" fill="hsl(0 0% 40%)" />
    </svg>
  );
};

const HeatmapPanel = ({ title, src }: { title: string; src: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="stat-card relative flex flex-col flex-1 min-h-0 p-1.5">
      <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1 shrink-0">{title}</span>
      <div className="relative mx-auto w-full flex-1 min-h-0 bg-black/40 rounded border border-border overflow-hidden p-1 flex items-center justify-center">
        {/* Background Court (Blue) */}
        <div className="absolute inset-0 p-1">
          <CourtSvg theme="blue" />
        </div>
        
        {/* Actual Heatmap Img (Hidden until loaded) */}
        <img 
            src={src}
            alt={title}
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-contain mix-blend-screen transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
};

const BirdEyeMap = ({ jobId, stats }: BirdEyeMapProps) => {
  const playersInKitchen = stats?.kitchen?.players_in_kitchen || [];
  
  // Extract coordinate arrays
  const sp = stats?.spatial || {};
  const p0 = sp.player_birdseye?.["0"]; 
  const p1 = sp.player_birdseye?.["1"]; 
  const ball = sp.ball_birdseye;
  
  // Coordinates map natively to the 400x900 backend homography
  const mapX = (x: number) => x;
  const mapY = (y: number) => y;

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 pb-1">
      {/* 1. Court Map */}
      <div className="stat-card relative flex flex-col flex-1 min-h-0 p-1.5">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1 shrink-0">Live Court</span>
        <div className="relative mx-auto w-full flex-1 min-h-0 flex items-center justify-center p-1 bg-black/40 rounded border border-border">
          <CourtSvg theme="green" />

          {/* Tracking Elements Overlay */}
          <svg viewBox="0 -10 400 900" className="absolute inset-0 w-full h-full p-1 h-full drop-shadow-md pointer-events-none">
            {p0 && p0.length === 2 && (
                <>
                <circle cx={mapX(p0[0])} cy={mapY(p0[1])} r="20" fill={playersInKitchen.includes(0) ? "hsl(0 90% 50% / 0.25)" : "hsl(145 80% 42% / 0.2)"} />
                <circle cx={mapX(p0[0])} cy={mapY(p0[1])} r="12" fill={playersInKitchen.includes(0) ? "hsl(0 90% 50%)" : "hsl(145 80% 42%)"} stroke="hsl(145 80% 60%)" strokeWidth="2" />
                <text x={mapX(p0[0])} y={mapY(p0[1]) + 5} textAnchor="middle" fill="hsl(220 20% 7%)" fontSize="14" fontWeight="bold" fontFamily="monospace">A</text>
                </>
            )}
            
            {p1 && p1.length === 2 && (
                <>
                <circle cx={mapX(p1[0])} cy={mapY(p1[1])} r="20" fill={playersInKitchen.includes(1) ? "hsl(0 90% 50% / 0.25)" : "hsl(190 90% 50% / 0.2)"} />
                <circle cx={mapX(p1[0])} cy={mapY(p1[1])} r="12" fill={playersInKitchen.includes(1) ? "hsl(0 90% 50%)" : "hsl(190 90% 50%)"} stroke="hsl(190 90% 65%)" strokeWidth="2" />
                <text x={mapX(p1[0])} y={mapY(p1[1]) + 5} textAnchor="middle" fill="hsl(220 20% 7%)" fontSize="14" fontWeight="bold" fontFamily="monospace">B</text>
                </>
            )}
            
            {ball && ball.length === 2 && (
                <circle cx={mapX(ball[0])} cy={mapY(ball[1])} r="8" fill="hsl(50 100% 60%)" stroke="hsl(50 100% 70%)" strokeWidth="1" />
            )}
          </svg>
        </div>
      </div>

      <HeatmapPanel 
        title="Player Heat" 
        src={`http://127.0.0.1:8000/api/live_heatmap/player/${jobId}?t=${Date.now()}`} 
      />

      <HeatmapPanel 
        title="Ball Heat" 
        src={`http://127.0.0.1:8000/api/live_heatmap/ball/${jobId}?t=${Date.now()}`} 
      />
    </div>
  );
};

export default BirdEyeMap;

