import { useEffect, useState } from "react";

export const Textarea = ({ placeholder, label, error, description, value, onChange, ...rest }) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-medium ml-1">{label}</label>}
      {error && <span className="error ml-1">{error}</span>}
      <div className="border border-border shadow-sm rounded-md p-2 focus-within:ring-1 focus-within:ring-faint">
        <textarea
          className="w-full resize-none text-sm text-normal bg-transparent outline-none placeholder:text-faint min-h-[6rem]"
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onInput={handleResize}
          {...rest}
        />
      </div>
      {description && <label className="text-xs text-muted ml-1">{description}</label>}
    </div>
  );
};