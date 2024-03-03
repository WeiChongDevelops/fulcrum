import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    checkForOpenModalOrForm,
    handleWipeBudget,
    handleWipeData,
    handleWipeExpenses,
    OpenToolsSection,
    PublicUserData,
    SettingsFormVisibility,
    SettingsModalVisibility
} from "../../util.ts";
import FulcrumButton from "../other/FulcrumButton.tsx";
import TwoOptionModal from "../modals-and-forms/TwoOptionModal.tsx";
import {TypeMatchConfirmationForm} from "./TypeMatchConfirmationForm.tsx";
import DarkModeToggle from "../toggles/DarkModeToggle.tsx";
import AccessibilityToggle from "../toggles/AccessibilityToggle.tsx";
import CurrencySelector from "../selectors/CurrencySelector.tsx";

interface SettingsProps {
    setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
}

export default function Settings({ setOpenToolsSection, publicUserData, setPublicUserData }: SettingsProps) {

    const [settingsFormVisibility, setSettingsFormVisibility] = useState<SettingsFormVisibility>({
        typeDeleteMyExpensesForm: false,
        typeDeleteMyBudgetForm: false,
        typeDeleteMyDataForm: false,
    })
    const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
        isConfirmExpenseWipeModalVisible: false,
        isConfirmBudgetWipeModalVisible: false,
        isConfirmAllDataWipeModalVisible: false,
    })
    const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility))
        document.getElementById("right-button")?.focus()
    }, [settingsFormVisibility, settingsModalVisibility]);

    return (
        <div className="flex flex-col justify-start items-center bg-[#455259] min-h-screen">
            <div className={`flex flex-col w-[100vw] px-8 elementsBelowPopUpForm z-2
                ${isSettingsFormOrModalOpen && "blur"}`}>

                <div className="flex justify-between items-center my-8">
                    <div className="flex-grow flex flex-row flex-start">
                        <FulcrumButton displayText={"Go Back"} onClick={() => setOpenToolsSection("home")} backgroundColour={"white"}/>
                    </div>

                    <img className={"w-12 h-auto"} src="/src/assets/UI-icons/tools-settings-icon-white.svg" alt="Settings icon"/>
                    <h1 className="text-white font-bold mx-8">Settings</h1>
                    <img className={"w-12 h-auto"} src="/src/assets/UI-icons/tools-settings-icon-white.svg" alt="Settings icon"/>

                    <div className="flex-grow flex flex-row justify-end">
                        <FulcrumButton displayText={"Go Back"} onClick={() => setOpenToolsSection("home")} backgroundColour={"white"} optionalTailwind={"opacity-0"}/>
                    </div>
                </div>

                <CurrencySelector publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>

                <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
                    <b>Appearance</b>
                    <DarkModeToggle publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>
                </div>

                <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
                    <b>Accessibility</b>
                    <AccessibilityToggle publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>
                </div>

                <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
                    <b>Public License</b>
                    <FulcrumButton displayText={"See Public License"} backgroundColour={"white"} optionalTailwind={"m-0"} onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}/>
                </div>

                <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
                    <b>Account Created:</b>
                    <p>{new Date(publicUserData.createdAt).toLocaleDateString()}</p>
                </div>

                <div className={"settings-row justify-center mt-8"}>
                    <FulcrumButton displayText={"Wipe Expenses"} backgroundColour={"red"} optionalTailwind={"settings-box-shadow"} onClick={() => setSettingsFormVisibility(curr => ({...curr, typeDeleteMyExpensesForm: true}))}/>
                    <FulcrumButton displayText={"Wipe Budget"} backgroundColour={"red"} optionalTailwind={"settings-box-shadow"} onClick={() => setSettingsFormVisibility(curr => ({...curr, typeDeleteMyBudgetForm: true}))}/>
                    <FulcrumButton displayText={"Wipe Data"} backgroundColour={"red"} optionalTailwind={"settings-box-shadow"} onClick={() => setSettingsFormVisibility(curr => ({...curr, typeDeleteMyDataForm: true}))}/>
                </div>
            </div>

            {isSettingsFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

            <div className="z-4">
                {settingsFormVisibility.typeDeleteMyExpensesForm &&
                    <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your expense logs? This decision is irreversible."}
                                               typeMatchString={"Wipe My Expenses"}
                                               setFormVisibility={setSettingsFormVisibility}
                                               setModalVisibility={setSettingsModalVisibility}
                                               formVisibility={"typeDeleteMyExpensesForm"}
                                               lastChanceModalVisibility={"isConfirmExpenseWipeModalVisible"}/>}

                {settingsFormVisibility.typeDeleteMyBudgetForm &&
                    <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your budget data? This decision is irreversible."}
                                               typeMatchString={"Wipe My Budget"}
                                               setFormVisibility={setSettingsFormVisibility}
                                               setModalVisibility={setSettingsModalVisibility}
                                               formVisibility={"typeDeleteMyBudgetForm"}
                                               lastChanceModalVisibility={"isConfirmBudgetWipeModalVisible"}/>}

                {settingsFormVisibility.typeDeleteMyDataForm &&
                    <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your expense and budget data? This decision is irreversible."}
                                               typeMatchString={"Wipe My Data"}
                                               setFormVisibility={setSettingsFormVisibility}
                                               setModalVisibility={setSettingsModalVisibility}
                                               formVisibility={"typeDeleteMyDataForm"}
                                               lastChanceModalVisibility={"isConfirmAllDataWipeModalVisible"}/>}

                {settingsModalVisibility.isConfirmExpenseWipeModalVisible
                    && <TwoOptionModal optionOneText={"Cancel"}
                                       optionOneFunction={() => {
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmExpenseWipeModalVisible: false
                                           }));
                                       }}
                                       optionTwoText={"Delete"}
                                       optionTwoFunction={() => {
                                           handleWipeExpenses();
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmExpenseWipeModalVisible: false
                                           }));
                                           console.log("Wiping all expenses.");
                                       }}
                                       setModalVisibility={setSettingsModalVisibility}
                                       isVisible={"isConfirmExpenseWipeModalVisible"}
                                       title={"Please confirm that you wish to permanently wipe all expense data."}/>}

                {settingsModalVisibility.isConfirmBudgetWipeModalVisible
                    && <TwoOptionModal optionOneText={"Cancel"}
                                       optionOneFunction={() => {
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmBudgetWipeModalVisible: false
                                           }));
                                       }}
                                       optionTwoText={"Delete"}
                                       optionTwoFunction={() => {
                                           handleWipeBudget();
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmBudgetWipeModalVisible: false
                                           }));
                                           console.log("Wiping all budgets.");
                                       }}
                                       setModalVisibility={setSettingsModalVisibility}
                                       isVisible={"isConfirmBudgetWipeModalVisible"}
                                       title={"Please confirm that you wish to permanently wipe all budget data."}/>}

                {settingsModalVisibility.isConfirmAllDataWipeModalVisible
                    && <TwoOptionModal optionOneText={"Cancel"}
                                       optionOneFunction={() => {
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmAllDataWipeModalVisible: false
                                           }));
                                       }}
                                       optionTwoText={"Delete"}
                                       optionTwoFunction={() => {
                                           handleWipeData();
                                           setSettingsModalVisibility(current => ({
                                               ...current,
                                               isConfirmAllDataWipeModalVisible: false
                                           }));
                                           console.log("Wiping all data.");
                                       }}
                                       setModalVisibility={setSettingsModalVisibility}
                                       isVisible={"isConfirmAllDataWipeModalVisible"}
                                       title={"Please confirm that you wish to permanently wipe all budget and expense data."}/>}
            </div>
        </div>
    )
}