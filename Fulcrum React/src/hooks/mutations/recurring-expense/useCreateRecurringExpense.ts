import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_GROUP_COLOUR,
  EmailContext,
  handleRecurringExpenseCreation,
  RecurringExpenseItemEntity,
} from "../../../util.ts";

export default function useCreateRecurringExpense() {
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);
  interface RecurringExpenseCreationMutationProps {
    newRecurringExpenseItem: RecurringExpenseItemEntity;
    newBudgetItem?: BudgetItemEntity;
  }

  return useMutation({
    mutationFn: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      // recurringExpenseCreationMutationProps.newBudgetItem &&
      //   (await handleBudgetCreation(recurringExpenseCreationMutationProps.newBudgetItem));
      await handleRecurringExpenseCreation(recurringExpenseCreationMutationProps.newRecurringExpenseItem);
    },
    onMutate: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return [...prevBudgetCache, { ...recurringExpenseCreationMutationProps.newBudgetItem }];
      });

      const categoryDataMapBeforeOptimisticUpdate = await queryClient.getQueryData(["groupAndColourMap", email]);
      if (recurringExpenseCreationMutationProps.newBudgetItem) {
        const newBudgetItem = recurringExpenseCreationMutationProps.newBudgetItem;
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

      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return [recurringExpenseCreationMutationProps.newRecurringExpenseItem, ...prevRecurringExpenseCache];
        },
      );

      return {
        budgetArrayBeforeOptimisticUpdate,
        recurringExpenseArrayBeforeOptimisticUpdate,
        categoryDataMapBeforeOptimisticUpdate,
      };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(["groupAndColourMap", email], context?.categoryDataMapBeforeOptimisticUpdate);
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["groupAndColourMap", email] });
      await queryClient.invalidateQueries({ queryKey: ["recurringExpenseArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });
}
