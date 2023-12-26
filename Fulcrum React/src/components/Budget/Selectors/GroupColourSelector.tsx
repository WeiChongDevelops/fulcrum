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
                <div className="group-colour-triangle bg-[#d04443]" data-value="#d04443"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#ff707a]" data-value="#ff707a"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#f293cb]" data-value="#f293cb"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#9b41f1]" data-value="#9b41f1"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#4e5ee9]" data-value="#4e5ee9"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#73aef0]" data-value="#73aef0"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#39cfdd]" data-value="#39cfdd"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#26dd9b]" data-value="#26dd9b"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#b5d04b]" data-value="#b5d04b"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#e5e839]" data-value="#e5e839"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#ecc59a]" data-value="#ecc59a"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#fbae38]" data-value="#fbae38"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#aa7d42]" data-value="#aa7d42"></div>
            </div>
            <div className="group-colour-selectable-container">
                <div className="group-colour-triangle bg-[#d3d1d2]" data-value="#d3d1d2"></div>
            </div>
        </div>
    );
}