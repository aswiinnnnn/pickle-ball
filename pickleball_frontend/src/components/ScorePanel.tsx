import { LayoutGrid } from "lucide-react";

interface OperationalPanelProps {
  stats?: any;
}

const OperationalPanel = ({ stats }: OperationalPanelProps) => {
  const ops = stats?.operational || {};
  const isRally = stats?.rally?.is_active ? "TRUE" : "FALSE";
  const progress = ops.total_frames ? ((ops.current_frame / ops.total_frames) * 100).toFixed(1) : "0.0";
  const scoreData = stats?.spatial?.score_data?.score || { player_a_top: 0, player_b_bottom: 0 };

  return (
    <div className="stat-card h-full flex flex-col gap-2">
      {/* Match Score Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Match Score</span>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 pulse-dot" />
            <span className="text-[9px] font-mono text-green-500 uppercase">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <div className="bg-background/40 p-1.5 rounded-md text-center border border-border/50">
            <div className="text-[9px] text-muted-foreground uppercase mb-0.5">Player A</div>
            <div className="text-2xl font-mono font-bold text-green-500">{scoreData.player_a_top}</div>
          </div>
          <div className="bg-background/40 p-1.5 rounded-md text-center border border-border/50">
            <div className="text-[9px] text-muted-foreground uppercase mb-0.5">Player B</div>
            <div className="text-2xl font-mono font-bold text-blue-500">{scoreData.player_b_bottom}</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/50 w-full" />

      {/* Operational Section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Status & Performance</span>
          <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-4 gap-1 text-center">
          <div>
            <span className="text-[10px] text-muted-foreground block">FPS</span>
            <span className="text-xs font-mono font-bold">{ops.fps || 0}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Progress</span>
            <span className="text-xs font-mono font-bold">{progress}%</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Frame</span>
            <span className="text-xs font-mono font-bold">{ops.current_frame || 0}/{ops.total_frames || 0}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Rally</span>
            <span className={`text-xs font-mono font-bold ${stats?.rally?.is_active ? 'text-green-500' : 'text-red-500'}`}>{isRally}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalPanel;
