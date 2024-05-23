import { DEFAULT_CATEGORY_ICON, DEFAULT_GROUP_COLOUR, EmailContext, useEmail } from "../../../utility/util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";
import { BudgetItemEntity, CategoryToIconGroupAndColourMap, ExpenseItemEntity } from "../../../utility/types.ts";
import { handleExpenseCreation } from "../../../utility/api.ts";

export interface ExpenseCreationMutationProps {
  newExpenseItem: ExpenseItemEntity;
  newBudgetItem?: BudgetItemEntity;
}

export default function useCreateExpense() {
  const queryClient = useQueryClient();
  const email = useEmail();

  return useMutation({
    mutationFn: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      await handleExpenseCreation(expenseCreationMutationProps.newExpenseItem);
    },
    onMutate: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      toast.success("Expense added.");
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);

      if (expenseCreationMutationProps.newBudgetItem) {
        await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
          return [...prevBudgetCache, { ...expenseCreationMutationProps.newBudgetItem }];
        });
      }

      const categoryDataMapBeforeOptimisticUpdate = await queryClient.getQueryData(["groupAndColourMap", email]);
      if (expenseCreationMutationProps.newBudgetItem) {
        const newBudgetItem = expenseCreationMutationProps.newBudgetItem;
        await queryClient.setQueryData(["groupAndColourMap", email], (prevCategoryMap: CategoryToIconGroupAndColourMap) => {
          return new Map([
            ...prevCategoryMap,
            [
              newBudgetItem.category,
              {
                iconPath: DEFAULT_CATEGORY_ICON,
                group: newBudgetItem.group,
                colour: DEFAULT_GROUP_COLOUR,
              },
            ],
          ]);
        });
      }

      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        const newExpenseTimestamp = new Date(expenseCreationMutationProps.newExpenseItem.timestamp);
        return newExpenseTimestamp.toLocaleDateString() === new Date().toLocaleDateString()
          ? [expenseCreationMutationProps.newExpenseItem, ...prevExpenseCache]
          : [...prevExpenseCache, expenseCreationMutationProps.newExpenseItem];
      });

      return {
        budgetArrayBeforeOptimisticUpdate,
        expenseArrayBeforeOptimisticUpdate,
        categoryDataMapBeforeOptimisticUpdate,
      };
    },
    onError: (_error, _variables, context) => {
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
      queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      queryClient.setQueryData(["groupAndColourMap", email], context?.categoryDataMapBeforeOptimisticUpdate);
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });
}
