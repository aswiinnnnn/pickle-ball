import { Monitor, Layers, Flame, Target, Crosshair } from "lucide-react";
import { useState, useEffect } from "react";
import ScorePanel from "@/components/ScorePanel";
import StatsPanel from "@/components/StatsPanel";
import VerdictPanel from "@/components/VerdictPanel";
import SessionAnalytics from "@/components/SessionAnalytics";
import BirdEyeMap from "@/components/BirdEyeMap";
import VideoPlayer from "@/components/VideoPlayer";

interface AnalysisScreenProps {
  jobId: string;
  onBack: () => void;
}

const AnalysisScreen = ({ jobId, onBack }: AnalysisScreenProps) => {
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/live_stats/${jobId}`);
        const data = await res.json();
        setLiveData(data);
      } catch (e) {
        // ignore network error
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [jobId]);

  const stats = liveData?.stats || {};

  return (
  <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
    {/* Top Bar */}
    <header className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <Monitor className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground tracking-tight">
          Pickle<span className="neon-text">Vision</span>
        </span>
        <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase ml-1">
          Smart Analytics
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
        <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
        RealTime Live 120 FPS
      </div>
    </header>

    {/* Main Content */}
    <div className="flex flex-1 min-h-0">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border p-3 flex flex-col gap-2 overflow-y-auto">
        <ScorePanel />
        <StatsPanel stats={stats} />
        <VerdictPanel />
        <SessionAnalytics stats={stats} />
      </aside>

      {/* Center - Video */}
      <main className="flex-1 p-3 min-w-0">
        <VideoPlayer jobId={jobId} liveData={liveData} />
      </main>

      {/* Right Sidebar */}
      <aside className="w-56 shrink-0 border-l border-border p-3 flex flex-col gap-2">
        <BirdEyeMap stats={stats} />

        {/* Quick Actions */}
        <div className="stat-card space-y-1.5 mt-auto">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Analysis Tools</span>
          {[
            { icon: Layers, label: "Analytic Overlay" },
            { icon: Flame, label: "Heatmap" },
            { icon: Target, label: "Player Tracking" },
            { icon: Crosshair, label: "Frame Quality" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-2 rounded bg-secondary/50 px-2.5 py-1.5 text-xs font-mono text-secondary-foreground hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          ))}
        </div>
      </aside>
    </div>

    {/* Bottom Bar */}
    <footer className="flex items-center justify-between border-t border-border px-4 py-1.5 shrink-0 text-[10px] font-mono text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>[SPACE] Pause</span>
        <span>[Q] Toggle EV</span>
        <span>[S] Save Clip</span>
      </div>
      <span>PickleVision v0.8.0</span>
    </footer>
  </div>
  );
};

export default AnalysisScreen;
