import ExpenseCreationForm from "../../expenses/forms/ExpenseCreationForm.tsx";
import { categoryListAsOptions, changeFormOrModalVisibility, getCurrencySymbol } from "../../../../utility/util.ts";
import RecurringExpenseUpdatingForm from "./forms/RecurringExpenseUpdatingForm.tsx";
import TwoOptionModal from "../../modals/TwoOptionModal.tsx";
import useDeleteRecurringExpense from "../../../../hooks/mutations/recurring-expense/useDeleteRecurringExpense.ts";
import {
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  PreviousRecurringExpenseBeingEdited,
  UserPreferences,
  RecurringExpenseFormVisibility,
  RecurringExpenseModalVisibility,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface RecurringExpenseModalsAndFormsProps {
  recurringExpenseFormVisibility: RecurringExpenseFormVisibility;
  setRecurringExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility>;
  recurringExpenseModalVisibility: RecurringExpenseModalVisibility;
  setRecurringExpenseModalVisibility: SetModalVisibility<RecurringExpenseModalVisibility>;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  userPreferences: UserPreferences;

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
  userPreferences,
  recurringExpenseIdToDelete,
  oldRecurringExpenseBeingEdited,
}: RecurringExpenseModalsAndFormsProps) {
  const { mutate: deleteRecurringExpense } = useDeleteRecurringExpense();

  return (
    <div className={"z-40"}>
      {recurringExpenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setRecurringExpenseFormVisibility}
          budgetArray={budgetArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          currencySymbol={getCurrencySymbol(userPreferences.currency)}
          defaultCalendarDate={new Date()}
          mustBeRecurring={true}
        />
      )}

      {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible && (
        <RecurringExpenseUpdatingForm
          setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(userPreferences.currency)}
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
            deleteRecurringExpense({
              recurringExpenseId: recurringExpenseIdToDelete,
              alsoDeleteAllInstances: false,
              expenseArray: expenseArray,
            });
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              false,
            );
          }}
          optionTwoText={"Delete Previous Repeats"}
          optionTwoFunction={async () => {
            deleteRecurringExpense({
              recurringExpenseId: recurringExpenseIdToDelete,
              alsoDeleteAllInstances: true,
              expenseArray: expenseArray,
            });
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              false,
            );
          }}
          setModalVisibility={setRecurringExpenseModalVisibility}
          isVisible={"isSelectRecurringExpenseDeletionTypeModalVisible"}
          title={"Would you like to keep previous repeats? You can delete specific instances from the 'Expenses' section"}
        />
      )}
    </div>
  );
}
