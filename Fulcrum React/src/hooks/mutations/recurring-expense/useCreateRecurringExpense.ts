import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DEFAULT_CATEGORY_ICON, DEFAULT_GROUP_COLOUR, useEmail } from "../../../utility/util.ts";
import { toast } from "sonner";
import { BudgetItemEntity, CategoryToIconAndColourMap, RecurringExpenseItemEntity } from "../../../utility/types.ts";
import { handleRecurringExpenseCreationDirect } from "@/api/recurring-api.ts";

interface RecurringExpenseCreationMutationProps {
  newRecurringExpenseItem: RecurringExpenseItemEntity;
  newBudgetItem?: BudgetItemEntity;
}

export default function useCreateRecurringExpense() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      await handleRecurringExpenseCreationDirect(recurringExpenseCreationMutationProps.newRecurringExpenseItem);
    },
    onMutate: async (recurringExpenseCreationMutationProps: RecurringExpenseCreationMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      await queryClient.cancelQueries({ queryKey: ["categoryToIconAndColourMap", email] });
      await queryClient.cancelQueries({ queryKey: ["recurringExpenseArray", email] });
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });

      const budgetArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      if (recurringExpenseCreationMutationProps.newBudgetItem) {
        await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
          return [...prevBudgetCache, { ...recurringExpenseCreationMutationProps.newBudgetItem }];
        });
      }

      const categoryToIconAndColourMapBeforeOptimisticUpdate = await queryClient.getQueryData([
        "categoryToIconAndColourMap",
        email,
      ]);
      if (recurringExpenseCreationMutationProps.newBudgetItem) {
        const newBudgetItem = recurringExpenseCreationMutationProps.newBudgetItem;
        await queryClient.setQueryData(
          ["categoryToIconAndColourMap", email],
          (prevCategoryMap: CategoryToIconAndColourMap) => {
            return new Map([
              ...prevCategoryMap,
              [
                newBudgetItem.category,
                {
                  iconPath: DEFAULT_CATEGORY_ICON,
                  colour: DEFAULT_GROUP_COLOUR,
                },
              ],
            ]);
          },
        );
      }

      const recurringExpenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["recurringExpenseArray", email]);
      await queryClient.setQueryData(
        ["recurringExpenseArray", email],
        (prevRecurringExpenseCache: RecurringExpenseItemEntity[]) => {
          return [recurringExpenseCreationMutationProps.newRecurringExpenseItem, ...prevRecurringExpenseCache];
        },
      );
      toast.success("Recurring expense created!");
      return {
        budgetArrayBeforeOptimisticUpdate,
        recurringExpenseArrayBeforeOptimisticUpdate,
        categoryToIconAndColourMapBeforeOptimisticUpdate,
      };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["budgetArray", email], context?.budgetArrayBeforeOptimisticUpdate);
      await queryClient.setQueryData(
        ["categoryToIconAndColourMap", email],
        context?.categoryToIconAndColourMapBeforeOptimisticUpdate,
      );
      queryClient.setQueryData(["recurringExpenseArray", email], context?.recurringExpenseArrayBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      await queryClient.invalidateQueries({ queryKey: ["categoryToIconAndColourMap", email] });
      // Invalidation of recurringExpenseArray excluded as it causes visual update bugs for optimistic updates
      // Specifically, updateRecurringExpenseInstances is recalled while the first instance is still running.
    },
  });
}
