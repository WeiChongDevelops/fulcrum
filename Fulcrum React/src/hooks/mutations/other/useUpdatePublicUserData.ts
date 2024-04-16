import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailContext } from "../../../utility/util.ts";
import { PublicUserData } from "../../../utility/types.ts";
import { handlePublicUserDataUpdating } from "../../../utility/api.ts";

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
      toast.success("User preferences updated.");
      return { publicUserDataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["publicUserData", email], context?.publicUserDataBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicUserData", email] });
    },
  });
}
