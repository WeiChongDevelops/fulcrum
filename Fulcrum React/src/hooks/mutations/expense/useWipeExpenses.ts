import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { handleWipeExpenses } from "../../../utility/api.ts";

export default function useWipeExpenses() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeExpenses,
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
