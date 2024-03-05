import FulcrumButton from "../other/FulcrumButton.tsx";
import {
    BudgetItemEntity, CategoryToIconGroupAndColourMap, ExpenseItemEntity,
    getSessionEmail, GroupItemEntity,
    logoutOnClick,
    OpenToolsSection,
    PublicUserData,
    ToolsFormVisibility
} from "../../util.ts";
import "../../css/Tools.css"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import RecurringExpenses from "./RecurringExpenses.tsx";
import Settings from "./Settings.tsx";
import ProfileIconUpdatingForm from "../modals-and-forms/ProfileIconUpdatingForm.tsx";

interface ToolsProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;

    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>

    categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function Tools({ publicUserData, setPublicUserData, budgetArray, groupArray, setExpenseArray, setBudgetArray, categoryDataMap }: ToolsProps) {

    const sessionStoredEmail = sessionStorage.getItem("email");
    const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");
    const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");
    const [isChangeIconMessageVisible, setIsChangeIconMessageVisible] = useState(false);
    const [toolsFormVisibility, setToolsFormVisibility] = useState<ToolsFormVisibility>({
        isUpdateProfileIconFormVisible: false
    })

    function openSettings() {
        setOpenToolsSection("settings");
    }

    function openRecurringExpenses() {
        setOpenToolsSection("recurring");
    }

    function handleMouseEnter() {
        setIsChangeIconMessageVisible(true);
    }

    function handleMouseLeave() {
        setIsChangeIconMessageVisible(false);
    }

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
    }, []);

    return (
        <div>
            {openToolsSection === "home" ? <div className="tools flex flex-col justify-center items-center bg-[#455259] p-10">
                <div className="profile-icon-display mb-2" onClick={() => {
                    setIsChangeIconMessageVisible(false);
                    setToolsFormVisibility(curr => ({...curr, isUpdateProfileIconFormVisible: true}))
                }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-white.svg`} alt="Profile image"/>
                    {isChangeIconMessageVisible && <b className={"absolute z-4 mt-[90%]"} >Change Icon</b>}
                </div>
                <p className={"font-bold text-2xl text-white mb-5"}>{email}</p>
                <div>
                    <FulcrumButton displayText={"Sign Out"} backgroundColour={"white"} onClick={logoutOnClick}/>
                </div>

                {toolsFormVisibility.isUpdateProfileIconFormVisible && <div className="absolute w-[80vw] h-[80vh] bg-transparent z-3"></div>}

                 <div className="tools-tile-container">
                    <div className="tools-tile tools-tile-interactive bg-[#D1B1B1] text-black text-3xl hover:cursor-pointer" onClick={openSettings}>
                        <div className="tools-text-container">
                            <p>Settings</p>
                        </div>

                        <img src="/src/assets/UI-icons/tools-settings-icon-black.svg" alt=""/>
                    </div>
                    <div className="tools-tile tools-tile-interactive bg-[#B1D1CF] text-black text-lg leading-[1] hover:cursor-pointer" onClick={openRecurringExpenses}>
                        <div className="tools-text-container">
                            <p>Recurring Expenses</p>
                        </div>
                        <img src="/src/assets/UI-icons/tools-recurring-icon-black.svg" alt=""/>
                    </div>
                    <div className="tools-tile bg-[#B1C5D1] text-black text-xl leading-7 hover:cursor-not-allowed">
                        <div className="tools-text-container">
                            <p>Coming Soon</p>
                        </div>
                        <img src="/src/assets/UI-icons/tools-hardhat-icon.svg" alt=""/>
                    </div>
                 </div>
            </div> : openToolsSection === "settings" ?
                <Settings setOpenToolsSection={setOpenToolsSection} publicUserData={publicUserData} setPublicUserData={setPublicUserData}/> :
                <RecurringExpenses setOpenToolsSection={setOpenToolsSection}
                                   publicUserData={publicUserData}
                                   budgetArray={budgetArray}
                                   groupArray={groupArray}
                                   setExpenseArray={setExpenseArray}
                                   setBudgetArray={setBudgetArray}
                                   categoryDataMap={categoryDataMap}/>
            }
            {toolsFormVisibility.isUpdateProfileIconFormVisible && <ProfileIconUpdatingForm oldIconFileName={publicUserData.profileIconFileName}
                                                                                            publicUserData={publicUserData}
                                                                                            setPublicUserData={setPublicUserData}
                                                                                            setToolsFormVisibility={setToolsFormVisibility}/>}
        </div>
    );
}