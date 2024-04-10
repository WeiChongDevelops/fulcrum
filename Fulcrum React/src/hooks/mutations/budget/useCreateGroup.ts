import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, GroupItemEntity, groupSort, handleGroupCreation } from "../../../util.ts";

export default function useCreateGroup() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (newGroupItem: GroupItemEntity) => handleGroupCreation(newGroupItem),
    onMutate: async (newGroupItem: GroupItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return [...prevGroupCache, newGroupItem].sort(groupSort);
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
