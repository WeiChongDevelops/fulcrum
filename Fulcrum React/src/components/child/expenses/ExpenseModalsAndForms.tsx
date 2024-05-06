import ExpenseCreationForm from "./forms/ExpenseCreationForm.tsx";
import {
  categoryListAsOptions,
  changeFormOrModalVisibility,
  getCurrencySymbol,
  LocationContext,
} from "../../../utility/util.ts";
import ExpenseUpdatingForm from "./forms/ExpenseUpdatingForm.tsx";
import RecurringExpenseInstanceUpdatingForm from "../tools/recurring-expenses/forms/RecurringExpenseInstanceUpdatingForm.tsx";
import TwoOptionModal from "../modals/TwoOptionModal.tsx";
import ThreeOptionModal from "../modals/ThreeOptionModal.tsx";
import useDeleteExpense from "../../../hooks/mutations/expense/useDeleteExpense.ts";
import {
  BudgetItemEntity,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  GroupItemEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../utility/types.ts";
import { toast } from "sonner";
import { useContext, useEffect, useState } from "react";

interface ExpenseModalsAndFormsProps {
  expenseFormVisibility: ExpenseFormVisibility;
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  expenseModalVisibility: ExpenseModalVisibility;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  publicUserData: PublicUserData;
  defaultCalendarDate: Date;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  expenseItemToDelete: ExpenseItemEntity;
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
  publicUserData,
  defaultCalendarDate,
  oldExpenseBeingEdited,
  expenseItemToDelete,
}: ExpenseModalsAndFormsProps) {
  const [toastId, setToastId] = useState<string | number>();
  const { mutate: deleteExpense, isPending } = useDeleteExpense();
  const routerLocation = useContext(LocationContext);

  useEffect(() => {
    if (isPending) {
      setToastId(
        toast.loading("Syncing changes, please wait.", {
          description: "Large deletions may take a bit longer.",
          style: {
            textAlign: "left",
          },
        }),
      );
    } else {
      !!toastId && toast.dismiss(toastId);
    }
  }, [isPending, routerLocation]);

  return (
    <div className={"z-40"}>
      {expenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setExpenseFormVisibility}
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
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
        />
      )}

      {expenseFormVisibility.isUpdateRecurringExpenseInstanceVisible && (
        <RecurringExpenseInstanceUpdatingForm
          setExpenseFormVisibility={setExpenseFormVisibility}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
        />
      )}

      {expenseModalVisibility.isConfirmExpenseDeletionModalVisible &&
        (!!expenseItemToDelete?.recurringExpenseId ? (
          <ThreeOptionModal
            optionOneText={"Delete This Repeat Only"}
            optionOneFunction={() => {
              deleteExpense({
                expenseItemToDelete: expenseItemToDelete!,
                deletionScale: "THIS",
                expenseArray: expenseArray,
              });
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionTwoText={"Delete This and Future Repeats"}
            optionTwoFunction={() => {
              deleteExpense({
                expenseItemToDelete: expenseItemToDelete!,
                deletionScale: "FUTURE",
                expenseArray: expenseArray,
              });
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionThreeText={"Delete All Repeats"}
            optionThreeFunction={() => {
              console.log("expenseItemToDelete");
              console.log(expenseItemToDelete);
              deleteExpense({ expenseItemToDelete: expenseItemToDelete!, deletionScale: "ALL", expenseArray: expenseArray });
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            setModalVisibility={setExpenseModalVisibility}
            isVisible="isConfirmExpenseDeletionModalVisible"
            title="Are you sure you want to delete this expense? To stop all future repeats, please see the 'Tools' page."
          />
        ) : (
          <TwoOptionModal
            optionOneText="Cancel"
            optionOneFunction={() =>
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false)
            }
            optionTwoText="Confirm"
            optionTwoFunction={() => {
              deleteExpense({
                expenseItemToDelete: expenseItemToDelete!,
                deletionScale: "THIS",
                expenseArray: expenseArray,
              });
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
