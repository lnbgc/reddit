export const FileInput = ({ onChange, icon, label }) => {
    return (
        <div className="font-medium text-sm flex items-center gap-2 border border-border rounded-md shadow-sm p-2 w-fit">
            {icon}
            <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={onChange} className="hidden" />
                {label}
            </label>
        </div>
    )
}
