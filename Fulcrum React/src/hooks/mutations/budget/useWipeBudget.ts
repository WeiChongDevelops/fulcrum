import { useContext } from "react";
import { EmailContext } from "../../../utility/util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleWipeBudget } from "../../../utility/api.ts";

export default function useWipeBudget() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeBudget,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      toast.dismiss();
      toast.loading("Wiping budget...");
    },
    onSuccess: () => {
      toast.success("Budget wiped.");
    },
    onError: () => {
      toast.error("Oops! We couldn’t wipe your budget due to a network issue. Please try again later.", {
        duration: 7_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray"] });
      queryClient.invalidateQueries({ queryKey: ["groupArray"] });
    },
  });
}
