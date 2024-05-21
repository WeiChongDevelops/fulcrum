import { PublicUserData, SettingsFormVisibility, SettingsModalVisibility } from "@/utility/types.ts";
import { useContext, useEffect, useRef, useState } from "react";
import { checkForOpenModalOrForm, LocationContext } from "@/utility/util.ts";
import SettingsHeaderV2 from "@/components-v2/subcomponents/settings/SettingsHeaderV2.tsx";
import CurrencySelectorV2 from "@/components-v2/subcomponents/selectors/CurrencySelectorV2.tsx";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import AccessibilityToggleV2 from "@/components-v2/subcomponents/toggles/AccessibilityToggleV2.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import ActiveFormClickShield from "@/components/child/other/ActiveFormClickShield.tsx";
import SettingsModalsAndForms from "@/components/child/tools/settings/SettingsModalsAndForms.tsx";
import "@/css/Tools.css";
import { Button } from "@/components-v2/ui/button.tsx";

interface SettingsV2Props {
  publicUserData: PublicUserData;
}

/**
 * The root component for the settings page.
 */
export default function SettingsV2({ publicUserData }: SettingsV2Props) {
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
  const routerLocation = useContext(LocationContext);

  useEffect(() => {
    setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility));
  }, [settingsFormVisibility, settingsModalVisibility, routerLocation]);

  return (
    <div className={"flex flex-col h-screen"}>
      <SettingsHeaderV2 publicUserData={publicUserData} />
      <div className={"flex flex-col justify-start items-center w-full h-[94%] relative pt-8"}>
        <div
          className={`px-8 elementsBelowPopUpForm
                ${isSettingsFormOrModalOpen && "blur"}`}
          ref={elementsBelowPopUpForm}
        >
          <div className={"settings-row bg-[#17423f] settings-box-shadow currency-selector-row"}>
            <b>Currency</b>
            {/*<CurrencySelector publicUserData={publicUserData} />*/}
            <CurrencySelectorV2 publicUserData={publicUserData} />
          </div>

          <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
            <b>Appearance</b>
            <DarkModeToggleV2 publicUserData={publicUserData} />
          </div>

          <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
            <b>Accessibility</b>
            <AccessibilityToggleV2 publicUserData={publicUserData} />
          </div>

          <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
            <b>Public License</b>
            {/*<FulcrumButton*/}
            {/*  displayText={"See Public License"}*/}
            {/*  backgroundColour={"white"}*/}
            {/*  optionalTailwind={"m-0"}*/}
            {/*  onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}*/}
            {/*/>*/}
            <Button onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}>
              See Public License
            </Button>
          </div>

          <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
            <b>Privacy Policy</b>
            {/*<FulcrumButton*/}
            {/*  displayText={"See Privacy Policy"}*/}
            {/*  backgroundColour={"white"}*/}
            {/*  optionalTailwind={"m-0"}*/}
            {/*  onClick={() => window.open(window.location.origin + "/privacy", "_blank")}*/}
            {/*/>*/}
            <Button onClick={() => window.open(window.location.origin + "/privacy", "_blank")}>See Privacy Policy</Button>
          </div>

          <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
            <b>Account Created:</b>
            <p>{new Date(publicUserData.createdAt).toLocaleDateString()}</p>
          </div>

          <div className={"settings-row wipe-options"}>
            <Button
              onClick={() =>
                setSettingsFormVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  typeDeleteMyExpensesForm: true,
                }))
              }
            >
              Wipe Expenses
            </Button>
            <Button
              onClick={() =>
                setSettingsFormVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  typeDeleteMyDataForm: true,
                }))
              }
            >
              Wipe All Account Data
            </Button>
            <Button
              onClick={() =>
                setSettingsFormVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  typeResetMyAccountForm: true,
                }))
              }
            >
              Reset Account Data to Defaults
            </Button>
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
    </div>
    // <div
    //   className={`flex flex-col justify-start items-center min-h-screen relative ${publicUserData.darkModeEnabled ? "bg-[#252e2e]" : "bg-[#455259]"}`}
    // >
    //   <div
    //     className={`w-[100vw] px-8 elementsBelowPopUpForm
    //             ${isSettingsFormOrModalOpen && "blur"}`}
    //     ref={elementsBelowPopUpForm}
    //   >
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow currency-selector-row"}>
    //       <b>Currency</b>
    //       <CurrencySelector publicUserData={publicUserData} />
    //     </div>
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
    //       <b>Appearance</b>
    //       <DarkModeToggle publicUserData={publicUserData} />
    //     </div>
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
    //       <b>Accessibility</b>
    //       <AccessibilityToggle publicUserData={publicUserData} />
    //     </div>
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
    //       <b>Public License</b>
    //       <FulcrumButton
    //         displayText={"See Public License"}
    //         backgroundColour={"white"}
    //         optionalTailwind={"m-0"}
    //         onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}
    //       />
    //     </div>
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow pr-4"}>
    //       <b>Privacy Policy</b>
    //       <FulcrumButton
    //         displayText={"See Privacy Policy"}
    //         backgroundColour={"white"}
    //         optionalTailwind={"m-0"}
    //         onClick={() => window.open(window.location.origin + "/privacy", "_blank")}
    //       />
    //     </div>
    //
    //     <div className={"settings-row bg-[#17423f] settings-box-shadow"}>
    //       <b>Account Created:</b>
    //       <p>{new Date(publicUserData.createdAt).toLocaleDateString()}</p>
    //     </div>
    //
    //     <div className={"settings-row wipe-options"}>
    //       <FulcrumButton
    //         displayText={"Wipe Expenses"}
    //         backgroundColour={"red"}
    //         onClick={() =>
    //           setSettingsFormVisibility((prevVisibility) => ({
    //             ...prevVisibility,
    //             typeDeleteMyExpensesForm: true,
    //           }))
    //         }
    //         hoverShadow={true}
    //       />
    //       <FulcrumButton
    //         displayText={"Wipe All Account Data"}
    //         backgroundColour={"red"}
    //         onClick={() =>
    //           setSettingsFormVisibility((prevVisibility) => ({
    //             ...prevVisibility,
    //             typeDeleteMyDataForm: true,
    //           }))
    //         }
    //         hoverShadow={true}
    //       />
    //       <FulcrumButton
    //         displayText={"Reset Account Data to Defaults"}
    //         backgroundColour={"red"}
    //         onClick={() =>
    //           setSettingsFormVisibility((prevVisibility) => ({
    //             ...prevVisibility,
    //             typeResetMyAccountForm: true,
    //           }))
    //         }
    //         hoverShadow={true}
    //       />
    //     </div>
    //
    //     {isSettingsFormOrModalOpen && <ActiveFormClickShield />}
    //   </div>
    //
    //   <SettingsModalsAndForms
    //     settingsModalVisibility={settingsModalVisibility}
    //     setSettingsModalVisibility={setSettingsModalVisibility}
    //     settingsFormVisibility={settingsFormVisibility}
    //     setSettingsFormVisibility={setSettingsFormVisibility}
    //   />
    // </div>
  );
}
