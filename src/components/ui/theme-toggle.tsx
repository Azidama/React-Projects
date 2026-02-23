import clsx from "clsx";
import { APP_THEMES } from "@/lib/theme";
import type { AppTheme } from "@/lib/theme";

type ThemeToggleProps = {
  theme: AppTheme;
  onChange: (theme: AppTheme) => void;
  className?: string;
};

export const ThemeToggle = ({ theme, onChange, className }: ThemeToggleProps) => {
  return (
    <div className={clsx("projects-home__theme-toggle", className)}>
      {APP_THEMES.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className="projects-home__theme-button"
          data-active={option === theme}
          aria-pressed={option === theme}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
