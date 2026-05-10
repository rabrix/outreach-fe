"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative p-2.5 rounded-full transition-all duration-300",
        "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
        "border border-border hover:border-border/80 shadow-sm"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 transition-all duration-500 transform",
            theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          )}
          size={20}
        />
        <Moon
          className={cn(
            "absolute inset-0 transition-all duration-500 transform",
            theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          )}
          size={20}
        />
      </div>
    </button>
  );
}
