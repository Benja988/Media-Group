"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        inline-flex items-center justify-center
        rounded-lg border border-border
        bg-card px-3 py-2 text-sm
        hover:bg-muted transition
      "
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
