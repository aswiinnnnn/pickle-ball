interface BirdEyeMapProps {
  stats?: any;
}

const BirdEyeMap = ({ stats }: BirdEyeMapProps) => {
  const playersInKitchen = stats?.kitchen?.players_in_kitchen || [];
  
  return (
  <div className="stat-card relative">
    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Bird's Eye View</span>
    <div className="mt-2 relative mx-auto" style={{ width: "100%", aspectRatio: "1.5" }}>
      <svg viewBox="0 0 300 200" className="w-full h-full">
        {/* Outer boundary */}
        <rect x="5" y="5" width="290" height="190" rx="4" fill="hsl(145 30% 12%)" stroke="hsl(145 60% 30% / 0.3)" strokeWidth="1" />

        {/* Court surface */}
        <rect x="20" y="15" width="260" height="170" rx="2" fill="hsl(145 35% 22%)" stroke="hsl(0 0% 100% / 0.4)" strokeWidth="1.2" />

        {/* Court surface texture lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="20" y1={15 + i * 15.5} x2="280" y2={15 + i * 15.5} stroke="hsl(145 30% 25% / 0.3)" strokeWidth="0.3" />
        ))}

        {/* Center/Net line */}
        <line x1="150" y1="15" x2="150" y2="185" stroke="hsl(0 0% 100% / 0.7)" strokeWidth="1.5" />
        {/* Net posts */}
        <circle cx="150" cy="15" r="2.5" fill="hsl(0 0% 60%)" />
        <circle cx="150" cy="185" r="2.5" fill="hsl(0 0% 60%)" />

        {/* Kitchen / NVZ lines */}
        <rect x="105" y="15" width="90" height="170" fill="hsl(145 40% 18% / 0.4)" stroke="none" />
        <line x1="105" y1="15" x2="105" y2="185" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="0.8" strokeDasharray="4 2" />
        <line x1="195" y1="15" x2="195" y2="185" stroke="hsl(0 0% 100% / 0.5)" strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="150" y="104" textAnchor="middle" fill="hsl(0 0% 100% / 0.12)" fontSize="10" fontFamily="monospace">NVZ</text>

        {/* Service boxes - left side */}
        <line x1="20" y1="100" x2="105" y2="100" stroke="hsl(0 0% 100% / 0.35)" strokeWidth="0.6" />
        {/* Service boxes - right side */}
        <line x1="195" y1="100" x2="280" y2="100" stroke="hsl(0 0% 100% / 0.35)" strokeWidth="0.6" />

        {/* Baseline labels */}
        <text x="62" y="196" textAnchor="middle" fill="hsl(0 0% 100% / 0.15)" fontSize="7" fontFamily="monospace">NEAR</text>
        <text x="238" y="196" textAnchor="middle" fill="hsl(0 0% 100% / 0.15)" fontSize="7" fontFamily="monospace">FAR</text>

        {/* Player A - position with glow */}
        <circle cx="70" cy="110" r="10" fill={playersInKitchen.includes(0) ? "hsl(0 90% 50% / 0.25)" : "hsl(145 80% 42% / 0.15)"} />
        <circle cx="70" cy="110" r="6" fill={playersInKitchen.includes(0) ? "hsl(0 90% 50%)" : "hsl(145 80% 42%)"} stroke="hsl(145 80% 60%)" strokeWidth="1">
          <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="70" y="113" textAnchor="middle" fill="hsl(220 20% 7%)" fontSize="8" fontWeight="bold" fontFamily="monospace">0</text>

        {/* Player A movement trail */}
        <path d="M 55 130 Q 60 120 70 110" fill="none" stroke="hsl(145 80% 42% / 0.3)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Player B - position with glow */}
        <circle cx="230" cy="80" r="10" fill={playersInKitchen.includes(1) ? "hsl(0 90% 50% / 0.25)" : "hsl(190 90% 50% / 0.15)"} />
        <circle cx="230" cy="80" r="6" fill={playersInKitchen.includes(1) ? "hsl(0 90% 50%)" : "hsl(190 90% 50%)"} stroke="hsl(190 90% 65%)" strokeWidth="1">
          <animate attributeName="r" values="6;7;6" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        <text x="230" y="83" textAnchor="middle" fill="hsl(220 20% 7%)" fontSize="8" fontWeight="bold" fontFamily="monospace">1</text>

        {/* Player B movement trail */}
        <path d="M 250 65 Q 240 72 230 80" fill="none" stroke="hsl(190 90% 50% / 0.3)" strokeWidth="1" strokeDasharray="3 2" />

        {/* Ball with glow */}
        <circle cx="140" cy="95" r="6" fill="hsl(50 100% 60% / 0.1)" />
        <circle cx="140" cy="95" r="3.5" fill="hsl(50 100% 60%)" stroke="hsl(50 100% 70%)" strokeWidth="0.5">
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Ball trajectory */}
        <path d="M 70 110 Q 100 85 140 95" fill="none" stroke="hsl(50 100% 60% / 0.4)" strokeWidth="0.8" strokeDasharray="4 2">
          <animate attributeName="stroke-dashoffset" values="0;-6" dur="0.5s" repeatCount="indefinite" />
        </path>

        {/* Shot speed label */}
        <rect x="100" y="75" width="36" height="12" rx="2" fill="hsl(220 20% 7% / 0.7)" />
        <text x="118" y="84" textAnchor="middle" fill="hsl(50 100% 60%)" fontSize="7" fontFamily="monospace">42mph</text>

        {/* Landing zone indicator */}
        <ellipse cx="140" cy="95" rx="8" ry="5" fill="none" stroke="hsl(145 80% 42% / 0.4)" strokeWidth="0.6" strokeDasharray="2 1">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  </div>
  );
};

export default BirdEyeMap;
