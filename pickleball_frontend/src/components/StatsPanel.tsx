import { TrendingUp } from "lucide-react";

interface StatsPanelProps {
  stats?: any;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const rallyFrames = stats?.rally?.current_rally_s ? (stats.rally.current_rally_s * 30).toFixed(0) : 0;
  const tempo = stats?.rally?.tempo_rallies_per_min || 0;
  
  return (
  <div className="space-y-2">
    {/* Ball Speed */}
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Ball Speed</span>
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-3xl font-mono font-bold neon-text">{tempo.toFixed(1)}</span>
        <span className="text-sm font-mono text-muted-foreground">R/MIN</span>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">Rallies per minute</span>
    </div>

    {/* Rally Length & Accuracy */}
    <div className="grid grid-cols-2 gap-2">
      <div className="stat-card">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Current Rally</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-2xl font-mono font-bold text-foreground">{rallyFrames}</span>
          <span className="text-xs font-mono text-muted-foreground">frames</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full mt-1.5">
          <div className="h-full w-[70%] bg-primary rounded-full" />
        </div>
      </div>
      <div className="stat-card">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">In/Out Accuracy</span>
        <span className="text-2xl font-mono font-bold text-foreground mt-1 block">98.2%</span>
        <span className="text-[10px] font-mono text-muted-foreground">Confidence Score</span>
      </div>
    </div>
  </div>
  );
};

export default StatsPanel;
