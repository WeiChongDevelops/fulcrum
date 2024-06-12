import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmail } from "@/utility/util.ts";
import { handleResetAccountDataDirect, handleWipeDataDirect } from "@/api/wipe-api.ts";

export default function useResetAccountData() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await handleWipeDataDirect();
      await handleResetAccountDataDirect();
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      toast.dismiss();
      toast.loading("Restoring defaults...");
    },
    onSuccess: () => {
      toast.dismiss();
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
      await queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
}
