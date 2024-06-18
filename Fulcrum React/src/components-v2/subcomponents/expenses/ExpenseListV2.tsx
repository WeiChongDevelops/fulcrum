import {
  CategoryToIconAndColourMap,
  DropdownSelectorOption,
  ExpenseItemEntity,
  PreviousExpenseBeingEdited,
  BudgetItemEntity,
} from "@/utility/types";
import { Dispatch, SetStateAction } from "react";
import ExpenseItemV2 from "@/components-v2/subcomponents/expenses/ExpenseItemV2.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useEmail } from "@/utility/util.ts";

interface ExpenseListV2Props {
  dayExpenseArray: ExpenseItemEntity[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  categoryOptions: DropdownSelectorOption[];
}

/**
 * Displays the expenses for a particular day.
 */
export default function ExpenseListV2({
  dayExpenseArray,
  oldExpenseBeingEdited,
  setOldExpenseBeingEdited,
  categoryOptions,
}: ExpenseListV2Props) {
  const categoryToIconAndColourMap: CategoryToIconAndColourMap = useQueryClient().getQueryData([
    "categoryToIconAndColourMap",
    useEmail(),
  ])!;
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  return (
    <>
      {!!dayExpenseArray &&
        dayExpenseArray.length > 0 &&
        dayExpenseArray.map((expenseElement, key) => {
          const groupName = budgetArray.find((budgetItem) => budgetItem.category === expenseElement.category)!.group;
          return (
            expenseElement && (
              <ExpenseItemV2
                expenseId={expenseElement.expenseId}
                category={expenseElement.category}
                amount={expenseElement.amount}
                iconPath={categoryToIconAndColourMap.get(expenseElement.category)!.iconPath}
                groupName={groupName}
                groupColour={categoryToIconAndColourMap.get(expenseElement.category)!.colour}
                recurringExpenseId={expenseElement.recurringExpenseId}
                timestamp={expenseElement.timestamp}
                oldExpenseBeingEdited={oldExpenseBeingEdited}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                categoryOptions={categoryOptions}
                key={key}
              />
            )
          );
        })}
    </>
  );
}
