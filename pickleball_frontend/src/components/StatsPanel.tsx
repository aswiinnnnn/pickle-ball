import { TrendingUp, Zap } from "lucide-react";

interface StatsPanelProps {
  stats?: any;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const rallyFrames = stats?.rally?.current_rally_s ? (stats.rally.current_rally_s * 30).toFixed(0) : 0;
  const tempo = stats?.rally?.tempo_rallies_per_min || 0;
  const ballSpeed = stats?.spatial?.ball_speed || {};
  const currentMph = ballSpeed.current_mph || 0;
  const maxMph = ballSpeed.max_mph || 0;
  const speedPct = Math.min(currentMph / Math.max(maxMph, 1), 1) * 100;
  
  return (
  <div className="flex flex-col gap-1.5 h-full">
    {/* Ball Speed + Match Tempo side by side */}
    <div className="flex-1 grid grid-cols-2 gap-1.5">
      <div className="stat-card flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Ball Speed</span>
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-mono font-bold text-yellow-400">{currentMph.toFixed(1)}</span>
          <span className="text-xs font-mono text-muted-foreground">MPH</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full mt-auto">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${speedPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-0.5">
          <span>Max:</span>
          <span className="text-yellow-400 font-bold">{maxMph.toFixed(1)}</span>
        </div>
      </div>

      <div className="stat-card flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Tempo</span>
          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-mono font-bold neon-text">{tempo.toFixed(1)}</span>
          <span className="text-xs font-mono text-muted-foreground">R/M</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground mt-auto">Rallies/min</span>
      </div>
    </div>

    {/* Rally Length */}
    <div className="flex-1 grid grid-cols-2 gap-1.5">
      <div className="stat-card flex flex-col">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Current Rally</span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xl font-mono font-bold text-foreground">{rallyFrames}</span>
          <span className="text-xs font-mono text-muted-foreground">frames</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full mt-auto">
          <div className="h-full w-[70%] bg-primary rounded-full" />
        </div>
      </div>
      <div className="stat-card flex flex-col">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Avg Rally</span>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xl font-mono font-bold text-foreground">{stats?.rally?.avg_rally_s ? stats.rally.avg_rally_s.toFixed(1) : "0.0"}</span>
          <span className="text-xs font-mono text-muted-foreground">s</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-auto">
          <span>Longest:</span>
          <span className="text-primary font-bold">{stats?.rally?.longest_rally_s ? stats.rally.longest_rally_s.toFixed(1) : "0.0"}s</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default StatsPanel;
