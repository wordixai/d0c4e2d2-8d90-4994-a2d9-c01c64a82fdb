import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-effect">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">AI换装</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            功能介绍
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            作品展示
          </a>
        </nav>
      </div>
    </header>
  );
}
