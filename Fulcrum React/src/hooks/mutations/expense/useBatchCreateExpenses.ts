import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, expenseSort } from "../../../utility/util.ts";
import { ExpenseItemEntity } from "../../../utility/types.ts";
import { handleBatchExpenseCreation } from "../../../utility/api.ts";

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
