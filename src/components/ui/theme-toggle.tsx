"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nadya-theme";
type ThemeSetting = "light" | "dark" | "system";

const CYCLE: Record<ThemeSetting, ThemeSetting> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABELS: Record<ThemeSetting, string> = {
  light: "Thème clair",
  dark: "Thème sombre",
  system: "Thème automatique (système)",
};

function getStoredSetting(): ThemeSetting {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function prefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(setting: ThemeSetting) {
  const isDark = setting === "dark" || (setting === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Starts "system" on every render (server has no DOM/localStorage to
  // check) and corrects itself after mount — the blocking script in the
  // root layout already applied the real <html class="dark">, this only
  // syncs the icon + keeps it live while "system" is selected.
  const [setting, setSetting] = useState<ThemeSetting>("system");

  useEffect(() => {
    setSetting(getStoredSetting());
  }, []);

  useEffect(() => {
    if (setting !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [setting]);

  function cycle() {
    // Functional updater so rapid clicks always act on the latest state
    // rather than a value captured in this render's stale closure.
    setSetting((prev) => {
      const next = CYCLE[prev];
      applyTheme(next);
      try {
        if (next === "system") {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, next);
        }
      } catch {
        // private browsing / storage disabled — theme just won't persist
      }
      return next;
    });
  }

  return (
    <button type="button" onClick={cycle} aria-label={LABELS[setting]} className={className}>
      {setting === "light" && <SunIcon />}
      {setting === "dark" && <MoonIcon />}
      {setting === "system" && <SystemIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.5" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
      <path d="M8.5 20h7M12 16.5V20" strokeLinecap="round" />
    </svg>
  );
}
