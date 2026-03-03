interface SessionAnalyticsProps {
  stats?: any;
}

const SessionAnalytics = ({ stats }: SessionAnalyticsProps) => {
  const z = stats?.kitchen?.zone_counts || { backcourt_top: 0, kitchen: 0, backcourt_bottom: 0 };
  const rows = [
    { metric: "Top Backcrt", total: z.backcourt_top, avg: "Hits" },
    { metric: "Kitchen", total: z.kitchen, avg: "Hits" },
    { metric: "Bot Backcrt", total: z.backcourt_bottom, avg: "Hits" },
  ];

  return (
  <div className="stat-card h-full">
    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Zone Intrusions</span>
    <table className="w-full mt-1.5 text-xs font-mono">
      <thead>
        <tr className="text-muted-foreground">
          <th className="text-left pb-1 font-medium text-[10px]">Metric</th>
          <th className="text-right pb-1 font-medium text-[10px]">Total</th>
          <th className="text-right pb-1 font-medium text-[10px]">Avg</th>
        </tr>
      </thead>
      <tbody className="text-foreground">
        {rows.map((r) => (
          <tr key={r.metric} className="border-t border-border/50">
            <td className="py-1">{r.metric}</td>
            <td className="text-right py-1">{r.total}</td>
            <td className="text-right py-1 neon-text">{r.avg}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default SessionAnalytics;
