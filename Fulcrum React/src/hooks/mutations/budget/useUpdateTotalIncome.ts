import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmailContext, handleTotalIncomeUpdating } from "../../../util.ts";
import { useContext } from "react";
import { toast } from "sonner";

export default function useUpdateTotalIncome() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  return useMutation({
    mutationFn: (newTotalIncomeData: number) => handleTotalIncomeUpdating(newTotalIncomeData),
    onMutate: async (newTotalIncomeData: number) => {
      await queryClient.cancelQueries({ queryKey: ["totalIncome", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["totalIncome", email]);
      await queryClient.setQueryData(["totalIncome", email], newTotalIncomeData);
      toast.success("Income updated.");
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["totalIncome", email], context?.dataBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["totalIncome", email] });
    },
  });
}
