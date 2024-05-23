import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { handleBatchExpenseDeletion } from "../../../utility/api.ts";
import { ExpenseItemEntity } from "../../../utility/types.ts";

export default function useBatchDeleteExpenses() {
  const email = useEmail();
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
