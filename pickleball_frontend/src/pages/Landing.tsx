import { useNavigate } from "react-router-dom";
import { Play, Activity, Target, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero_bg.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-40" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex items-center justify-center space-x-3">
          <div className="rounded-xl bg-primary/20 p-3 backdrop-blur-md ring-1 ring-primary/40">
            <Activity className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
            Pickle<span className="text-primary italic">Vision</span>
          </h1>
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
          Advanced AI-powered analytics for the next generation of pickleball players. 
          Analyze your game with spatial data, heatmaps, and elite performance metrics.
        </p>

        <div className="mt-10 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <button
            onClick={() => navigate("/app")}
            className="group relative flex items-center space-x-3 overflow-hidden rounded-full bg-primary px-8 py-4 text-lg font-bold text-background transition-all hover:scale-105 hover:pr-10 active:scale-95"
          >
            <span className="relative z-10">Explore Analytics</span>
            <Play className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-0" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/5 p-6 backdrop-blur-lg ring-1 ring-white/10 transition-all hover:bg-white/10">
            <Target className="h-8 w-8 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Spatial Accuracy</h3>
            <p className="text-sm text-muted-foreground">Bird's-eye court mapping and player tracking.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/5 p-6 backdrop-blur-lg ring-1 ring-white/10 transition-all hover:bg-white/10">
            <Zap className="h-8 w-8 text-primary" />
            <h3 className="text-lg font-bold text-white">Ball Speed</h3>
            <p className="text-sm text-muted-foreground">Real-time MPH estimation and noise filtering.</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white/5 p-6 backdrop-blur-lg ring-1 ring-white/10 transition-all hover:bg-white/10">
            <Activity className="h-8 w-8 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Heatmaps</h3>
            <p className="text-sm text-muted-foreground">Automated landing and movement zones.</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground opacity-50">
        Engineered for Advanced Performance Analysis
      </div>
    </div>
  );
};

export default Landing;
