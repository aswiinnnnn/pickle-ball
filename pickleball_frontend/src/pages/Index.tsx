import { useState } from "react";
import UploadScreen from "./UploadScreen";
import AnalysisScreen from "./AnalysisScreen";

const Index = () => {
  const [jobId, setJobId] = useState<string | null>(null);

  if (jobId) return <AnalysisScreen jobId={jobId} onBack={() => setJobId(null)} />;
  return <UploadScreen onAnalyze={(jId) => setJobId(jId)} />;
};

export default Index;
