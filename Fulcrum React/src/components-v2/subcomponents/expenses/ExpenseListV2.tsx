import {
  CategoryToIconAndColourMap,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
  BudgetItemEntity,
} from "@/utility/types";
import { Dispatch, SetStateAction } from "react";
import ExpenseItemV2 from "@/components-v2/subcomponents/expenses/ExpenseItemV2.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { useEmail } from "@/utility/util.ts";

interface ExpenseListV2Props {
  dayExpenseArray: ExpenseItemEntity[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  categoryOptions: DropdownSelectorOption[];
}

/**
 * Displays the expenses for a particular day.
 */
export default function ExpenseListV2({
  dayExpenseArray,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryOptions,
  oldExpenseBeingEdited,
}: ExpenseListV2Props) {
  const categoryToIconAndColourMap: CategoryToIconAndColourMap = useQueryClient().getQueryData([
    "categoryToIconAndColourMap",
    useEmail(),
  ])!;
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  return (
    <>
      {dayExpenseArray.map((expenseElement, key) => {
        const groupName = budgetArray.find((budgetItem) => budgetItem.category === expenseElement.category)!.group;
        return (
          expenseElement && (
            <ExpenseItemV2
              oldExpenseBeingEdited={oldExpenseBeingEdited}
              expenseId={expenseElement.expenseId}
              category={expenseElement.category}
              amount={expenseElement.amount}
              iconPath={categoryToIconAndColourMap.get(expenseElement.category)!.iconPath}
              groupName={groupName}
              groupColour={categoryToIconAndColourMap.get(expenseElement.category)!.colour}
              recurringExpenseId={expenseElement.recurringExpenseId}
              timestamp={expenseElement.timestamp}
              setExpenseFormVisibility={setExpenseFormVisibility}
              setExpenseModalVisibility={setExpenseModalVisibility}
              setOldExpenseBeingEdited={setOldExpenseBeingEdited}
              setExpenseItemToDelete={setExpenseItemToDelete}
              categoryOptions={categoryOptions}
              key={key}
            />
          )
        );
      })}
    </>
  );
}
