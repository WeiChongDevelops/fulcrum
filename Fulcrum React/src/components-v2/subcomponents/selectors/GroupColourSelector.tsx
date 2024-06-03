import "../../../css/Budget.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { groupColourArray } from "../../../utility/util.ts";
import { BasicGroupData } from "@/utility/types.ts";
import { cn } from "@/lib/utils.ts";

interface GroupColourSelectorProps {
  oldColour?: string;
  setFormData: Dispatch<SetStateAction<BasicGroupData>>;
  className?: string;
}

/**
 * A visual selector for the user to choose a colour for a budget category group.
 */
export default function GroupColourSelector({ oldColour = "#fff", setFormData, className }: GroupColourSelectorProps) {
  const [selectedColour, setSelectedColour] = useState(oldColour);
  const [isActive, setIsActive] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleColourSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedColour(e.currentTarget.getAttribute("data-value")!);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!!selectorRef.current) {
        if (selectorRef.current.contains(e.target as Node)) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, colour: selectedColour }));
  }, [selectedColour]);

  return (
    <div
      ref={selectorRef}
      className={cn(
        `grid grid-cols-4 place-items-center gap-6 outline outline-1 transition-all duration-100 ease-out shadow p-6 rounded-lg ${isActive ? "outline-primary" : "outline-muted"}`,
        className,
      )}
    >
      {groupColourArray.map((colour, key) => {
        return (
          <div
            data-value={colour}
            className={`transition-all duration-250 ease-out size-10 rounded-full origin-center hover:cursor-pointer saturate-[400%] brightness-[98%] ${selectedColour === colour && "outline outline-2 outline-offset-4"}`}
            style={{ backgroundColor: colour, outlineColor: colour }}
            key={key}
            onClick={handleColourSelection}
          ></div>
        );
      })}
    </div>
  );
}
