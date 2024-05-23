import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { checkForOpenModalOrForm, LocationContext, useLocation } from "@/utility/util.ts";
import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import DarkModeToggle from "../../toggles/DarkModeToggle.tsx";
import AccessibilityToggle from "../../toggles/AccessibilityToggle.tsx";
import CurrencySelector from "../../selectors/CurrencySelector.tsx";
import ActiveFormClickShield from "../../other/ActiveFormClickShield.tsx";
import SettingsModalsAndForms from "./SettingsModalsAndForms.tsx";
import { OpenToolsSection, PublicUserData, SettingsFormVisibility, SettingsModalVisibility } from "@/utility/types.ts";

interface SettingsProps {
  setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
  publicUserData: PublicUserData;
}

/**
 * The root component for the settings page.
 */
export default function Settings({ setOpenToolsSection, publicUserData }: SettingsProps) {
  const [settingsFormVisibility, setSettingsFormVisibility] = useState<SettingsFormVisibility>({
    typeDeleteMyExpensesForm: false,
    typeDeleteMyBudgetForm: false,
    typeDeleteMyDataForm: false,
    typeResetMyAccountForm: false,
  });
  const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
    isConfirmExpenseWipeModalVisible: false,
    isConfirmBudgetWipeModalVisible: false,
    isConfirmAllDataWipeModalVisible: false,
    isConfirmBudgetResetModalVisible: false,
  });
  const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);
  const elementsBelowPopUpForm = useRef<HTMLDivElement>(null);
  const routerLocation = useLocation();

  useEffect(() => {
    setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility));
  }, [settingsFormVisibility, settingsModalVisibility, routerLocation]);

  return (
    <div
      className={`flex flex-col justify-start items-center min-h-screen relative ${publicUserData.darkModeEnabled ? "bg-[#252e2e]" : "bg-[#455259]"}`}
    >
      <div
        className={`w-[100vw] px-8 elementsBelowPopUpForm
                ${isSettingsFormOrModalOpen && "blur"}`}
        ref={elementsBelowPopUpForm}
      >
        <div className="flex justify-between items-center my-8">
          <div className="flex-grow flex flex-row flex-start">
            <FulcrumButton
              displayText={"Go Back"}
              onClick={() => setOpenToolsSection("home")}
              backgroundColour={"white"}
              hoverShadow={true}
            />
          </div>

          <img
            className={"w-12 h-auto"}
            src="/static/assets-v2/UI-icons/tools-settings-icon-white.svg"
            alt="Settings icon"
          />
          <h1 className="text-white font-bold mx-8">Settings</h1>
          <img
            className={"w-12 h-auto"}
            src="/static/assets-v2/UI-icons/tools-settings-icon-white.svg"
            alt="Settings icon"
          />

          <div className="flex-grow flex flex-row justify-end">
            <FulcrumButton
              displayText={"Go Back"}
              onClick={() => setOpenToolsSection("home")}
              backgroundColour={"white"}
              optionalTailwind={"opacity-0"}
            />
          </div>
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow currency-selector-row"}>
          <b>Currency</b>
          <CurrencySelector publicUserData={publicUserData} />
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
          <b>Appearance</b>
          <DarkModeToggle publicUserData={publicUserData} />
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
          <b>Accessibility</b>
          <AccessibilityToggle publicUserData={publicUserData} />
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
          <b>Public License</b>
          <FulcrumButton
            displayText={"See Public License"}
            backgroundColour={"white"}
            optionalTailwind={"m-0"}
            onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}
          />
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
          <b>Privacy Policy</b>
          <FulcrumButton
            displayText={"See Privacy Policy"}
            backgroundColour={"white"}
            optionalTailwind={"m-0"}
            onClick={() => window.open(window.location.origin + "/privacy", "_blank")}
          />
        </div>

        <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
          <b>Account Created:</b>
          <p>{new Date(publicUserData.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={"settings-row wipe-options"}>
          <FulcrumButton
            displayText={"Wipe Expenses"}
            backgroundColour={"red"}
            onClick={() =>
              setSettingsFormVisibility((prevVisibility) => ({
                ...prevVisibility,
                typeDeleteMyExpensesForm: true,
              }))
            }
            hoverShadow={true}
          />
          <FulcrumButton
            displayText={"Wipe All Account Data"}
            backgroundColour={"red"}
            onClick={() =>
              setSettingsFormVisibility((prevVisibility) => ({
                ...prevVisibility,
                typeDeleteMyDataForm: true,
              }))
            }
            hoverShadow={true}
          />
          <FulcrumButton
            displayText={"Reset Account Data to Defaults"}
            backgroundColour={"red"}
            onClick={() =>
              setSettingsFormVisibility((prevVisibility) => ({
                ...prevVisibility,
                typeResetMyAccountForm: true,
              }))
            }
            hoverShadow={true}
          />
        </div>

        {isSettingsFormOrModalOpen && <ActiveFormClickShield />}
      </div>

      <SettingsModalsAndForms
        settingsModalVisibility={settingsModalVisibility}
        setSettingsModalVisibility={setSettingsModalVisibility}
        settingsFormVisibility={settingsFormVisibility}
        setSettingsFormVisibility={setSettingsFormVisibility}
      />
    </div>
  );
}
