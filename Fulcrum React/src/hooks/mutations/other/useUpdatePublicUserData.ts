import { useContext } from "react";
import { EmailContext, handlePublicUserDataUpdating, PublicUserData } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdatePublicUserData() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["publicUserData", email],
    mutationFn: (updatedPublicUserData: PublicUserData) => handlePublicUserDataUpdating(updatedPublicUserData),
    onMutate: async (updatedPublicUserData: PublicUserData) => {
      await queryClient.cancelQueries({ queryKey: ["publicUserData", email] });
      const publicUserDataBeforeOptimisticUpdate = queryClient.getQueryData(["publicUserData", email]);
      await queryClient.setQueryData(["publicUserData", email], updatedPublicUserData);
      return { publicUserDataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["publicUserData", email], context?.publicUserDataBeforeOptimisticUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicUserData", email] });
    },
  });
}
