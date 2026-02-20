import { LayoutGrid } from "lucide-react";

const ScorePanel = () => (
  <div className="stat-card space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Score</span>
      <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <div className="flex items-baseline gap-3">
      <span className="text-4xl font-mono font-black text-foreground">11</span>
      <span className="text-2xl font-mono font-bold text-muted-foreground">-</span>
      <span className="text-4xl font-mono font-black text-foreground">09</span>
    </div>
    <span className="text-xs font-mono text-primary">+2 Lead</span>
  </div>
);

export default ScorePanel;
