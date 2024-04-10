import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { BudgetItemEntity, EmailContext, GroupItemEntity, groupSort, handleBudgetCreation } from "../../../util.ts";

export default function useCreateBudget() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  interface BudgetCreationMutationProps {
    newBudgetItem: BudgetItemEntity;
    newGroupItem?: GroupItemEntity;
  }

  return useMutation({
    mutationFn: (budgetCreationMutationProps: BudgetCreationMutationProps) =>
      handleBudgetCreation(budgetCreationMutationProps.newBudgetItem),
    onMutate: async (budgetCreationMutationProps: BudgetCreationMutationProps) => {
      if (!!budgetCreationMutationProps.newGroupItem) {
        await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
        await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
          return [...prevGroupCache, budgetCreationMutationProps.newGroupItem!].sort(groupSort);
        });
      }
      const groupArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, budgetCreationMutationProps.newBudgetItem];
      });

      return { budgetArrayBeforeOptimisticUpdate, groupArrayBeforeOptimisticUpdate };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["groupArray", email], context?.groupArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
}
