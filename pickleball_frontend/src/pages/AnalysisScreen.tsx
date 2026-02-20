import { Monitor, Layers, Flame, Target, Crosshair } from "lucide-react";
import { useState, useEffect } from "react";
import OperationalPanel from "@/components/ScorePanel"; // Renamed ScorePanel to OperationalPanel
import StatsPanel from "@/components/StatsPanel";
import SpatialPanel from "@/components/VerdictPanel"; // Renamed VerdictPanel to SpatialPanel
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

    </header>

    {/* Main Content */}
    <div className="flex flex-1 min-h-0">
      {/* Left Sidebar */}
      <aside className="w-48 shrink-0 border-r border-border p-2 flex flex-col gap-2">
        <OperationalPanel stats={stats} />
        <StatsPanel stats={stats} />
        <SpatialPanel stats={stats} />
        <SessionAnalytics stats={stats} />
      </aside>

      {/* Center - Video */}
      <main className="flex-1 p-2 min-w-0">
        <VideoPlayer jobId={jobId} liveData={liveData} />
      </main>

      {/* Right Sidebar */}
      <aside className="w-56 shrink-0 border-l border-border p-2 flex flex-col gap-2">
        <BirdEyeMap jobId={jobId} stats={stats} />


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
