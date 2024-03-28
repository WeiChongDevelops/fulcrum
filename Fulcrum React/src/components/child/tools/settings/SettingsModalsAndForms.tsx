import { TypeMatchConfirmationForm } from "./TypeMatchConfirmationForm.tsx";
import TwoOptionModal from "../../other/TwoOptionModal.tsx";
import {
  handleWipeBudget,
  handleWipeData,
  handleWipeExpenses,
  SettingsFormVisibility,
  SettingsModalVisibility,
} from "../../../../util.ts";
import { Dispatch, SetStateAction } from "react";

interface SettingsModalsAndFormsProps {
  settingsFormVisibility: SettingsFormVisibility;
  setSettingsFormVisibility: Dispatch<SetStateAction<SettingsFormVisibility>>;
  settingsModalVisibility: SettingsModalVisibility;
  setSettingsModalVisibility: Dispatch<SetStateAction<SettingsModalVisibility>>;
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
  return (
    <div className="z-40">
      {settingsFormVisibility.typeDeleteMyExpensesForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={
            "Are you sure you would like to wipe your expense logs? This decision is irreversible."
          }
          typeMatchString={"Wipe My Expenses"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeDeleteMyExpensesForm"}
          lastChanceModalVisibility={"isConfirmExpenseWipeModalVisible"}
        />
      )}

      {settingsFormVisibility.typeDeleteMyBudgetForm && (
        <TypeMatchConfirmationForm
          areYouSureMessage={
            "Are you sure you would like to wipe your budget data? This decision is irreversible."
          }
          typeMatchString={"Wipe My Budget"}
          setFormVisibility={setSettingsFormVisibility}
          setModalVisibility={setSettingsModalVisibility}
          formVisibility={"typeDeleteMyBudgetForm"}
          lastChanceModalVisibility={"isConfirmBudgetWipeModalVisible"}
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
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmExpenseWipeModalVisible: false,
            }));
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            handleWipeExpenses();
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmExpenseWipeModalVisible: false,
            }));
            console.log("Wiping all expenses.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmExpenseWipeModalVisible"}
          title={
            "Please confirm that you wish to permanently wipe all expense data."
          }
        />
      )}

      {settingsModalVisibility.isConfirmBudgetWipeModalVisible && (
        <TwoOptionModal
          optionOneText={"Cancel"}
          optionOneFunction={() => {
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmBudgetWipeModalVisible: false,
            }));
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            handleWipeBudget();
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmBudgetWipeModalVisible: false,
            }));
            console.log("Wiping all budgets.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmBudgetWipeModalVisible"}
          title={
            "Please confirm that you wish to permanently wipe all budget data."
          }
        />
      )}

      {settingsModalVisibility.isConfirmAllDataWipeModalVisible && (
        <TwoOptionModal
          optionOneText={"Cancel"}
          optionOneFunction={() => {
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmAllDataWipeModalVisible: false,
            }));
          }}
          optionTwoText={"Delete"}
          optionTwoFunction={() => {
            handleWipeData();
            setSettingsModalVisibility((current) => ({
              ...current,
              isConfirmAllDataWipeModalVisible: false,
            }));
            console.log("Wiping all data.");
          }}
          setModalVisibility={setSettingsModalVisibility}
          isVisible={"isConfirmAllDataWipeModalVisible"}
          title={
            "Please confirm that you wish to permanently wipe all budget and expense data."
          }
        />
      )}
    </div>
  );
}
