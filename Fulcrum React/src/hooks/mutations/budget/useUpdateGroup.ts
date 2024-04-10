import { EmailContext, GroupItemEntity, handleGroupUpdating } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

export default function useUpdateGroup() {
  interface GroupUpdatingMutationProps {
    originalGroupName: string;
    updatedGroupItem: GroupItemEntity;
  }

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);
  return useMutation({
    mutationFn: (groupUpdatingMutationProps: GroupUpdatingMutationProps) =>
      handleGroupUpdating(groupUpdatingMutationProps.originalGroupName, groupUpdatingMutationProps.updatedGroupItem),
    onMutate: async (groupUpdatingMutationProps: GroupUpdatingMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return prevGroupCache.map((groupItem) =>
          groupItem.group === groupUpdatingMutationProps.originalGroupName
            ? groupUpdatingMutationProps.updatedGroupItem
            : groupItem,
        );
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
}
