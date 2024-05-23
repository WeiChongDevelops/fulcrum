import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupItemEntity } from "@/utility/types.ts";
import { handleGroupReorder } from "@/utility/api.ts";
import { useContext } from "react";
import { EmailContext } from "@/utility/util.ts";

export default function useReorderGroups() {
  const email = useContext(EmailContext);
  const query = useQueryClient();

  return useMutation({
    mutationFn: (reorderedGroupArray: GroupItemEntity[]) => {
      return handleGroupReorder(reorderedGroupArray);
    },
    onMutate: (reorderedGroupArray: GroupItemEntity[]) => {
      query.cancelQueries({ queryKey: ["groupArray", email] });
      query.setQueryData(["groupArray", email], reorderedGroupArray);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });
}