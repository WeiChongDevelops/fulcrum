import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { ExpenseItemEntity } from "../../../utility/types.ts";
import { handleBatchExpenseDeletionDirect } from "@/api/expense-api.ts";

export default function useBatchDeleteExpenses() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseIdsToDelete: string[]) => {
      return handleBatchExpenseDeletionDirect(expenseIdsToDelete);
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
