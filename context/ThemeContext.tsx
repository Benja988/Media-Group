// app/context/ThemeContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setIsMounted(true);
    
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme) {
      setThemeState(storedTheme);
      setIsSystemTheme(false);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const systemTheme: Theme = systemPrefersDark ? "dark" : "light";
      setThemeState(systemTheme);
      setIsSystemTheme(true);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!isSystemTheme || !isMounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? "dark" : "light";
      setThemeState(newTheme);
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isSystemTheme, isMounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setIsSystemTheme(false);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Reset to system theme
  const resetToSystem = useCallback(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme: Theme = systemPrefersDark ? "dark" : "light";
    
    setThemeState(systemTheme);
    setIsSystemTheme(true);
    document.documentElement.classList.toggle("dark", systemPrefersDark);
    localStorage.removeItem("theme");
  }, []);

  // Add a CSS class for transition control
  useEffect(() => {
    const timeout = setTimeout(() => {
      document.documentElement.classList.add('theme-transition-ready');
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
    isSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}