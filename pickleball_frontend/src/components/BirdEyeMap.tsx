interface BirdEyeMapProps {
  jobId?: string;
  stats?: any;
}

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
          <svg viewBox="0 -10 400 900" className="w-full h-full drop-shadow-md">
            {/* Court surface */}
            <rect x="0" y="0" width="400" height="880" rx="4" fill="hsl(145 35% 22%)" stroke="hsl(0 0% 100% / 0.4)" strokeWidth="4" />

            {/* Center line */}
            <line x1="200" y1="0" x2="200" y2="300" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="4" />
            <line x1="200" y1="580" x2="200" y2="880" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="4" />

            {/* Kitchen / NVZ */}
            <rect x="0" y="300" width="400" height="280" fill="hsl(145 40% 18% / 0.6)" stroke="none" />
            <line x1="0" y1="300" x2="400" y2="300" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="4" />
            <line x1="0" y1="580" x2="400" y2="580" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="4" />
            
            {/* Net line */}
            <line x1="-10" y1="440" x2="410" y2="440" stroke="hsl(0 0% 100% / 0.9)" strokeWidth="6" strokeDasharray="8 4" />
            <circle cx="-10" cy="440" r="10" fill="hsl(0 0% 60%)" />
            <circle cx="410" cy="440" r="10" fill="hsl(0 0% 60%)" />
            
            <text x="200" y="445" textAnchor="middle" fill="hsl(0 0% 100% / 0.2)" fontSize="24" fontFamily="monospace">NET</text>

            {/* Baseline labels */}
            <text x="200" y="-15" textAnchor="middle" fill="hsl(0 0% 100% / 0.6)" fontSize="18" fontFamily="monospace">FAR</text>
            <text x="200" y="905" textAnchor="middle" fill="hsl(0 0% 100% / 0.6)" fontSize="18" fontFamily="monospace">NEAR</text>

            {/* Tracking Elements */}
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

      {/* 2. Player Heatmap */}
      <div className="stat-card relative flex flex-col flex-1 min-h-0 p-1.5">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1 shrink-0">Player Heat</span>
        <div className="relative mx-auto w-full flex-1 min-h-0 bg-black/40 rounded border border-border overflow-hidden p-1">
          <img 
              src={`http://127.0.0.1:8000/api/live_heatmap/player/${jobId}?t=${Date.now()}`}
              alt="Player Heatmap"
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
          />
        </div>
      </div>

      {/* 3. Ball Heatmap */}
      <div className="stat-card relative flex flex-col flex-1 min-h-0 p-1.5">
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1 shrink-0">Ball Heat</span>
        <div className="relative mx-auto w-full flex-1 min-h-0 bg-black/40 rounded border border-border overflow-hidden p-1">
          <img 
              src={`http://127.0.0.1:8000/api/live_heatmap/ball/${jobId}?t=${Date.now()}`}
              alt="Ball Heatmap"
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen"
          />
        </div>
      </div>
    </div>
  );
};

export default BirdEyeMap;
