export const Button = ({ onClick, children, type, width }) => {
    
    let classes = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm px-4 py-2 select-none outline-none";

    if (width === "full") {
        classes += " w-full";
    }

    switch (type) {
        case "primary":
            classes += " bg-accent text-white dark:text-primary hover:bg-accentHover";
            break;
        case "secondary":
            classes += " border border-border text-normal hover:bg-secondary";
            break;
        case "loading":
            classes += " bg-loading text-white";
            onClick = null;
            break;
        case "disabled":
            classes += " bg-secondary text-faint cursor-not-allowed";
            onClick = null;
            break;
        default:
            classes += " border border-border text-normal hover:bg-secondary";
            break;
    }

    return (
        <button onClick={onClick} className={classes}>
            {children}
        </button>
    )
}