
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  return (
    <div>
      {theme === "light" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleThemeChange("dark")}
        >
          <Sun className="h-5 w-5" />
        </Button>
      )}
      {theme === "dark" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleThemeChange("light")}
        >
          <Moon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ThemeSwitcher;
