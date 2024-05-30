import { UserPreferences, SettingsFormVisibility, SettingsModalVisibility } from "@/utility/types.ts";
import { useContext, useEffect, useRef, useState } from "react";
import { checkForOpenModalOrForm, LocationContext, useEmail } from "@/utility/util.ts";
import SettingsHeaderV2 from "@/components-v2/subcomponents/settings/SettingsHeaderV2.tsx";
import CurrencySelectorV2 from "@/components-v2/subcomponents/selectors/CurrencySelectorV2.tsx";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import AccessibilityToggleV2 from "@/components-v2/subcomponents/toggles/AccessibilityToggleV2.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import ActiveFormClickShield from "@/components/child/other/ActiveFormClickShield.tsx";
import SettingsModalsAndForms from "@/components/child/tools/settings/SettingsModalsAndForms.tsx";
import "@/css/Tools.css";
import { Button } from "@/components-v2/ui/button.tsx";
import FulcrumDialogTwoOptions from "@/components-v2/subcomponents/other/FulcrumDialogTwoOptions.tsx";
import useWipeExpenses from "@/hooks/mutations/expense/useWipeExpenses.ts";
import useWipeData from "@/hooks/mutations/budget/useWipeData.ts";
import useResetAccountData from "@/hooks/mutations/other/useResetAccountData.ts";
import FulcrumTypematchModal from "@/components-v2/subcomponents/other/FulcrumTypematchModal.tsx";
import ReactCountryFlag from "react-country-flag";
import ThemeToggle from "@/components-v2/subcomponents/other/ThemeToggle.tsx";
import AccessibilityToggle from "@/components-v2/subcomponents/other/AccessibilityToggle.tsx";
import { CalendarStar, Globe, Lock, PaintBrushBroad, PersonSimpleCircle, Scales } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * The root component for the settings page.
 */
export default function SettingsV2() {
  // const [settingsFormVisibility, setSettingsFormVisibility] = useState<SettingsFormVisibility>({
  //   typeDeleteMyExpensesForm: false,
  //   typeDeleteMyBudgetForm: false,
  //   typeDeleteMyDataForm: false,
  //   typeResetMyAccountForm: false,
  // });
  // const [settingsModalVisibility, setSettingsModalVisibility] = useState<SettingsModalVisibility>({
  //   isConfirmExpenseWipeModalVisible: false,
  //   isConfirmBudgetWipeModalVisible: false,
  //   isConfirmAllDataWipeModalVisible: false,
  //   isConfirmBudgetResetModalVisible: false,
  // });
  // const [isSettingsFormOrModalOpen, setIsSettingsFormOrModalOpen] = useState<boolean>(false);
  const elementsBelowPopUpForm = useRef<HTMLDivElement>(null);
  const routerLocation = useContext(LocationContext);

  // useEffect(() => {
  //   setIsSettingsFormOrModalOpen(checkForOpenModalOrForm(settingsFormVisibility, settingsModalVisibility));
  // }, [settingsFormVisibility, settingsModalVisibility, routerLocation]);

  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const { mutate: wipeExpenses } = useWipeExpenses();
  const { mutate: wipeData } = useWipeData();
  const { mutate: resetData } = useResetAccountData();

  const [showWipeExpenseTypematchModal, setShowWipeExpenseTypematchModal] = useState(false);
  const [showWipeDataTypematchModal, setShowWipeDataTypematchModal] = useState(false);
  const [showResetAccountTypematchModal, setShowResetAccountTypematchModal] = useState(false);

  return (
    <div className={"flex flex-col justify-start items-center relative"}>
      <SettingsHeaderV2 />
      <div className={"flex flex-col justify-start items-center gap-3.5 w-[95%] h-[94%] mt-[6vh] pt-8 font-extralight"}>
        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <Globe size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Currency</b>
          {/*<CurrencySelector userPreferences={userPreferences} />*/}
          <CurrencySelectorV2 className={"w-28 text-background font-medium bg-primary"} />
        </div>

        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <PaintBrushBroad size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Theme</b>
          {/*<DarkModeToggleV2 userPreferences={userPreferences} />*/}

          <ThemeToggle className={"mr-2"} hideDescriptor />
        </div>

        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <PersonSimpleCircle size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Accessibility</b>
          {/*<AccessibilityToggleV2 userPreferences={userPreferences} />*/}
          <AccessibilityToggle className={"mr-2"} hideDescriptor />
        </div>

        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <Scales size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Public License</b>
          <Button
            size={"sm"}
            onClick={() => window.open("https://github.com/WeiChongDevelops/Fulcrum/blob/main/README.md", "_blank")}
          >
            See Public License
          </Button>
        </div>

        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <Lock size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Privacy Policy</b>
          <Button size={"sm"} onClick={() => window.open(window.location.origin + "/privacy", "_blank")}>
            See Privacy Policy
          </Button>
        </div>

        <div className={"settings-row dark:bg-secondary outline outline-[1px] outline-primary text-primary shadow h-14"}>
          <CalendarStar size={"1.4rem"} />
          <b className={"mr-auto ml-4"}>Joined On</b>
          <p>{new Date(userPreferences.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={"settings-row wipe-options"}>
          <FulcrumTypematchModal
            typeMatchString={"Wipe My Expenses"}
            dialogOpen={showWipeExpenseTypematchModal}
            setDialogOpen={setShowWipeExpenseTypematchModal}
            dialogTitle={"Wipe all expenses?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowWipeExpenseTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowWipeExpenseTypematchModal(false);
              wipeExpenses();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Wipe Expenses</Button>}
          />

          <FulcrumTypematchModal
            typeMatchString={"Wipe My Data"}
            dialogOpen={showWipeDataTypematchModal}
            setDialogOpen={setShowWipeDataTypematchModal}
            dialogTitle={"Wipe all data?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowWipeDataTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowWipeDataTypematchModal(false);
              wipeData();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Wipe Data</Button>}
          />

          <FulcrumTypematchModal
            typeMatchString={"Reset to Defaults"}
            dialogOpen={showResetAccountTypematchModal}
            setDialogOpen={setShowResetAccountTypematchModal}
            dialogTitle={"Reset account to default data?"}
            dialogDescription={"This decision is irreversible."}
            leftButtonText={"Cancel"}
            leftButtonFunction={() => setShowResetAccountTypematchModal(false)}
            rightButtonText={"Confirm"}
            rightButtonFunction={() => {
              setShowResetAccountTypematchModal(false);
              resetData();
            }}
            buttonTriggerComponent={<Button variant={"destructive"}>Reset Defaults</Button>}
          />
        </div>
      </div>
    </div>
  );
}
