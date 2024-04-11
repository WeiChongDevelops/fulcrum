import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, GroupItemEntity, handleGroupDeletion } from "../../../util.ts";

interface GroupDeletionProps {
  groupToDelete: string;
  keepContainedCategories: boolean;
}

export default function useDeleteGroup() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (groupDeletionProps: GroupDeletionProps) => {
      return handleGroupDeletion(groupDeletionProps.groupToDelete, groupDeletionProps.keepContainedCategories);
    },
    onMutate: async (groupDeletionProps: GroupDeletionProps) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return prevGroupCache.filter((groupItem) => groupItem.group !== groupDeletionProps.groupToDelete);
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });
}
