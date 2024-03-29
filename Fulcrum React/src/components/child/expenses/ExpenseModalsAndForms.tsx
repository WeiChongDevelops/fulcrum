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
  getRemovedRecurringExpenses,
  GroupItemEntity,
  handleExpenseDeletion,
  handleRemovedRecurringExpenseCreation,
  PreviousExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseItemEntity,
  removeAllInstancesOf,
  RemovedRecurringExpenseItemEntity,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
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
  setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItemEntity[]>>;

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
  setRemovedRecurringExpenseInstances,
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
    if (expenseItemToDelete) {
      if (expenseItemToDeleteIsRecurring) {
        handleRemovedRecurringExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp)
          .then(() => {
            console.log("Logged recurrence removal successful");
            getRemovedRecurringExpenses()
              .then((results) => setRemovedRecurringExpenseInstances(results))
              .then(() =>
                handleExpenseDeletion(expenseIdToDelete, setExpenseArray)
                  .then(() => console.log("Deletion successful"))
                  .catch(() => console.log("Deletion unsuccessful")),
              );
          })
          .catch(() => console.log("Logged recurrence removal unsuccessful"));
      } else {
        handleExpenseDeletion(expenseIdToDelete, setExpenseArray)
          .then(() => console.log("Deletion successful"))
          .catch(() => console.log("Deletion unsuccessful"));
      }
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
          setRemovedRecurringExpenseInstances={setRemovedRecurringExpenseInstances}
        />
      )}

      {expenseModalVisibility.isConfirmExpenseDestructionModalVisible &&
        (expenseItemToDeleteIsRecurring ? (
          <ThreeOptionModal
            optionOneText={"Delete This Instance Only"}
            optionOneFunction={() => {
              runExpenseDeletion();
              setExpenseModalVisibility((current) => ({
                ...current,
                isConfirmExpenseDestructionModalVisible: false,
              }));
            }}
            optionTwoText={"Delete Future Instances"}
            optionTwoFunction={async () => {
              await removeAllInstancesOf(
                expenseItemToDelete!.recurringExpenseId!,
                expenseArray,
                setExpenseArray,
                expenseItemToDelete!.timestamp,
                setRemovedRecurringExpenseInstances,
              );
              setExpenseArray(await getExpenseList());
              setExpenseModalVisibility((current) => ({
                ...current,
                isConfirmExpenseDestructionModalVisible: false,
              }));
            }}
            optionThreeText={"Delete All Instances"}
            optionThreeFunction={async () => {
              await removeAllInstancesOf(
                expenseItemToDelete!.recurringExpenseId!,
                expenseArray,
                setExpenseArray,
                y2K,
                setRemovedRecurringExpenseInstances,
              );
              setExpenseArray(await getExpenseList());
              setExpenseModalVisibility((current) => ({
                ...current,
                isConfirmExpenseDestructionModalVisible: false,
              }));
            }}
            setModalVisibility={setExpenseModalVisibility}
            isVisible="isConfirmExpenseDestructionModalVisible"
            title="Are you sure you want to delete this expense?"
          />
        ) : (
          <TwoOptionModal
            optionOneText="Cancel"
            optionOneFunction={() =>
              setExpenseModalVisibility((current) => ({
                ...current,
                isConfirmExpenseDestructionModalVisible: false,
              }))
            }
            optionTwoText="Confirm"
            optionTwoFunction={() => {
              runExpenseDeletion();
              setExpenseModalVisibility((current) => ({
                ...current,
                isConfirmExpenseDestructionModalVisible: false,
              }));
            }}
            setModalVisibility={setExpenseModalVisibility}
            isVisible="isConfirmExpenseDestructionModalVisible"
            title="Are you sure you want to delete this expense?"
          />
        ))}
    </div>
  );
}
