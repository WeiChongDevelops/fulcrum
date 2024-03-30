import ExpenseCreationForm from "./forms/ExpenseCreationForm.tsx";
import {
  BudgetItemEntity,
  categoryListAsOptions,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  findExpenseWithId,
  getCurrencySymbol,
  getExpenseList,
  getBlacklistedExpenses,
  GroupItemEntity,
  handleExpenseDeletion,
  handleBlacklistedExpenseCreation,
  PreviousExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseItemEntity,
  removeAllInstancesOfRecurringExpenseAfterDate,
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
  changeFormOrModalVisibility,
} from "../../../util.ts";
import ExpenseUpdatingForm from "./forms/ExpenseUpdatingForm.tsx";
import RecurringExpenseInstanceUpdatingForm from "../tools/recurring-expenses/forms/RecurringExpenseInstanceUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import { Dispatch, SetStateAction, useMemo } from "react";
import ThreeOptionModal from "../other/ThreeOptionModal.tsx";

interface ExpenseModalsAndFormsProps {
  expenseFormVisibility: ExpenseFormVisibility;
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  expenseModalVisibility: ExpenseModalVisibility;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;

  publicUserData: PublicUserData;
  defaultCalendarDate: Date;

  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  expenseIdToDelete: string;
}

/**
 * Renders the modals and forms for the expenses page.
 */
export default function ExpenseModalsAndForms({
  expenseFormVisibility,
  setExpenseFormVisibility,
  expenseModalVisibility,
  setExpenseModalVisibility,
  expenseArray,
  budgetArray,
  groupArray,
  setExpenseArray,
  setBudgetArray,
  setRecurringExpenseArray,
  setBlacklistedExpenseArray,
  publicUserData,
  defaultCalendarDate,
  oldExpenseBeingEdited,
  expenseIdToDelete,
}: ExpenseModalsAndFormsProps) {
  const expenseItemToDelete = findExpenseWithId(expenseIdToDelete, expenseArray);
  const expenseItemToDeleteIsRecurring = useMemo(
    () => expenseItemToDelete?.recurringExpenseId !== null,
    [expenseIdToDelete],
  );

  async function runExpenseDeletion() {
    setExpenseArray((prevExpenseArray) =>
      prevExpenseArray.filter((expenseItem) => expenseItem.expenseId !== expenseIdToDelete),
    );
    if (expenseItemToDelete && expenseItemToDeleteIsRecurring) {
      await handleBlacklistedExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp);
      setBlacklistedExpenseArray(await getBlacklistedExpenses());
      await handleExpenseDeletion(expenseIdToDelete, setExpenseArray);
    }
  }

  return (
    <div className={"z-40"}>
      {expenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseArray={setExpenseArray}
          setBudgetArray={setBudgetArray}
          setRecurringExpenseArray={setRecurringExpenseArray}
          budgetArray={budgetArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
          defaultCalendarDate={defaultCalendarDate}
          mustBeRecurring={false}
        />
      )}
      {expenseFormVisibility.isUpdateExpenseVisible && (
        <ExpenseUpdatingForm
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseArray={setExpenseArray}
          setBudgetArray={setBudgetArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
        />
      )}

      {expenseFormVisibility.isUpdateRecurringExpenseInstanceVisible && (
        <RecurringExpenseInstanceUpdatingForm
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseArray={setExpenseArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
          setBlacklistedExpenseArray={setBlacklistedExpenseArray}
        />
      )}

      {expenseModalVisibility.isConfirmExpenseDeletionModalVisible &&
        (expenseItemToDeleteIsRecurring ? (
          <ThreeOptionModal
            optionOneText={"Delete This Repeat Only"}
            optionOneFunction={() => {
              runExpenseDeletion();
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionTwoText={"Delete This and Future Repeats"}
            optionTwoFunction={async () => {
              await removeAllInstancesOfRecurringExpenseAfterDate(
                expenseItemToDelete!.recurringExpenseId!,
                expenseArray,
                setExpenseArray,
                expenseItemToDelete!.timestamp,
                setBlacklistedExpenseArray,
              );
              setExpenseArray(await getExpenseList());
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionThreeText={"Delete All Repeats"}
            optionThreeFunction={async () => {
              await removeAllInstancesOfRecurringExpenseAfterDate(
                expenseItemToDelete!.recurringExpenseId!,
                expenseArray,
                setExpenseArray,
                y2K,
                setBlacklistedExpenseArray,
              );
              setExpenseArray(await getExpenseList());
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            setModalVisibility={setExpenseModalVisibility}
            isVisible="isConfirmExpenseDeletionModalVisible"
            title="Are you sure you want to delete this expense? For more recurring expense options, see the 'Tools' page."
          />
        ) : (
          <TwoOptionModal
            optionOneText="Cancel"
            optionOneFunction={() =>
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false)
            }
            optionTwoText="Confirm"
            optionTwoFunction={() => {
              runExpenseDeletion();
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            setModalVisibility={setExpenseModalVisibility}
            isVisible="isConfirmExpenseDeletionModalVisible"
            title="Are you sure you want to delete this expense?"
          />
        ))}
    </div>
  );
}
