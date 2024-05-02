import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";
import { BudgetItemEntity, GroupItemEntity } from "../../../utility/types.ts";
import { EmailContext, groupSort } from "../../../utility/util.ts";
import { handleBudgetUpdating } from "../../../utility/api.ts";

interface BudgetUpdatingMutationProps {
  originalCategory: string;
  updatedBudgetItem: BudgetItemEntity;
  newGroupItem?: GroupItemEntity;
}

export default function useUpdateBudget() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (budgetUpdatingMutationProps: BudgetUpdatingMutationProps) => {
      return handleBudgetUpdating(
        budgetUpdatingMutationProps.originalCategory,
        budgetUpdatingMutationProps.updatedBudgetItem,
      );
    },
    onMutate: async (budgetUpdatingMutationProps: BudgetUpdatingMutationProps) => {
      console.log("Updated budget item");
      console.log({
        ...budgetUpdatingMutationProps.updatedBudgetItem,
      });

      if (!!budgetUpdatingMutationProps.newGroupItem) {
        await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
        await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
          return [...prevGroupCache, budgetUpdatingMutationProps.newGroupItem!].sort(groupSort);
        });
      }
      const groupArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);

      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.map((budgetItem) =>
          budgetItem.category === budgetUpdatingMutationProps.originalCategory
            ? {
                ...budgetUpdatingMutationProps.updatedBudgetItem,
                amount: budgetUpdatingMutationProps.updatedBudgetItem.amount,
              }
            : budgetItem,
        );
      });
      toast.success("Budget updated!");
      return { budgetArrayBeforeOptimisticUpdate, groupArrayBeforeOptimisticUpdate };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["groupArray", email], context?.groupArrayBeforeOptimisticUpdate);
      toast.error("Updated budget is invalid. The new budget name may be already in use.", {
        duration: 7_000,
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
}
