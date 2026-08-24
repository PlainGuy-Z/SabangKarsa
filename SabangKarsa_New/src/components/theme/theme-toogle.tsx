import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { useTranslation } from "react-i18next";
import "../../i18n/i18n"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-muted border border-border transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {/* Background track */}
      <div className="absolute inset-0 rounded-full bg-muted"></div>

      {/* Moving circle - made more rounded */}
      <div
        className={`absolute h-7 w-7 rounded-full bg-background border border-border shadow-lg transition-transform duration-200 ease-in-out ${
          theme === "light" ? "translate-x-[-10px]" : "translate-x-[10px]"
        }`}
      >
        <div className="flex h-full w-full items-center justify-center">
          {theme === "light" ? (
            <Sun className="h-3.5 w-3.5 text-foreground" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-foreground" />
          )}
        </div>
      </div>

      <span className="sr-only">{t("theme-toggle")}</span>
    </button>
  );
}
