import { useContext } from "react";
import { EmailContext, handleWipeExpenses } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useWipeExpenses() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeExpenses,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
    },
    onSuccess: () => {
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
