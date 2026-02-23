export type AppTheme = "neon" | "light" | "dark";

export const APP_THEME_STORAGE_KEY = "app-theme";
export const APP_THEMES: AppTheme[] = ["neon", "light", "dark"];

export const isAppTheme = (value: string | null): value is AppTheme =>
  value === "neon" || value === "light" || value === "dark";

export const getStoredTheme = (): AppTheme => {
  if (typeof window === "undefined") return "neon";
  const value = window.localStorage.getItem(APP_THEME_STORAGE_KEY);
  return isAppTheme(value) ? value : "neon";
};

export const applyTheme = (theme: AppTheme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
};

