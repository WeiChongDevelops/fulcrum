import { useContext } from "react";
import { EmailContext, handleWipeExpenses } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useWipeExpenses() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeExpenses,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
      queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
      queryClient.invalidateQueries({ queryKey: ["blacklistedExpenseArray", email] });
    },
  });
}
