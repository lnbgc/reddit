import { useEffect, useState } from "react"
import { useTheme } from "@contexts/ThemeContext"
import { Link } from "react-router-dom"
import { ROOT } from "@routes/routes"
import SmallLogoDark from "@assets/reddit-small-dark.svg"
import SmallLogo from "@assets/reddit-small.svg"
import FullLogo from "@assets/reddit-full.svg"
import FullLogoDark from "@assets/reddit-full-dark.svg"

export const Logo = ({ type, ...rest }) => {
    const { darkMode: isDarkMode } = useTheme();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    let logo;

    if (type === "small") {
        logo = isDarkMode ? SmallLogoDark : SmallLogo
    } else if (type === "full") {
        logo = isDarkMode ? FullLogoDark : FullLogo
    } else if (type === "responsive") {
        if (windowWidth > 768) {
            logo = isDarkMode ? FullLogoDark : FullLogo
        } else {
            logo = isDarkMode ? SmallLogoDark : SmallLogo
        }
    }

    return (
        <Link to={ROOT}>
            <img src={logo} alt="Reddit Logo" {...rest} />
        </Link>
    )
}