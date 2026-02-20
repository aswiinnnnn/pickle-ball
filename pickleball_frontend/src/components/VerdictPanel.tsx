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
    <div className="stat-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Spatial Data</span>
        <Target className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-1 gap-1.5 mt-1">
        <div className="flex justify-between items-center bg-background/50 p-1.5 rounded">
          <span className="text-[9px] text-muted-foreground">Ball (X,Y)</span>
          <span className="text-[10px] font-mono font-bold text-yellow-400">{fmtPt(ball)}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 p-1.5 rounded">
          <span className="text-[9px] text-muted-foreground">Player 0 (X,Y)</span>
          <span className="text-[10px] font-mono font-bold text-green-500">{fmtPt(p0)}</span>
        </div>
        <div className="flex justify-between items-center bg-background/50 p-1.5 rounded">
          <span className="text-[9px] text-muted-foreground">Player 1 (X,Y)</span>
          <span className="text-[10px] font-mono font-bold text-blue-500">{fmtPt(p1)}</span>
        </div>
      </div>
    </div>
  );
};

export default SpatialPanel;
