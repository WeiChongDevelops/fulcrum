import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmail } from "@/utility/util.ts";
import { BudgetItemEntity } from "@/utility/types.ts";
import { handleBudgetDeletionDirect } from "@/api/budget-api.ts";

export default function useDeleteBudget() {
  const queryClient = useQueryClient();
  const email = useEmail();

  return useMutation({
    mutationFn: (categoryToDelete: string) => {
      return handleBudgetDeletionDirect(categoryToDelete);
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
