import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const savedTheme = localStorage.getItem("theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedDarkMode = savedTheme === "dark" || (savedTheme === null && preferredTheme);

    const [darkMode, setDarkMode] = useState(savedDarkMode);

    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");

        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);


    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext);
}