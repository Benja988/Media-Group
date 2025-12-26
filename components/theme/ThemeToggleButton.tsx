// components/theme/ThemeToggleButton.tsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleButtonProps {
  variant?: "icon" | "text" | "both";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemeToggleButton({ 
  variant = "icon", 
  size = "md",
  className = "" 
}: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    border
    bg-card hover:bg-muted
    border-border
    text-foreground
    hover:shadow-md
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={baseClasses}
    >
      {variant !== "text" && (
        theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )
      )}
      
      {variant !== "icon" && (
        <span>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>
      )}
    </button>
  );
}