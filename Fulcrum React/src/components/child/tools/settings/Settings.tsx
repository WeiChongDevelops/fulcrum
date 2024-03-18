import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    checkForOpenModalOrForm,
    OpenToolsSection,
    PublicUserData,
    SettingsFormVisibility,
    SettingsModalVisibility
} from "../../../../util.ts";
import FulcrumButton from "../../other/FulcrumButton.tsx";
import DarkModeToggle from "../../toggles/DarkModeToggle.tsx";
import AccessibilityToggle from "../../toggles/AccessibilityToggle.tsx";
import CurrencySelector from "../../selectors/CurrencySelector.tsx";
import ActiveFormClickShield from "../../other/ActiveFormClickShield.tsx";
import SettingsModalsAndForms from "./SettingsModalsAndForms.tsx";

interface SettingsProps {
    setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
}

/**
 * The root component for the settings page.
 */
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
            <div className={`w-[100vw] px-8 elementsBelowPopUpForm
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

                <div className={"settings-row bg-[#17423f] settings-box-shadow currency-selector-row"}>
                    <b>Currency</b>
                    <CurrencySelector publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>
                </div>

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

            {isSettingsFormOrModalOpen && <ActiveFormClickShield/>}

            <SettingsModalsAndForms settingsModalVisibility={settingsModalVisibility} setSettingsModalVisibility={setSettingsModalVisibility} settingsFormVisibility={settingsFormVisibility} setSettingsFormVisibility={setSettingsFormVisibility}/>
        </div>
    )
}