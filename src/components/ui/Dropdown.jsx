import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export const Dropdown = ({ trigger, align, top, chevron = true, children }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const clickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            !event.target.classList.contains("trigger") &&
            !event.target.closest(".trigger")
        ) {
            setOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            clickOutside(event);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const alignment = align === "left" ? "left-0" : "right-0";

    return (
        <div className="relative">
            <div className="trigger cursor-pointer flex items-center gap-2 font-medium shadow-sm text-sm border border-border rounded-md w-fit p-2" onClick={toggleDropdown}>
                {trigger}
                {chevron && (
                    <ChevronDown className={`icon-sm text-faint transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                )}
            </div>
            <div
                ref={dropdownRef}
                className={`absolute ${top} ${alignment} bg-primary shadow-sm border border-border transition-all duration-300 rounded-md p-3 select-none max-w-xs ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95 pointer-events-none"}`}
            >
                <div className="flex flex-col font-medium text-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};