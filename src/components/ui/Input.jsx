import { useState } from "react"
import { Eye, EyeOff } from "lucide-react";

export const Input = (({ label, error, description, type, value, onChange, icon, ...rest }) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-xs font-medium ml-1">{label}</label>
            }
            {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
            <div className="relative focus-within:ring-1 focus-within:ring-faint border border-border shadow-sm rounded-md w-full">
                {icon && <div className="icon-sm absolute top-2 left-3 inline-flex items-center">{icon}</div>}
                <input
                    type={type === "password" && showPassword ? "text" : type}
                    value={value}
                    onChange={onChange}
                    className={`pr-3 outline-none w-full p-2 text-sm text-normal rounded-md bg-transparent placeholder:text-faint ${icon ? "pl-10" : ""}`}
                    {...rest}
                />
                {type === 'password' && (
                    <div
                        className="icon-sm absolute top-2 right-3 inline-flex items-center cursor-pointer"
                        onClick={togglePassword}
                    >
                        {showPassword ? <Eye className="icon-sm text-faint" /> : <EyeOff className="icon-sm text-faint" />}
                    </div>
                )}
            </div>
            {description && <label className="text-xs text-muted ml-1">{description}</label>}
        </div>
    )
})