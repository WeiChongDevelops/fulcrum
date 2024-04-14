import { useContext } from "react";
import { EmailContext, ExpenseItemEntity, handleExpenseUpdating } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useUpdateExpense() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedExpenseItem: ExpenseItemEntity) => {
      return handleExpenseUpdating(updatedExpenseItem);
    },
    onMutate: async (updatedExpenseItem: ExpenseItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.map((expenseItem) =>
          expenseItem.expenseId === updatedExpenseItem.expenseId ? updatedExpenseItem : expenseItem,
        );
      });
      toast.success("Expense updated.");
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.dataBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: async () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });
}
