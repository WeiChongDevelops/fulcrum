import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PublicUserData,
} from "../../../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import { Dispatch, SetStateAction } from "react";

interface ExpenseListProps {
  dayExpenseArray: ExpenseItemEntity[];

  setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
  setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseIdToDelete: Dispatch<SetStateAction<string>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;

  publicUserData: PublicUserData;
}

/**
 * Displays the expenses for a particular day.
 */
export default function ExpenseList({
  dayExpenseArray,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseIdToDelete,
  categoryDataMap,
  publicUserData,
}: ExpenseListProps) {
  return (
    <div>
      <div>
        {dayExpenseArray.map((expenseElement, key) => {
          return (
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
              setExpenseIdToDelete={setExpenseIdToDelete}
              publicUserData={publicUserData}
              key={key}
            />
          );
        })}
      </div>
    </div>
  );
}
