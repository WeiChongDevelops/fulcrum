import "../../../css/Budget.css";
import { useContext, useEffect } from "react";
import { groupColourArray, LocationContext } from "../../../utility/util.ts";

interface GroupColourSelectorProps {
  oldColour?: string;
}

/**
 * A visual selector for the user to choose a colour for a budget category group.
 */
export default function GroupColourSelector({ oldColour }: GroupColourSelectorProps) {
  const routerLocation = useContext(LocationContext);
  useEffect(() => {
    const oldColourSelectable = document.querySelector(`div[data-value="${oldColour}"]`);
    oldColourSelectable?.classList.add("selectedColour");
  }, [routerLocation]);

  return (
    <div id="group-colour-selector">
      {groupColourArray.map((colour, key) => {
        return (
          <div className={"group-colour-selectable-container"} key={key}>
            <div className={"group-colour-triangle"} style={{ backgroundColor: colour }} data-value={colour}></div>
          </div>
        );
      })}
    </div>
  );
}
