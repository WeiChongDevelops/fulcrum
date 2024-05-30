import { useContext } from "react";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleWipeBudget } from "../../../utility/api.ts";
import { handleWipeDataDirect } from "@/api/wipe-api.ts";

export default function useWipeData() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeDataDirect,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      toast.dismiss();
      toast.loading("Wiping data...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Data wiped.");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Oops! We couldn’t wipe your data due to a network issue. Please try again later.", {
        duration: 7_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray"] });
      queryClient.invalidateQueries({ queryKey: ["groupArray"] });
    },
  });
}
