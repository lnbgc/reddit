import { useTheme } from "@contexts/ThemeContext"
import { DarkModeSwitch } from "react-toggle-dark-mode";

export const ThemeToggle = () => {

    const { darkMode, setDarkMode } = useTheme();

    const handleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <DarkModeSwitch
            checked={darkMode}
            onChange={handleTheme}
            size={20}
        />
    )
}