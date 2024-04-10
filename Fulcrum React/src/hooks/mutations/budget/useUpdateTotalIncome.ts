import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, handleTotalIncomeUpdating } from "../../../util.ts";
import { useContext } from "react";

export default function useUpdateTotalIncome() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (newTotalIncomeData: number) => handleTotalIncomeUpdating(newTotalIncomeData),
    onMutate: async (newTotalIncomeData: number) => {
      await queryClient.cancelQueries({ queryKey: ["totalIncome", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["totalIncome", email]);
      await queryClient.setQueryData(["totalIncome", email], newTotalIncomeData);
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["totalIncome", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["totalIncome", email] });
    },
  });
}
