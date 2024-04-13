import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, ExpenseItemEntity, expenseSort, handleBatchExpenseCreation } from "../../../util.ts";
import { useContext } from "react";

export default function useBatchCreateExpenses() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expensesToCreate: ExpenseItemEntity[]) => {
      return handleBatchExpenseCreation(expensesToCreate);
    },
    onMutate: async (expensesToCreate: ExpenseItemEntity[]) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return [...prevExpenseCache, ...expensesToCreate].sort(expenseSort);
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
