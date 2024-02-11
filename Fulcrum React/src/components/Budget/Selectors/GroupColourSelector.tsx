import "../../../css/Budget.css"
import {useEffect} from "react";
import {groupColourArray} from "../../../util.ts";

interface GroupColourSelectorProps {
    oldColour?: string
}

export default function GroupColourSelector( { oldColour }:GroupColourSelectorProps) {

    useEffect (() => {
        const oldColourSelectable = document.querySelector(`div[data-value="${oldColour}"]`)
        oldColourSelectable?.classList.add("selectedColour")
    }, [])

    return (
        <div id="group-colour-selector">
            {groupColourArray.map((colour, key) => {
                  return <div className={"group-colour-selectable-container"} key={key}>
                      <div className={"group-colour-triangle"} style={{backgroundColor: colour}} data-value={colour}></div>
                  </div>
            })}
        </div>
    );
}