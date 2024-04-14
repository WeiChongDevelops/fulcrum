import { BudgetItemEntity, EmailContext, GroupItemEntity, handleGroupUpdating } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

interface GroupUpdatingMutationProps {
  originalGroupName: string;
  updatedGroupItem: GroupItemEntity;
}

export default function useUpdateGroup() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (groupUpdatingMutationProps: GroupUpdatingMutationProps) =>
      handleGroupUpdating(groupUpdatingMutationProps.originalGroupName, groupUpdatingMutationProps.updatedGroupItem),
    onMutate: async (groupUpdatingMutationProps: GroupUpdatingMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const groupArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return prevGroupCache.map((groupItem) =>
          groupItem.group === groupUpdatingMutationProps.originalGroupName
            ? groupUpdatingMutationProps.updatedGroupItem
            : groupItem,
        );
      });

      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const budgetBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.map((budgetItem) =>
          budgetItem.group === groupUpdatingMutationProps.originalGroupName
            ? { ...budgetItem, group: groupUpdatingMutationProps.updatedGroupItem.group }
            : budgetItem,
        );
      });
      toast.success("Budget group updated.");
      return { groupArrayBeforeOptimisticUpdate, budgetBeforeOptimisticUpdate };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["groupArray", email], context?.groupArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["budgetArray", email], context?.budgetBeforeOptimisticUpdate);
      toast.error("Updated budget group is invalid. The new group name may be already in use.", {
        duration: 7_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });
}
