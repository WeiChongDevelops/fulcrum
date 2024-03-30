import ExpenseCreationForm from "../../expenses/forms/ExpenseCreationForm.tsx";
import {
  BudgetItemEntity,
  categoryListAsOptions,
  ExpenseItemEntity,
  getCurrencySymbol,
  getExpenseList,
  GroupItemEntity,
  handleRecurringExpenseDeletion,
  PreviousRecurringExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  RecurringExpenseModalVisibility,
  removeAllInstancesOfRecurringExpenseAfterDate,
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
  changeFormOrModalVisibility,
} from "../../../../util.ts";
import RecurringExpenseUpdatingForm from "./forms/RecurringExpenseUpdatingForm.tsx";
import TwoOptionModal from "../../other/TwoOptionModal.tsx";
import { Dispatch, SetStateAction } from "react";

interface RecurringExpenseModalsAndFormsProps {
  recurringExpenseFormVisibility: RecurringExpenseFormVisibility;
  setRecurringExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility>;
  recurringExpenseModalVisibility: RecurringExpenseModalVisibility;
  setRecurringExpenseModalVisibility: SetModalVisibility<RecurringExpenseModalVisibility>;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;

  publicUserData: PublicUserData;

  recurringExpenseIdToDelete: string;
  oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
}

/**
 * Renders the modals and forms for the recurring expenses page.
 */
export default function RecurringExpenseModalsAndForms({
  recurringExpenseFormVisibility,
  setRecurringExpenseFormVisibility,
  recurringExpenseModalVisibility,
  setRecurringExpenseModalVisibility,
  expenseArray,
  budgetArray,
  groupArray,
  setExpenseArray,
  setRecurringExpenseArray,
  setBudgetArray,
  setBlacklistedExpenseArray,
  publicUserData,
  recurringExpenseIdToDelete,
  oldRecurringExpenseBeingEdited,
}: RecurringExpenseModalsAndFormsProps) {
  function runRecurringExpenseDeletion() {
    handleRecurringExpenseDeletion(recurringExpenseIdToDelete, setRecurringExpenseArray)
      .then(() => console.log("Deletion successful"))
      .catch(() => console.log("Deletion unsuccessful"));
  }

  return (
    <div className={"z-40"}>
      {recurringExpenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setRecurringExpenseFormVisibility}
          setExpenseArray={setExpenseArray}
          setBudgetArray={setBudgetArray}
          setRecurringExpenseArray={setRecurringExpenseArray}
          budgetArray={budgetArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
          defaultCalendarDate={new Date()}
          mustBeRecurring={true}
        />
      )}

      {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible && (
        <RecurringExpenseUpdatingForm
          setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
          setRecurringExpenseArray={setRecurringExpenseArray}
          setBudgetArray={setBudgetArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
        />
      )}

      {recurringExpenseModalVisibility.isConfirmRecurringExpenseDeletionModalVisible && (
        <TwoOptionModal
          optionOneText="Cancel"
          optionOneFunction={() => {
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isConfirmRecurringExpenseDeletionModalVisible",
              false,
            );
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isConfirmRecurringExpenseDeletionModalVisible",
              false,
            );
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              true,
            );
          }}
          setModalVisibility={setRecurringExpenseModalVisibility}
          isVisible="isConfirmRecurringExpenseDeletionModalVisible"
          title="Are you sure you want to delete this recurring expense?"
        />
      )}

      {recurringExpenseModalVisibility.isSelectRecurringExpenseDeletionTypeModalVisible && (
        <TwoOptionModal
          optionOneText={"Keep Previous Repeats"}
          optionOneFunction={() => {
            runRecurringExpenseDeletion();
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              false,
            );
          }}
          optionTwoText={"Delete Previous Repeats"}
          optionTwoFunction={async () => {
            runRecurringExpenseDeletion();
            await removeAllInstancesOfRecurringExpenseAfterDate(
              recurringExpenseIdToDelete,
              expenseArray,
              setExpenseArray,
              y2K,
              setBlacklistedExpenseArray,
            );
            setExpenseArray(await getExpenseList());
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              false,
            );
          }}
          setModalVisibility={setRecurringExpenseModalVisibility}
          isVisible={"isSelectRecurringExpenseDeletionTypeModalVisible"}
          title={"Would you like to keep previous repeats? You can delete specific instances from the 'Expenses' page"}
        />
      )}
    </div>
  );
}
