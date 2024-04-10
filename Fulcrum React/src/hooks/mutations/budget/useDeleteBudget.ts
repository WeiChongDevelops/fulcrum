import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { BudgetItemEntity, EmailContext, handleBudgetDeletion } from "../../../util.ts";

export default function useDeleteBudget() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (categoryToDelete: string) => {
      return handleBudgetDeletion(categoryToDelete);
    },
    onMutate: async (categoryToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.filter((budgetItem) => budgetItem.category !== categoryToDelete);
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["budgetArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });
}
