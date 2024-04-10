import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, ExpenseItemEntity, handleBatchExpenseDeletion } from "../../../util.ts";
import { useContext } from "react";

export default function useBatchDeleteExpenses() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseIdsToDelete: string[]) => {
      return handleBatchExpenseDeletion(expenseIdsToDelete);
    },
    onMutate: async (expenseIdsToDelete: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.filter((expenseItem) => !(expenseItem.expenseId in expenseIdsToDelete));
      });
      return { expenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });
}
