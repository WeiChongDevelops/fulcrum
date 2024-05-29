import { useEmail } from "../../../../utility/util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import { Dispatch, SetStateAction } from "react";
import {
  CategoryToIconAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
  BudgetItemEntity,
} from "../../../../utility/types.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseListProps {
  dayExpenseArray: ExpenseItemEntity[];

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  categoryToIconAndColourMap: CategoryToIconAndColourMap;
  userPreferences: UserPreferences;
}

/**
 * Displays the expenses for a particular day.
 */
export default function ExpenseList({
  dayExpenseArray,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryToIconAndColourMap,
  userPreferences,
}: ExpenseListProps) {
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  return (
    <div>
      <div>
        {dayExpenseArray.map((expenseElement, key) => {
          const groupName = budgetArray.find((budgetItem) => budgetItem.category === expenseElement.category)!.group;
          return (
            expenseElement && (
              <ExpenseItem
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
                userPreferences={userPreferences}
                key={key}
              />
            )
          );
        })}
      </div>
    </div>
  );
}
