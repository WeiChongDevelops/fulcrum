import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, handleTotalIncomeUpdating } from "../util.ts";
import { useContext } from "react";

export default function useUpdateTotalIncome(newTotalIncomeData: number) {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  const { isPending, isError } = useMutation({
    mutationFn: () => handleTotalIncomeUpdating(newTotalIncomeData),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["totalIncome", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["totalIncome", email]);
      await queryClient.setQueryData(["totalIncome", email], () => newTotalIncomeData);
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["totalIncome", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["totalIncome", email] });
    },
  });

  return {
    isPending,
    isError,
  };
}
