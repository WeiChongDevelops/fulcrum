import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailContext } from "../../../utility/util.ts";
import { handleResetAccountData, handleWipeBudget } from "../../../utility/api.ts";

export default function useResetAccountData() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await handleWipeBudget();
      await handleResetAccountData();
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
    },
    onSuccess: () => {
      toast.success("Account data reset.");
    },
    onError: () => {
      toast.error("Oops! We couldn’t reset budget defaults due to a network issue. Please try again later.", {
        duration: 7_000,
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray"] });
      await queryClient.invalidateQueries({ queryKey: ["groupArray"] });
      await queryClient.invalidateQueries({ queryKey: ["publicUserData"] });
    },
  });
}
