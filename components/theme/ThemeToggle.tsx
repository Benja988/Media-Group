"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const baseClasses = "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition";
  const lightClasses = "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200";
  const darkClasses = "bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`${baseClasses} ${theme === "dark" ? darkClasses : lightClasses}`}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
