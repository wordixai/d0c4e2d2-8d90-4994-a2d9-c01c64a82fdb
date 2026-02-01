import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { StyleSelector, styles } from "@/components/StyleSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { GenerateButton } from "@/components/GenerateButton";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !selectedStyle) return;

    setIsGenerating(true);
    setResult(null);

    try {
      // Get the selected style's prompt
      const style = styles.find((s) => s.id === selectedStyle);
      if (!style) {
        throw new Error("请选择有效的风格");
      }

      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("virtual-try-on", {
        body: {
          personImage: selectedImage,
          clothingDescription: style.prompt,
        },
      });

      if (error) {
        throw error;
      }

      // 打印完整的API响应
      console.log("=== AI Gateway Response ===");
      console.log("Full Response:", JSON.stringify(data, null, 2));
      console.log("=== End Response ===");

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.image) {
        setResult(data.image);
        toast.success("换装完成！");
      } else {
        throw new Error("未能生成图片，请重试");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage, selectedStyle]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const canGenerate = selectedImage && selectedStyle && !isGenerating;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">AI 智能换装</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            上传您的照片，选择喜欢的风格，让 AI 为您打造全新造型
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Upload & Result */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">上传照片</h3>
                <ImageUpload
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">生成结果</h3>
                <ResultDisplay
                  result={result}
                  isGenerating={isGenerating}
                  onRegenerate={handleRegenerate}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Style Selection */}
          <div>
            <StyleSelector
              selectedStyle={selectedStyle}
              onStyleSelect={setSelectedStyle}
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="max-w-md mx-auto">
          <GenerateButton
            disabled={!canGenerate}
            isGenerating={isGenerating}
            onClick={handleGenerate}
          />
          {!selectedImage && !selectedStyle && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              请先上传照片并选择风格
            </p>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text">为什么选择我们</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">极速生成</h3>
              <p className="text-sm text-muted-foreground">先进的 AI 算法，秒级生成高质量换装效果</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">多样风格</h3>
              <p className="text-sm text-muted-foreground">涵盖日常、商务、潮流等多种穿搭风格</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">隐私安全</h3>
              <p className="text-sm text-muted-foreground">您的照片仅用于生成，不会被存储或泄露</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center text-sm text-muted-foreground">
          <p>© 2024 AI换装. 让时尚触手可及</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
