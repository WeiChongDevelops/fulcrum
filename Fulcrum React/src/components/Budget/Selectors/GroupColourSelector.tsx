import "../../../css/Budget.css"
import {useEffect} from "react";

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
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#fbb39a]" data-value="#fbb39a"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#fbdee0]" data-value="#fbdee0"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#f8b2bc]" data-value="#f8b2bc"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#f1afa1]" data-value="#f1afa1"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#fbf5ab]" data-value="#fbf5ab"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#e6eda0]" data-value="#e6eda0"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#9fd5be]" data-value="#9fd5be"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#c3e6df]" data-value="#c3e6df"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#9dc7b9]" data-value="#9dc7b9"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#acbfa1]" data-value="#acbfa1"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#c6e2ba]" data-value="#c6e2ba"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#ccd7c6]" data-value="#ccd7c6"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#a6c7ea]" data-value="#a6c7ea"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#b2b4da]" data-value="#b2b4da"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#dfcde3]" data-value="#dfcde3"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#ceb4d9]" data-value="#ceb4d9"></div>
            </div>
        </div>
    );
}