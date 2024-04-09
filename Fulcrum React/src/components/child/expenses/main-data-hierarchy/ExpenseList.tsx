import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import { Dispatch, SetStateAction } from "react";

interface ExpenseListProps {
  dayExpenseArray: ExpenseItemEntity[];

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

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
  setExpenseItemToDelete,
  categoryDataMap,
  publicUserData,
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
                publicUserData={publicUserData}
                key={key}
              />
            )
          );
        })}
      </div>
    </div>
  );
}
