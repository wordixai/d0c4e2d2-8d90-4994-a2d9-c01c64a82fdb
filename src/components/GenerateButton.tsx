import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  disabled: boolean;
  isGenerating: boolean;
  onClick: () => void;
}

export function GenerateButton({ disabled, isGenerating, onClick }: GenerateButtonProps) {
  return (
    <Button
      size="lg"
      disabled={disabled || isGenerating}
      onClick={onClick}
      className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground glow-effect transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isGenerating ? (
        <>
          <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
          生成中...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 mr-2" />
          开始 AI 换装
        </>
      )}
    </Button>
  );
}
