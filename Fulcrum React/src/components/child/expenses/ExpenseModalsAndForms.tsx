import ExpenseCreationForm from "./forms/ExpenseCreationForm.tsx";
import {
  BudgetItemEntity,
  categoryListAsOptions,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getCurrencySymbol,
  GroupItemEntity,
  handleExpenseDeletion,
  handleBlacklistedExpenseCreation,
  PreviousExpenseBeingEdited,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
  changeFormOrModalVisibility,
  EmailContext,
  getRecurringExpenseInstancesAfterDate,
  handleBatchExpenseDeletion,
  handleBatchBlacklistedExpenseCreation,
} from "../../../util.ts";
import ExpenseUpdatingForm from "./forms/ExpenseUpdatingForm.tsx";
import RecurringExpenseInstanceUpdatingForm from "../tools/recurring-expenses/forms/RecurringExpenseInstanceUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import { useContext } from "react";
import ThreeOptionModal from "../other/ThreeOptionModal.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  // async function runExpenseDeletion() {
  //   setExpenseArray((prevExpenseArray) =>
  //     prevExpenseArray.filter((expenseItem) => expenseItem.expenseId !== expenseIdToDelete),
  //   );
  //   if (expenseItemToDelete && expenseItemToDeleteIsRecurring) {
  //     await handleBlacklistedExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp);
  //     setBlacklistedExpenseArray(await getBlacklistedExpenses());
  //     await handleExpenseDeletion(expenseIdToDelete, setExpenseArray);
  //   }
  // }

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  type ExpenseDeletionScale = "THIS" | "FUTURE" | "ALL";

  interface ExpenseDeletionMutationProps {
    expenseItemToDelete: ExpenseItemEntity;
    deletionScale: ExpenseDeletionScale;
  }

  const expenseDeletionMutation = useMutation({
    mutationFn: async (expenseDeletionMutationProps: ExpenseDeletionMutationProps) => {
      console.log("Mutation running");
      // console.log(expenseDeletionMutationProps.expenseItemToDelete);
      // If it's a recurring expense instance, add to blacklist and if requested by user delete future/all instances
      if (expenseDeletionMutationProps.deletionScale === "THIS") {
        if (!!expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId) {
          await handleBlacklistedExpenseCreation(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          );
        }
        await handleExpenseDeletion(expenseDeletionMutationProps.expenseItemToDelete.expenseId);
      } else {
        let recurringInstancesToDelete: ExpenseItemEntity[] = [];
        if (expenseDeletionMutationProps.deletionScale === "FUTURE") {
          console.log("future pathing is right.");
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseArray,
            expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          );
        } else if (expenseDeletionMutationProps.deletionScale === "ALL") {
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseArray,
            y2K,
          );
        }
        await handleBatchBlacklistedExpenseCreation(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
          recurringInstancesToDelete.map((expenseItem) => expenseItem.timestamp),
        );
        await handleBatchExpenseDeletion(recurringInstancesToDelete.map((expenseItem) => expenseItem.expenseId));
      }
    },
    onMutate: async (expenseDeletionMutationProps: ExpenseDeletionMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["blacklistedExpenseArray", email] });

      const blacklistExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["blacklistedExpenseArray", email]);
      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);

      queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.filter(
          (expenseItem) => expenseItem.expenseId !== expenseDeletionMutationProps.expenseItemToDelete.expenseId,
        );
      });

      let recurringInstancesToDelete: ExpenseItemEntity[] = [];
      if (expenseDeletionMutationProps.deletionScale === "FUTURE") {
        recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
          expenseArray,
          expenseDeletionMutationProps.expenseItemToDelete.timestamp,
        );
      } else if (expenseDeletionMutationProps.deletionScale === "ALL") {
        recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
          expenseArray,
          y2K,
        );
      }
      console.log("below is the deletion list for both batch functions.");
      console.log(recurringInstancesToDelete);

      if (expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId) {
        queryClient.setQueryData(
          ["blacklistedExpenseArray", email],
          (prevBlacklistCache: BlacklistedExpenseItemEntity[]) => {
            const newBlacklistEntries: BlacklistedExpenseItemEntity[] = [...recurringInstancesToDelete].map(
              (expenseItem) => ({
                recurringExpenseId: expenseItem.recurringExpenseId!,
                timestampOfRemovedInstance: expenseItem.timestamp,
              }),
            );
            return [...prevBlacklistCache, newBlacklistEntries];
          },
        );
      }
      queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.filter(
          (expenseItem) =>
            !recurringInstancesToDelete.map((expenseItem) => expenseItem.expenseId).includes(expenseItem.expenseId),
        );
      });
      return { expenseArrayBeforeOptimisticUpdate, blacklistExpenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
      queryClient.setQueryData(["blacklistedExpenseArray", email], context?.blacklistExpenseArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["blacklistedExpenseArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  return (
    <div className={"z-40"}>
      {expenseFormVisibility.isCreateExpenseVisible && (
        <ExpenseCreationForm
          setExpenseFormVisibility={setExpenseFormVisibility}
          budgetArray={budgetArray}
          groupArray={groupArray}
          categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
          currencySymbol={getCurrencySymbol(publicUserData.currency)}
          defaultCalendarDate={defaultCalendarDate}
          mustBeRecurring={false}
        />
      )}
      {expenseFormVisibility.isUpdateExpenseVisible && (
        <ExpenseUpdatingForm
          // budgetArray={budgetArray}
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
              expenseDeletionMutation.mutate({ expenseItemToDelete: expenseItemToDelete!, deletionScale: "THIS" });
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionTwoText={"Delete This and Future Repeats"}
            optionTwoFunction={() => {
              // await removeAllInstancesOfRecurringExpenseAfterDate(
              //   expenseItemToDelete!.recurringExpenseId!,
              //   expenseArray,
              //   setExpenseArray,
              //   expenseItemToDelete!.timestamp,
              //   setBlacklistedExpenseArray,
              // );
              // setExpenseArray(await getExpenseList());
              expenseDeletionMutation.mutate({ expenseItemToDelete: expenseItemToDelete!, deletionScale: "FUTURE" });
              changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", false);
            }}
            optionThreeText={"Delete All Repeats"}
            optionThreeFunction={() => {
              // await removeAllInstancesOfRecurringExpenseAfterDate(
              //   expenseItemToDelete!.recurringExpenseId!,
              //   expenseArray,
              //   setExpenseArray,
              //   y2K,
              //   setBlacklistedExpenseArray,
              // );
              // setExpenseArray(await getExpenseList());
              console.log("expenseItemToDelete");
              console.log(expenseItemToDelete);
              expenseDeletionMutation.mutate({ expenseItemToDelete: expenseItemToDelete!, deletionScale: "ALL" });
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
              expenseDeletionMutation.mutate({ expenseItemToDelete: expenseItemToDelete!, deletionScale: "THIS" });
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
