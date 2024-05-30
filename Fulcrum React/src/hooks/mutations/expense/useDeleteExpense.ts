import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecurringExpenseInstancesAfterDate, expenseStartDate, useEmail } from "../../../utility/util.ts";
import { toast } from "sonner";
import {
  handleBatchBlacklistedExpenseCreation,
  handleBatchExpenseDeletion,
  handleBlacklistedExpenseCreation,
  handleExpenseDeletion,
} from "../../../utility/api.ts";
import { BlacklistedExpenseItemEntity, ExpenseItemEntity } from "../../../utility/types.ts";
import { handleBlacklistedExpenseCreationDirect } from "@/api/blacklist-api.ts";
import { handleExpenseDeletionDirect } from "@/api/expense-api.ts";

type ExpenseDeletionScale = "THIS" | "FUTURE" | "ALL";

interface ExpenseDeletionMutationProps {
  expenseItemToDelete: ExpenseItemEntity;
  deletionScale: ExpenseDeletionScale;
  expenseArray: ExpenseItemEntity[];
}

export default function useDeleteExpense() {
  const queryClient = useQueryClient();
  const email = useEmail();

  return useMutation({
    mutationFn: async (expenseDeletionMutationProps: ExpenseDeletionMutationProps) => {
      if (expenseDeletionMutationProps.deletionScale === "THIS") {
        if (!!expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId) {
          // await handleBlacklistedExpenseCreation(
          //   expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
          //   expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          // );
          await handleBlacklistedExpenseCreationDirect(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          );
        }
        await handleExpenseDeletionDirect(expenseDeletionMutationProps.expenseItemToDelete.expenseId);
      } else {
        let recurringInstancesToDelete: ExpenseItemEntity[] = [];
        if (expenseDeletionMutationProps.deletionScale === "FUTURE") {
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseDeletionMutationProps.expenseArray,
            expenseDeletionMutationProps.expenseItemToDelete.timestamp,
          );
        } else if (expenseDeletionMutationProps.deletionScale === "ALL") {
          recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
            expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
            expenseDeletionMutationProps.expenseArray,
            expenseStartDate,
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
          expenseDeletionMutationProps.expenseArray,
          expenseDeletionMutationProps.expenseItemToDelete.timestamp,
        );
      } else if (expenseDeletionMutationProps.deletionScale === "ALL") {
        recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
          expenseDeletionMutationProps.expenseItemToDelete.recurringExpenseId!,
          expenseDeletionMutationProps.expenseArray,
          expenseStartDate,
        );
      }

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
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["blacklistedExpenseArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
      toast.dismiss();
      toast.success("Expense(s) removed.");
    },
  });
}
