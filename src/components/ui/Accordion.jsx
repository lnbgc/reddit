import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const Accordion = ({ items, counter }) => {
  const [open, setOpen] = useState([]);

  const toggleOpen = (id) => {
    if (open.includes(id)) {
      setOpen(open.filter((itemID) => itemID !== id));
    } else {
      setOpen([...open, id]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {items.map((item, id) => (
        <div key={id}>
          <div
            className="flex justify-between items-center p-2 border-b border-border text-sm text-normal font-medium cursor-pointer"
            onClick={() => toggleOpen(id)}
          >
            <span>{`${counter ? id + 1 + ". " : ""}${item.title}`}</span>
            <ChevronDown
              className={`icon-sm  text-faint transition-transform duration-300 transform ${
                open.includes(id) ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {open.includes(id) && (
            <div className="text-sm p-3">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};
