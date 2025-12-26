// components/theme/ThemeIndicator.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeIndicator() {
  const { theme, isSystemTheme } = useTheme();

  const getThemeInfo = () => {
    if (isSystemTheme) {
      return {
        icon: Monitor,
        text: "System theme",
        description: "Following your system preferences",
      };
    }
    
    return theme === "dark" 
      ? {
          icon: Moon,
          text: "Dark theme",
          description: "Manually set to dark mode",
        }
      : {
          icon: Sun,
          text: "Light theme",
          description: "Manually set to light mode",
        };
  };

  const themeInfo = getThemeInfo();
  const Icon = themeInfo.icon;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{themeInfo.text}</p>
        <p className="text-xs text-muted-foreground">{themeInfo.description}</p>
      </div>
    </div>
  );
}