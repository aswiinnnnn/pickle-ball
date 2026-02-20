const VerdictPanel = () => (
  <div className="stat-card flex flex-col items-center justify-center py-4" style={{ borderColor: "hsl(var(--verdict-in) / 0.5)" }}>
    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Verdict</span>
    <span className="text-4xl font-mono font-black text-verdict-in" style={{ textShadow: "0 0 20px hsl(145 80% 42% / 0.6)" }}>
      IN
    </span>
    <span className="text-[10px] font-mono text-muted-foreground mt-1">Confidence: 98.6%</span>
  </div>
);

export default VerdictPanel;
