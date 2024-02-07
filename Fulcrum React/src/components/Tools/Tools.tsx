import FulcrumButton from "../Other/FulcrumButton.tsx";
import {logoutOnClick, OpenToolsSection} from "../../util.ts";
import "../../css/Tools.css"
import {useState} from "react";
import RecurringExpenses from "./RecurringExpenses.tsx";
import Settings from "./Settings.tsx";

export default function Tools() {

    const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");

    function openSettings() {
        setOpenToolsSection("settings");
    }

    function openRecurringExpenses() {
        setOpenToolsSection("recurring");
    }

    return (
        <>
        {openToolsSection === "home" ? <div className="tools flex flex-col justify-start items-center bg-[#455259]">
            <div className="profile-icon-display mb-4">
                <img src="/src/assets/profile-icons/profile-icon-default.svg" alt="Profile image"/>
            </div>
            <div>
                <FulcrumButton displayText={"Sign Out"} backgroundColour={"white"} onClick={logoutOnClick}/>
            </div>

             <div className="tools-tile-container w-full h-auto flex justify-around items-center mt-10">
                <div className="tools-tile bg-[#D1B1B1] text-black text-3xl hover:cursor-pointer" onClick={openSettings}>
                    <div className="tools-text-container">
                        <p>Settings</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-settings-icon-black.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1D1CF] text-black text-lg leading-5 hover:cursor-pointer" onClick={openRecurringExpenses}>
                    <div className="tools-text-container">
                        <p>Recurring Expenses</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-recurring-icon-black.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1C5D1] text-black text-xl leading-7">
                    <div className="tools-text-container">
                        <p>Coming Soon</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-hardhat-icon.svg" alt=""/>
                </div>
             </div>
        </div> : openToolsSection === "settings" ?
            <Settings setOpenToolsSection={setOpenToolsSection}/> :
            <RecurringExpenses setOpenToolsSection={setOpenToolsSection}/>
        }
        </>
    );
}