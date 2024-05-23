import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { handleBudgetDeletion } from "../../../utility/api.ts";
import { BudgetItemEntity } from "../../../utility/types.ts";

export default function useDeleteBudget() {
  const queryClient = useQueryClient();
  const email = useEmail();

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
      toast.success("Budget removed.");
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
      return queryClient.setQueryData(["budgetArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });
}
