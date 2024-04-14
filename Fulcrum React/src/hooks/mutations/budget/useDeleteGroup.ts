import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { EmailContext, GroupItemEntity, handleGroupDeletion } from "../../../util.ts";
import { toast } from "sonner";

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
      toast.success("Budget group removed.");
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
      return queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });
}
