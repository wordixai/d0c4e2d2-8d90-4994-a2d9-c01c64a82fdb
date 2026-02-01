import { useState, useCallback } from "react";
import { Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (image: string | null) => void;
  selectedImage: string | null;
}

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const clearImage = () => {
    onImageSelect(null);
  };

  if (selectedImage) {
    return (
      <div className="relative group">
        <div className="glass-card rounded-2xl overflow-hidden aspect-[3/4]">
          <img
            src={selectedImage}
            alt="上传的照片"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={clearImage}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone rounded-2xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer transition-all ${
        isDragging ? "border-primary bg-primary/5" : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <User className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 text-primary mb-2">
        <Upload className="w-5 h-5" />
        <span className="font-medium">上传您的照片</span>
      </div>
      <p className="text-sm text-muted-foreground text-center px-4">
        拖放图片到此处，或点击选择文件
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        支持 JPG, PNG 格式
      </p>
    </div>
  );
}
