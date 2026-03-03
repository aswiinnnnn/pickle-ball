import { Target } from "lucide-react";

interface SpatialPanelProps {
  stats?: any;
}

const SpatialPanel = ({ stats }: SpatialPanelProps) => {
  const sp = stats?.spatial || {};
  const ball = sp.ball_birdseye || [0, 0];
  const p0 = sp.player_birdseye ? sp.player_birdseye["0"] : [0, 0];
  const p1 = sp.player_birdseye ? sp.player_birdseye["1"] : [0, 0];

  const fmtPt = (pt: any) => {
    if (Array.isArray(pt) && pt.length >= 2) {
      return `${Math.round(pt[0])}, ${Math.round(pt[1])}`;
    }
    return "0, 0";
  };

  return (
    <div className="stat-card h-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Spatial Data</span>
        <Target className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center bg-background/50 px-2 py-1 rounded">
          <span className="text-[11px] text-muted-foreground">Ball</span>
          <span className="text-xs font-mono font-bold text-yellow-400">{fmtPt(ball)}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 px-2 py-1 rounded">
          <span className="text-[11px] text-muted-foreground">Player A</span>
          <span className="text-xs font-mono font-bold text-green-500">{fmtPt(p0)}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 px-2 py-1 rounded">
          <span className="text-[11px] text-muted-foreground">Player B</span>
          <span className="text-xs font-mono font-bold text-blue-500">{fmtPt(p1)}</span>
        </div>
      </div>
    </div>
  );
};

export default SpatialPanel;
