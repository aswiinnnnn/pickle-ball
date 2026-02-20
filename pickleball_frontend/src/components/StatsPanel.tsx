import { TrendingUp } from "lucide-react";

interface StatsPanelProps {
  stats?: any;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const rallyFrames = stats?.rally?.current_rally_s ? (stats.rally.current_rally_s * 30).toFixed(0) : 0;
  const tempo = stats?.rally?.tempo_rallies_per_min || 0;
  
  return (
  <div className="space-y-2">
    {/* Match Tempo */}
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Match Tempo</span>
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
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Avg Rally</span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-mono font-bold text-foreground">{stats?.rally?.avg_rally_s ? stats.rally.avg_rally_s.toFixed(1) : "0.0"}</span>
          <span className="text-[10px] font-mono text-muted-foreground">s</span>
        </div>
        <div className="mt-1 flex justify-between items-center text-[9px] font-mono text-muted-foreground">
          <span>Longest:</span>
          <span className="text-primary font-bold">{stats?.rally?.longest_rally_s ? stats.rally.longest_rally_s.toFixed(1) : "0.0"}s</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default StatsPanel;
