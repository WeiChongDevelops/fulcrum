import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {checkForOpenModalOrForm,
    OpenToolsSection, runAccountDeletion, runBudgetWipe, runExpenseWipe, runFullDataWipe,
    SettingsFormVisibility,
    SettingsModalVisibility
} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import {TypeMatchConfirmationForm} from "./TypeMatchConfirmationForm.tsx";

interface SettingsProps {
    setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
}

export default function Settings({ setOpenToolsSection }: SettingsProps) {

    const [settingsFormVisibility, setSettingsFormVisibility] = useState<SettingsFormVisibility>({
        typeDeleteMyExpensesForm: false,
        typeDeleteMyBudgetForm: false,
        typeDeleteMyDataForm: false,
        typeDeleteMyAccountForm: false
    })

    const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
        isConfirmExpenseWipeModalVisible: false,
        isConfirmBudgetWipeModalVisible: false,
        isConfirmAllDataWipeModalVisible: false,
        isConfirmDeleteAccountModalVisible: false,
    })

    const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility))
    }, [settingsFormVisibility, settingsModalVisibility]);

    return (
        <>
            <div className="flex flex-col justify-start items-center bg-[#455259] min-h-screen">
                <div className={`flex flex-col w-[100vw] elementsBelowPopUpForm z-2
                    ${isSettingsFormOrModalOpen && "blur"} px-16`}>

                    <div className="flex justify-between items-center my-8">
                        <div className="flex-grow flex flex-row flex-start">
                            <FulcrumButton displayText={"Go Back"} onClick={() => setOpenToolsSection("home")} backgroundColour={"white"}/>
                        </div>

                        <img src="/src/assets/UI-icons/tools-settings-icon-white.svg" alt="Settings icon"/>
                        <h1 className="text-white font-bold mx-8">Settings</h1>
                        <img src="/src/assets/UI-icons/tools-settings-icon-white.svg" alt="Settings icon"/>

                        <div className="flex-grow flex flex-row justify-end">
                            <FulcrumButton displayText={"Go Back"} onClick={() => setOpenToolsSection("home")} backgroundColour={"white"} optionalTailwind={"opacity-0"}/>
                        </div>
                    </div>


                    <div>
                        <h1>Settings Here</h1>
                    </div>
                </div>

                {isSettingsFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

                <div className="z-4">
                    {settingsFormVisibility.typeDeleteMyExpensesForm &&
                        <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your expense logs? This decision is irreversible."}
                                                   typeMatchString={"Wipe My Expenses"}
                                                   setFormVisibility={setSettingsFormVisibility}
                                                   setModalVisibility={setSettingsModalVisibility}
                                                   lastChanceModalVisibility={"typeDeleteMyExpensesForm"}/>}

                    {settingsFormVisibility.typeDeleteMyBudgetForm &&
                        <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your budget data? This decision is irreversible."}
                                                   typeMatchString={"Wipe My Budget"}
                                                   setFormVisibility={setSettingsFormVisibility}
                                                   setModalVisibility={setSettingsModalVisibility}
                                                   lastChanceModalVisibility={"typeDeleteMyBudgetForm"}/>}

                    {settingsFormVisibility.typeDeleteMyDataForm &&
                        <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to wipe your expense and budget data? This decision is irreversible."}
                                                   typeMatchString={"Wipe My Data"}
                                                   setFormVisibility={setSettingsFormVisibility}
                                                   setModalVisibility={setSettingsModalVisibility}
                                                   lastChanceModalVisibility={"typeDeleteMyDataForm"}/>}

                    {settingsFormVisibility.typeDeleteMyAccountForm &&
                        <TypeMatchConfirmationForm areYouSureMessage={"Are you sure you would like to permanently delete your account? This decision is irreversible."}
                                                   typeMatchString={"Permanently Delete My Account"}
                                                   setFormVisibility={setSettingsFormVisibility}
                                                   setModalVisibility={setSettingsModalVisibility}
                                                   lastChanceModalVisibility={"typeDeleteMyAccountForm"}/>}

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
                                               runExpenseWipe();
                                               setSettingsModalVisibility(current => ({
                                                   ...current,
                                                   isConfirmExpenseWipeModalVisible: false
                                               }));
                                               console.log("Wiping all expenses.");
                                           }}
                                           setModalVisibility={setSettingsModalVisibility}
                                           isVisible={"isConfirmExpenseWipeModalVisible"}
                                           title={"Wipe All Expense Data"}/>}

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
                                               runBudgetWipe();
                                               setSettingsModalVisibility(current => ({
                                                   ...current,
                                                   isConfirmBudgetWipeModalVisible: false
                                               }));
                                               console.log("Wiping all budgets.");
                                           }}
                                           setModalVisibility={setSettingsModalVisibility}
                                           isVisible={"isConfirmBudgetWipeModalVisible"}
                                           title={"Wipe All Budget Data"}/>}

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
                                               runFullDataWipe();
                                               setSettingsModalVisibility(current => ({
                                                   ...current,
                                                   isConfirmAllDataWipeModalVisible: false
                                               }));
                                               console.log("Wiping all data.");
                                           }}
                                           setModalVisibility={setSettingsModalVisibility}
                                           isVisible={"isConfirmAllDataWipeModalVisible"}
                                           title={"Wipe All Budget and Expense Data"}/>}

                    {settingsModalVisibility.isConfirmDeleteAccountModalVisible
                        && <TwoOptionModal optionOneText={"Cancel"}
                                           optionOneFunction={() => {
                                               setSettingsModalVisibility(current => ({
                                                   ...current,
                                                   isConfirmDeleteAccountModalVisible: false
                                               }));
                                           }}
                                           optionTwoText={"Delete"}
                                           optionTwoFunction={() => {
                                               runAccountDeletion();
                                               setSettingsModalVisibility(current => ({
                                                   ...current,
                                                   isConfirmDeleteAccountModalVisible: false
                                               }));
                                               console.log("Deleting account.");
                                           }}
                                           setModalVisibility={setSettingsModalVisibility}
                                           isVisible={"isConfirmDeleteAccountModalVisible"}
                                           title={"Permanently Delete Account"}/>}
                </div>
            </div>
        </>
    )
}