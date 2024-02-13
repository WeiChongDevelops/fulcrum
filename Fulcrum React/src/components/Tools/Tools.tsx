import FulcrumButton from "../Other/FulcrumButton.tsx";
import {
    getSessionEmail,
    logoutOnClick,
    OpenToolsSection,
    PublicUserData,
    ToolsFormVisibility
} from "../../util.ts";
import "../../css/Tools.css"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import RecurringExpenses from "./RecurringExpenses.tsx";
import Settings from "./Settings.tsx";
import ProfileIconUpdatingForm from "../ModalsAndForms/ProfileIconUpdatingForm.tsx";

interface ToolsProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
}

export default function Tools({ publicUserData, setPublicUserData }: ToolsProps) {

    const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");
    const [email, setEmail] = useState("");

    const [toolsFormVisibility, setToolsFormVisibility] = useState<ToolsFormVisibility>({
        isUpdateProfileIconFormVisible: false
    })

    function openSettings() {
        setOpenToolsSection("settings");
    }

    function openRecurringExpenses() {
        setOpenToolsSection("recurring");
    }

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
    }, []);

    return (
        <div>
            {openToolsSection === "home" ? <div className="tools flex flex-col justify-start items-center bg-[#455259]">
                <div className="profile-icon-display mb-4" onClick={() => {
                    setToolsFormVisibility(curr => ({...curr, isUpdateProfileIconFormVisible: true}))
                }}>
                    <img src={`/src/assets/profile-icons/${publicUserData.profileIconFileName}`} alt="Profile image"/>
                </div>
                <p className={"font-bold text-2xl text-white mb-5"}>{email}</p>
                <div>
                    <FulcrumButton displayText={"Sign Out"} backgroundColour={"white"} onClick={logoutOnClick}/>
                </div>

                 <div className="tools-tile-container w-full h-auto flex justify-around items-center mt-16">
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
                <Settings setOpenToolsSection={setOpenToolsSection} publicUserData={publicUserData} setPublicUserData={setPublicUserData}/> :
                <RecurringExpenses setOpenToolsSection={setOpenToolsSection} publicUserData={publicUserData}/>
            }
            {toolsFormVisibility.isUpdateProfileIconFormVisible && <ProfileIconUpdatingForm oldIconFileName={publicUserData.profileIconFileName}
                                                                                            publicUserData={publicUserData}
                                                                                            setPublicUserData={setPublicUserData}
                                                                                            setToolsFormVisibility={setToolsFormVisibility}/>}
        </div>
    );
}