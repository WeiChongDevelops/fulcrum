import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEmail } from "@/utility/util.ts";
import { handleWipeExpensesDirect } from "@/api/wipe-api.ts";

export default function useWipeExpenses() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeExpensesDirect,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      toast.dismiss();
      toast.loading("Wiping expenses...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Expenses wiped.");
    },
    onError: () => {
      toast.error("Oops! We couldn’t wipe your expenses due to a network issue. Please try again later.", {
        duration: 7_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
      queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
      queryClient.invalidateQueries({ queryKey: ["blacklistedExpenseArray", email] });
    },
  });
}
