import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_GROUP_COLOUR,
  EmailContext,
  ExpenseItemEntity,
  handleExpenseCreation,
} from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

export default function useCreateExpense() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  interface ExpenseCreationMutationProps {
    newExpenseItem: ExpenseItemEntity;
    newBudgetItem?: BudgetItemEntity;
  }

  return useMutation({
    mutationFn: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      // expenseCreationMutationProps.newBudgetItem && (await handleBudgetCreation(expenseCreationMutationProps.newBudgetItem));
      await handleExpenseCreation(expenseCreationMutationProps.newExpenseItem);
    },
    onMutate: async (expenseCreationMutationProps: ExpenseCreationMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["groupAndColourMap", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, { ...expenseCreationMutationProps.newBudgetItem }];
      });

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
        return [expenseCreationMutationProps.newExpenseItem, ...prevExpenseCache];
      });

      return {
        budgetArrayBeforeOptimisticUpdate,
        expenseArrayBeforeOptimisticUpdate,
        categoryDataMapBeforeOptimisticUpdate,
      };
    },
    onError: (_error, _variables, context) => {
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
