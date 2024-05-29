import {} from "../../../../utility/util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import { Dispatch, SetStateAction } from "react";
import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface ExpenseListProps {
  dayExpenseArray: ExpenseItemEntity[];

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
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
  categoryDataMap,
  userPreferences,
}: ExpenseListProps) {
  return (
    <div>
      <div>
        {dayExpenseArray.map((expenseElement, key) => {
          return (
            expenseElement && (
              <ExpenseItem
                expenseId={expenseElement.expenseId}
                category={expenseElement.category}
                amount={expenseElement.amount}
                iconPath={categoryDataMap.get(expenseElement.category)!.iconPath}
                groupName={categoryDataMap.get(expenseElement.category)!.group}
                groupColour={categoryDataMap.get(expenseElement.category)!.colour}
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
