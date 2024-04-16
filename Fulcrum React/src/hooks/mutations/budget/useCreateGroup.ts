import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";
import { EmailContext, groupSort } from "../../../utility/util.ts";
import { GroupItemEntity } from "../../../utility/types.ts";
import { handleGroupCreation } from "../../../utility/api.ts";

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
      toast.success("Budget group added.");
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
      toast.error("New budget group is invalid. The new group name may be already in use.", {
        duration: 7_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
}
