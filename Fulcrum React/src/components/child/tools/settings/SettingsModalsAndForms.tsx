import { TypeMatchConfirmationForm } from "../../modals/TypeMatchConfirmationForm.tsx";
import TwoOptionModal from "../../modals/TwoOptionModal.tsx";
import { changeFormOrModalVisibility } from "../../../../utility/util.ts";
import useWipeBudget from "../../../../hooks/mutations/budget/useWipeBudget.ts";
import useWipeExpenses from "../../../../hooks/mutations/expense/useWipeExpenses.ts";
import useResetBudget from "../../../../hooks/mutations/budget/useResetBudget.ts";
import {
  SetFormVisibility,
  SetModalVisibility,
  SettingsFormVisibility,
  SettingsModalVisibility,
} from "../../../../utility/types.ts";

interface SettingsModalsAndFormsProps {
  settingsFormVisibility: SettingsFormVisibility;
  setSettingsFormVisibility: SetFormVisibility<SettingsFormVisibility>;
  settingsModalVisibility: SettingsModalVisibility;
  setSettingsModalVisibility: SetModalVisibility<SettingsModalVisibility>;
}

/**
 * Renders the modals and forms for the settings page.
 */
export default function SettingsModalsAndForms({
  settingsFormVisibility,
  setSettingsFormVisibility,
  settingsModalVisibility,
  setSettingsModalVisibility,
}: SettingsModalsAndFormsProps) {
  const { mutate: wipeExpenses } = useWipeExpenses();
  const { mutate: wipeBudget } = useWipeBudget();
  const { mutate: resetBudget } = useResetBudget();

  return (
    <div className="z-40">
      {settingsFormVisibility.typeDeleteMyExpensesForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={"Are you sure you would like to wipe your expense logs? This decision is irreversible."}
          typeMatchString={"Wipe My Expenses"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeDeleteMyExpensesForm"}
          lastChanceModalVisibility={"isConfirmExpenseWipeModalVisible"}
        />
      )}

      {settingsFormVisibility.typeDeleteMyBudgetForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={"Are you sure you would like to wipe your budget data? This decision is irreversible."}
          typeMatchString={"Wipe My Budget"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeDeleteMyBudgetForm"}
          lastChanceModalVisibility={"isConfirmBudgetWipeModalVisible"}
        />
      )}

      {settingsFormVisibility.typeResetMyAccountForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={
            "Are you sure you would like to reset your account data to defaults? This decision is irreversible."
          }
          typeMatchString={"Reset My Budget"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeResetMyAccountForm"}
          lastChanceModalVisibility={"isConfirmBudgetResetModalVisible"}
        />
      )}

      {settingsFormVisibility.typeDeleteMyDataForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={
            "Are you sure you would like to wipe your expense and budget data? This decision is irreversible."
          }
          typeMatchString={"Wipe My Data"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeDeleteMyDataForm"}
          lastChanceModalVisibility={"isConfirmAllDataWipeModalVisible"}
        />
      )}

      {settingsModalVisibility.isConfirmExpenseWipeModalVisible && (
        <TwoOptionModal
          optionOneText={"Cancel"}
          optionOneFunction={() => {
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmExpenseWipeModalVisible", false);
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            wipeExpenses();
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmExpenseWipeModalVisible", false);
            console.log("Wiping all expenses.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmExpenseWipeModalVisible"}
          title={"Please confirm that you wish to permanently wipe all expense data."}
        />
      )}

      {settingsModalVisibility.isConfirmAllDataWipeModalVisible && (
        <TwoOptionModal
          optionOneText={"Cancel"}
          optionOneFunction={() => {
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmAllDataWipeModalVisible", false);
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            wipeExpenses();
            wipeBudget();
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmAllDataWipeModalVisible", false);
            console.log("Wiping all data.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmAllDataWipeModalVisible"}
          title={"Please confirm that you wish to permanently wipe all budget and expense data."}
        />
      )}

      {settingsModalVisibility.isConfirmBudgetResetModalVisible && (
        <TwoOptionModal
          optionOneText={"Cancel"}
          optionOneFunction={() => {
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmBudgetResetModalVisible", false);
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            resetBudget();
            changeFormOrModalVisibility(setSettingsModalVisibility, "isConfirmBudgetResetModalVisible", false);
            console.log("Resetting budget.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmBudgetResetModalVisible"}
          title={"Please confirm that you wish to reset all account data."}
        />
      )}
    </div>
  );
}
