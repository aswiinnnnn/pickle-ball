import { Upload, Play, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import demoThumb from "@/assets/demo-thumbnail.jpg";
import { toast } from "sonner";

interface UploadScreenProps {
  onAnalyze: (jobId: string) => void;
}

const UploadScreen = ({ onAnalyze }: UploadScreenProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setSelectedFile(file);
  };

  const uploadAndAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onAnalyze(data.job_id);
    } catch (e) {
      toast.error("Failed to upload video to backend.");
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Title */}
        <div>
          <h1 className="text-5xl font-black tracking-tight uppercase">
            <span className="text-primary">Pickle</span>
            <span className="neon-text">Vision</span>
          </h1>
          <p className="mt-2 text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">
            AI Pickleball Match Analysis
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`relative rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
            dragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/30 hover:border-primary/60"
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-base text-foreground">
                {fileName ? fileName : "Drag & drop your match video here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">or</p>
            </div>
            <button
              type="button"
              className="rounded-full border-2 border-primary px-8 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
            >
              Upload Match Video
            </button>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4 / MOV / AVI
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">or try a sample</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Sample Videos */}
        <div className="grid grid-cols-2 gap-3">
          {["Singles Match – Pro", "Doubles Rally – Amateur"].map((title, i) => (
            <button
              key={i}
              onClick={() => onAnalyze("")}
              className="group relative rounded-lg overflow-hidden border border-border hover:border-primary/60 transition-all text-left"
            >
              <img
                src={demoThumb}
                alt="Sample match"
                className="w-full h-24 object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/30 group-hover:bg-primary/50 transition-colors">
                  <Play className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="px-3 py-2 bg-card">
                <p className="text-xs font-semibold text-foreground">{title}</p>
                <p className="text-[10px] text-muted-foreground font-mono">0{i + 2}:{i === 0 ? "34" : "18"}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Start Analysis Button */}
        <button
          disabled={isUploading || !selectedFile}
          onClick={uploadAndAnalyze}
          className="w-full rounded-lg bg-primary/80 hover:bg-primary py-4 flex items-center justify-center gap-2 text-base font-bold font-mono uppercase tracking-widest text-primary-foreground transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin h-5 w-5" /> : "Start Analysis"}
        </button>
      </div>
    </div>
  );
};

export default UploadScreen;
