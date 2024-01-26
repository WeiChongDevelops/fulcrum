import FulcrumButton from "../Other/FulcrumButton.tsx";
import {logoutOnClick, OpenToolsSection} from "../../util.ts";
import "../../css/Tools.css"
import {useState} from "react";

export default function Tools() {

    const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");

    function returnToToolsHome() {
        setOpenToolsSection("home");
    }

    function openSettings() {
        setOpenToolsSection("settings");
    }

    function openRecurringExpenses() {
        setOpenToolsSection("recurring");
    }

    return (
        <>
        {openToolsSection === "home" ? <div className="tools flex flex-col justify-start items-center bg-[#455259] ">
            <div className="profile-icon-display my-4">
                <img src="/src/assets/profile-icons/profile-icon-default.svg" alt="Profile image"/>
            </div>
            <h1 className="font-bold text-white mb-4">Profile</h1>
            <div>
                <FulcrumButton displayText={"Sign Out"} backgroundColour={"white"} onClick={logoutOnClick}/>
            </div>

             <div className="tools-tile-container w-full h-auto flex justify-around items-center mt-16">
                <div className="tools-tile bg-[#D1B1B1] text-black text-4xl hover:cursor-pointer" onClick={openSettings}>
                    <div className="tools-text-container">
                        <p>Settings</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-settings-icon.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1D1CF] text-black text-xl leading-5 hover:cursor-pointer" onClick={openRecurringExpenses}>
                    <div className="tools-text-container">
                        <p>Recurring Expenses</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-recurring-icon.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1C5D1] text-black text-2xl leading-7">
                    <div className="tools-text-container">
                        <p>Coming Soon</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-hardhat-icon.svg" alt=""/>
                </div>
             </div>
        </div> : openToolsSection === "settings" ?
            <div className="w-full h-full bg-red-500">
                <h1 className="text-black">Settings</h1>
                <FulcrumButton displayText={"Go Back"} backgroundColour={"white"} onClick={returnToToolsHome}/>
            </div> :
            <div className="w-full h-full bg-purple-700">
                <h1 className="text-black">Recurring Expenses</h1>
                <FulcrumButton displayText={"Go Back"} backgroundColour={"white"} onClick={returnToToolsHome}/>
            </div>}
        </>
    );
}