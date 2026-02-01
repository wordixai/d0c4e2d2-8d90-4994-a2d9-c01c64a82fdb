import { Download, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultDisplayProps {
  result: string | null;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export function ResultDisplay({ result, isGenerating, onRegenerate }: ResultDisplayProps) {
  if (isGenerating) {
    return (
      <div className="glass-card rounded-2xl aspect-[3/4] flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-foreground font-medium mb-2">AI 正在生成中...</p>
        <p className="text-sm text-muted-foreground">这可能需要几秒钟</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card rounded-2xl aspect-[3/4] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-center px-4">
          生成结果将在此显示
        </p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="glass-card rounded-2xl overflow-hidden aspect-[3/4]">
        <img
          src={result}
          alt="生成结果"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="secondary" className="flex-1" onClick={onRegenerate}>
          <RefreshCw className="w-4 h-4 mr-2" />
          重新生成
        </Button>
        <Button variant="secondary" size="icon">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
