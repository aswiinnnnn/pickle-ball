import { LayoutGrid } from "lucide-react";

interface OperationalPanelProps {
  stats?: any;
}

const OperationalPanel = ({ stats }: OperationalPanelProps) => {
  const ops = stats?.operational || {};
  const isRally = stats?.rally?.is_active ? "TRUE" : "FALSE";
  const progress = ops.total_frames ? ((ops.current_frame / ops.total_frames) * 100).toFixed(1) : "0.0";

  return (
    <div className="stat-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Operational</span>
        <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div>
          <span className="text-[10px] text-muted-foreground">FPS</span>
          <div className="text-sm font-mono font-bold">{ops.fps || 0}</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Progress</span>
          <div className="text-sm font-mono font-bold">{progress}%</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Frame</span>
          <div className="text-sm font-mono font-bold">{ops.current_frame || 0} / {ops.total_frames || 0}</div>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground">Rally Active</span>
          <div className={`text-sm font-mono font-bold ${stats?.rally?.is_active ? 'text-green-500' : 'text-red-500'}`}>{isRally}</div>
        </div>
      </div>
    </div>
  );
};

export default OperationalPanel;
