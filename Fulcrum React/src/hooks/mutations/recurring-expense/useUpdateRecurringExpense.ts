import { useContext } from "react";
import { EmailContext, handleRecurringExpenseUpdating, RecurringExpenseItemEntity } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateRecurringExpense() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedRecurringExpenseItem: RecurringExpenseItemEntity) => {
      return handleRecurringExpenseUpdating(updatedRecurringExpenseItem);
    },
    onMutate: async (updatedRecurringExpenseItem: RecurringExpenseItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });
      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return prevRecurringExpenseCache.map((recurringExpenseItem) =>
            recurringExpenseItem.recurringExpenseId === updatedRecurringExpenseItem.recurringExpenseId
              ? updatedRecurringExpenseItem
              : recurringExpenseItem,
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
}
