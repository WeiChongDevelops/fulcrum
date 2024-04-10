import ExpenseCreationForm from "../../expenses/forms/ExpenseCreationForm.tsx";
import {
  BudgetItemEntity,
  categoryListAsOptions,
  ExpenseItemEntity,
  getCurrencySymbol,
  GroupItemEntity,
  handleRecurringExpenseDeletion,
  PreviousRecurringExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  RecurringExpenseModalVisibility,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
  changeFormOrModalVisibility,
  EmailContext,
  getRecurringExpenseInstancesAfterDate,
  handleBatchExpenseDeletion,
} from "../../../../util.ts";
import RecurringExpenseUpdatingForm from "./forms/RecurringExpenseUpdatingForm.tsx";
import TwoOptionModal from "../../other/TwoOptionModal.tsx";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RecurringExpenseModalsAndFormsProps {
  recurringExpenseFormVisibility: RecurringExpenseFormVisibility;
  setRecurringExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility>;
  recurringExpenseModalVisibility: RecurringExpenseModalVisibility;
  setRecurringExpenseModalVisibility: SetModalVisibility<RecurringExpenseModalVisibility>;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

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
  publicUserData,
  recurringExpenseIdToDelete,
  oldRecurringExpenseBeingEdited,
}: RecurringExpenseModalsAndFormsProps) {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  interface RecurringExpenseDeletionMutationProps {
    recurringExpenseId: string;
    alsoDeleteAllInstances: boolean;
  }

  const recurringExpenseDeletionMutation = useMutation({
    mutationFn: async (recurringExpenseDeletionMutationProps: RecurringExpenseDeletionMutationProps) => {
      if (recurringExpenseDeletionMutationProps.alsoDeleteAllInstances) {
        const recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
          recurringExpenseDeletionMutationProps.recurringExpenseId,
          expenseArray,
          y2K,
        );
        await handleBatchExpenseDeletion(recurringInstancesToDelete.map((expenseItem) => expenseItem.expenseId));
      }
      return handleRecurringExpenseDeletion(recurringExpenseDeletionMutationProps.recurringExpenseId);
    },
    onMutate: async (recurringExpenseDeletionMutationProps: RecurringExpenseDeletionMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });
      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return prevRecurringExpenseCache.filter(
            (recurringExpenseItem) =>
              recurringExpenseItem.recurringExpenseId !== recurringExpenseDeletionMutationProps.recurringExpenseId,
          );
        },
      );
      return { recurringExpenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
    },
  });

  return (
    <div className={"z-40"}>
      {recurringExpenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setRecurringExpenseFormVisibility}
          budgetArray={budgetArray}
          groupArray={groupArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
          defaultCalendarDate={new Date()}
          mustBeRecurring={true}
        />
      )}

      {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible && (
        <RecurringExpenseUpdatingForm
          setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
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
            recurringExpenseDeletionMutation.mutate({
              recurringExpenseId: recurringExpenseIdToDelete,
              alsoDeleteAllInstances: false,
            });
            changeFormOrModalVisibility(
              setRecurringExpenseModalVisibility,
              "isSelectRecurringExpenseDeletionTypeModalVisible",
              false,
            );
          }}
          optionTwoText={"Delete Previous Repeats"}
          optionTwoFunction={async () => {
            recurringExpenseDeletionMutation.mutate({
              recurringExpenseId: recurringExpenseIdToDelete,
              alsoDeleteAllInstances: true,
            });
            // await removeAllInstancesOfRecurringExpenseAfterDate(
            //   recurringExpenseIdToDelete,
            //   expenseArray,
            //   setExpenseArray,
            //   y2K,
            //   setBlacklistedExpenseArray,
            // );
            // setExpenseArray(await getExpenseList());
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
