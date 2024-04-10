import { useContext } from "react";
import { EmailContext, handleWipeBudget } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useWipeBudget() {
  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: handleWipeBudget,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray"] });
      queryClient.invalidateQueries({ queryKey: ["groupArray"] });
    },
  });
}
