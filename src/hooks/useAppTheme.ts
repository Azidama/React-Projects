import { useEffect, useState } from "react";
import { APP_THEME_STORAGE_KEY, applyTheme, getStoredTheme } from "@/lib/theme";
import type { AppTheme } from "@/lib/theme";

export const useAppTheme = () => {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
};
