// components/theme/ThemeToggle.tsx
"use client";

import { useState, useRef, useEffect } from "react";

import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme, isSystemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { id: "light", label: "Light", icon: Sun, description: "Light theme" },
    { id: "dark", label: "Dark", icon: Moon, description: "Dark theme" },
    { id: "system", label: "System", icon: Monitor, description: "Use system theme" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    if (themeId === "system") {
      // Reset to system theme
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = systemPrefersDark ? "dark" : "light";
      setTheme(systemTheme);
      localStorage.removeItem("theme");
    } else {
      setTheme(themeId as "light" | "dark");
    }
    setIsOpen(false);
  };

  const getCurrentThemeIcon = () => {
    if (isSystemTheme) return Monitor;
    return theme === "dark" ? Moon : Sun;
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Theme toggle"
        aria-expanded={isOpen}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg px-3 py-2 text-sm font-medium
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          border
          bg-card hover:bg-muted
          border-border
          text-foreground
          hover:shadow-md
          min-w-[120px]
        `}
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="truncate">
          {isSystemTheme ? "System" : theme === "dark" ? "Dark" : "Light"}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="
          absolute right-0 top-full mt-2
          w-48 rounded-lg border border-border
          bg-card shadow-lg shadow-black/5
          z-50 overflow-hidden animate-fade-in
        ">
          <div className="py-1">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = 
                (themeOption.id === "system" && isSystemTheme) ||
                (themeOption.id === "light" && theme === "light" && !isSystemTheme) ||
                (themeOption.id === "dark" && theme === "dark" && !isSystemTheme);

              return (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeSelect(themeOption.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    text-sm transition-colors
                    hover:bg-muted
                    ${isActive ? "text-primary" : "text-foreground"}
                  `}
                  aria-label={`Switch to ${themeOption.label} theme`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{themeOption.label}</span>
                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Theme info footer */}
          <div className="border-t border-border px-4 py-2">
            <p className="text-xs text-muted-foreground">
              {isSystemTheme 
                ? "Using your system theme"
                : `Using ${theme} theme`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}