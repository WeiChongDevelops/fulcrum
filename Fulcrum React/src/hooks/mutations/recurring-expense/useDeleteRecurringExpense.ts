import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, getRecurringExpenseInstancesAfterDate, expenseStartDate, useEmail } from "../../../utility/util.ts";
import { useContext } from "react";
import { toast } from "sonner";
import { ExpenseItemEntity, RecurringExpenseItemEntity } from "../../../utility/types.ts";
import { handleBatchExpenseDeletion, handleRecurringExpenseDeletion } from "../../../utility/api.ts";

interface RecurringExpenseDeletionMutationProps {
  recurringExpenseId: string;
  alsoDeleteAllInstances: boolean;
  expenseArray: ExpenseItemEntity[];
}

export default function useDeleteRecurringExpense() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recurringExpenseDeletionMutationProps: RecurringExpenseDeletionMutationProps) => {
      if (recurringExpenseDeletionMutationProps.alsoDeleteAllInstances) {
        const recurringInstancesToDelete = await getRecurringExpenseInstancesAfterDate(
          recurringExpenseDeletionMutationProps.recurringExpenseId,
          recurringExpenseDeletionMutationProps.expenseArray,
          expenseStartDate,
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
      toast.success("Recurring expense removed.");
      return { recurringExpenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
    },
  });
}
