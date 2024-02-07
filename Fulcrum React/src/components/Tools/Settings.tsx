import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    checkForOpenModalOrForm, currencyOptions,
    getPublicUserData, handlePublicUserDataUpdating,
    handleWipeBudget,
    handleWipeData,
    handleWipeExpenses,
    OpenToolsSection,
    PublicUserData, PublicUserDataUpdate,
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
    })

    const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
        isConfirmExpenseWipeModalVisible: false,
        isConfirmBudgetWipeModalVisible: false,
        isConfirmAllDataWipeModalVisible: false,
    })

    const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);

    const [publicUserData, setPublicUserData] = useState<PublicUserData>({
        createdAt: new Date(),
        currency: "",
        darkModeEnabled: false,
        accessibilityEnabled: false
    })

    useEffect(() => {
        setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility))
        document.getElementById("right-button")?.focus()
    }, [settingsFormVisibility, settingsModalVisibility]);

    useEffect(() => {
        getPublicUserData()
            .then(results => setPublicUserData(results));
    }, []);

    function handleCurrencySelection(e: React.MouseEvent) {
        const target = e.target as HTMLDivElement;
        const newCurrencySetting = target.innerText.slice(1)
        setPublicUserData(curr => ({...curr, currency: newCurrencySetting}))

        const updatedPublicUserData: PublicUserDataUpdate = {
            currency: newCurrencySetting,
            darkModeEnabled: publicUserData.darkModeEnabled,
            accessibilityEnabled: publicUserData.accessibilityEnabled
        }

        handlePublicUserDataUpdating(updatedPublicUserData)
    }

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


                    <div className={"settings-row bg-[#17423f] settings-box-shadow flex-col h-auto"}>
                        <b className={"flex flex-row justify-start mr-auto"}>Select Currency</b>
                        <div className={"flex flex-row justify-around font-bold text-3xl w-full mt-6 flex-wrap"}>
                            {currencyOptions.map(currencyOption => {
                                return <FulcrumButton
                                    displayText={currencyOption.symbol}
                                    backgroundColour={publicUserData.currency === currencyOption.code ? "grey" : "white"}
                                    onClick={handleCurrencySelection}
                                    optionalTailwind={`w-36 mb-4 ${publicUserData.currency === currencyOption.code && "outline"}`}/>
                            })}
                        </div>
                    </div>

                    <div className={"settings-row bg-[#17423f] settings-box-shadow pr-3"}>
                        <b>Public License</b>
                        <FulcrumButton displayText={"See Public License"} backgroundColour={"white"} optionalTailwind={"m-0"} onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}/>
                    </div>

                    <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
                        <b>Account Created On:</b>
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
                                           title={"Confirm You Wish to Permanently Wipe All Expense Data."}/>}

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
                                           title={"Confirm You Wish to Permanently Wipe All Budget Data."}/>}

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
                                           title={"Confirm You Wish to Permanently Wipe All Budget and Expense Data."}/>}

                </div>
            </div>
        </>
    )
}