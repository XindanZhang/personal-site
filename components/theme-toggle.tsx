"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function handleTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div className="theme-toggle" aria-label="Theme">
      <span className="theme-label">Theme</span>
      <div className="theme-switches">
        <button
          aria-pressed={theme === "dark"}
          className={`key-switch ${theme === "dark" ? "is-active" : ""}`}
          onClick={() => handleTheme("dark")}
          type="button"
        >
          Dark
        </button>
        <button
          aria-pressed={theme === "light"}
          className={`key-switch ${theme === "light" ? "is-active" : ""}`}
          onClick={() => handleTheme("light")}
          type="button"
        >
          Light
        </button>
      </div>
    </div>
  );
}
