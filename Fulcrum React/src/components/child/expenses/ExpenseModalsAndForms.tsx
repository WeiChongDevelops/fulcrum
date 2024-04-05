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
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
  changeFormOrModalVisibility,
  handleBudgetDeletion,
  EmailContext,
  getRecurringExpenseInstancesAfterDate,
  handleBatchExpenseDeletion,
  handleBatchBlacklistedExpenseCreation,
} from "../../../util.ts";
import ExpenseUpdatingForm from "./forms/ExpenseUpdatingForm.tsx";
import RecurringExpenseInstanceUpdatingForm from "../tools/recurring-expenses/forms/RecurringExpenseInstanceUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";
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
      if (expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId) {
        console.log("has recurring expense id");
        await handleBlacklistedExpenseCreation(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId,
          expenseDeletionMutationProps.expenseItemToDelete.timestamp,
        );
        let recurringInstancesToDelete: ExpenseItemEntity[] = [];
        if (expenseDeletionMutationProps.deletionScale === "FUTURE") {
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId,
            expenseArray,
            expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          );
        } else if (expenseDeletionMutationProps.deletionScale === "ALL") {
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId,
            expenseArray,
            y2K,
          );
        } else {
          return;
        }
        await handleBatchExpenseDeletion(recurringInstancesToDelete.map((expenseItem) => expenseItem.expenseId));
        await handleBatchBlacklistedExpenseCreation(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId,
          recurringInstancesToDelete.map((expenseItem) => expenseItem.timestamp),
        );
      } else {
        console.log("it didn't have a recurring expense id");
      }
      await handleExpenseDeletion(expenseDeletionMutationProps.expenseItemToDelete.expenseId);
    },
    onMutate: async (expenseDeletionMutationProps: ExpenseDeletionMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      const blacklistExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["blacklistedExpenseArray", email]);

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

      expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId &&
        (await queryClient.setQueryData(
          ["blacklistedExpenseArray", email],
          (prevBlacklistCache: BlacklistedExpenseItemEntity[]) => {
            let optimisticBlacklist = { ...prevBlacklistCache };
            for (const blacklistedExpense of recurringInstancesToDelete) {
              optimisticBlacklist = [
                ...optimisticBlacklist,
                {
                  recurringExpenseId: expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
                  timestampOfRemovedInstance: blacklistedExpense.timestamp,
                },
              ];
            }
            return optimisticBlacklist;
          },
        ));

      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        let optimisticExpenseArray = prevExpenseCache.filter(
          (expenseItem) => expenseItem.expenseId !== expenseDeletionMutationProps.expenseItemToDelete.expenseId,
        );
        if (expenseDeletionMutationProps.deletionScale === "THIS") {
          return optimisticExpenseArray;
        }
        optimisticExpenseArray = optimisticExpenseArray.filter(
          (expenseItem) => !(expenseItem.expenseId in recurringInstancesToDelete),
        );
        return optimisticExpenseArray;
      });
      return { expenseArrayBeforeOptimisticUpdate, blacklistExpenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
      queryClient.setQueryData(["blacklistedExpenseArray", email], context?.blacklistExpenseArrayBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
      queryClient.invalidateQueries({ queryKey: ["blacklistedExpenseArray", email] });
    },
  });

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
