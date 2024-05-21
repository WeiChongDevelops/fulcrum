import "../../../css/Budget.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { groupColourArray } from "../../../utility/util.ts";
import { BasicGroupData } from "@/utility/types.ts";

interface GroupColourSelectorProps {
  oldColour?: string;
  setFormData: Dispatch<SetStateAction<BasicGroupData>>;
}

/**
 * A visual selector for the user to choose a colour for a budget category group.
 */
export default function GroupColourSelector({ oldColour = "#fff", setFormData }: GroupColourSelectorProps) {
  const [selectedColour, setSelectedColour] = useState(oldColour);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedColour(e.currentTarget.getAttribute("data-value")!);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({ ...prevFormData, colour: selectedColour }));
  }, [selectedColour]);

  return (
    <div className={"grid grid-cols-4 gap-5 outline outline-1 shadow outline-gray-200 p-4 rounded-3xl"}>
      {groupColourArray.map((colour, key) => {
        return (
          <div
            data-value={colour}
            className={`transition-all duration-250 ease-out size-10 rounded-full origin-center hover:cursor-pointer ${selectedColour === colour && "outline outline-2 outline-offset-4"}`}
            style={{ backgroundColor: colour, outlineColor: colour, filter: "brightness(98%) saturate(150%)" }}
            key={key}
            onClick={handleClick}
          ></div>
        );
      })}
    </div>
  );
}
