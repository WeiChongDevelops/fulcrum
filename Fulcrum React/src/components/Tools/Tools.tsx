import FulcrumButton from "../Other/FulcrumButton.tsx";
import {logoutOnClick} from "../../util.ts";
import "../../css/Tools.css"

export default function Tools() {
    return (
        <div className="flex flex-col justify-around items-center">
            <div className="profile-icon-display my-4">
                <img src="/src/assets/profile-icons/profile-icon-default.svg" alt="Profile image"/>
            </div>
            <h1 className="font-bold text-black mb-4">Profile</h1>
            <div>
                <FulcrumButton displayText={"Sign Out"} backgroundColour={"grey"} onClick={logoutOnClick}/>
            </div>
            <div className="w-full flex flex-row justify-around items-center mt-16">
                <div className="tools-tile bg-[#D1B1B1] text-black text-4xl">
                    <div className="tools-text-container">
                        <p>Settings</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-settings-icon.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1D1CF] text-black text-2xl leading-10">
                    <div className="tools-text-container">
                        <p>Recurring Expenses</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-recurring-icon.svg" alt=""/>
                </div>
                <div className="tools-tile bg-[#B1C5D1] text-black text-4xl">
                    <div className="tools-text-container">
                        <p>Coming Soon</p>
                    </div>
                    <img src="/src/assets/UI-icons/tools-hardhat-icon.svg" alt=""/>
                </div>
            </div>
        </div>
    );
}