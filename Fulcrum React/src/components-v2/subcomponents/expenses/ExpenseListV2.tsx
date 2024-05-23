import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types";
import { Dispatch, SetStateAction } from "react";
import ExpenseItem from "@/components/child/expenses/main-data-hierarchy/ExpenseItem.tsx";
import ExpenseItemV2 from "@/components-v2/subcomponents/expenses/ExpenseItemV2.tsx";

interface ExpenseListV2Props {
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
export default function ExpenseListV2({
  dayExpenseArray,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryDataMap,
  publicUserData,
}: ExpenseListV2Props) {
  return (
    <>
      {dayExpenseArray.map((expenseElement, key) => {
        return (
          expenseElement && (
            <ExpenseItemV2
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
    </>
  );
}
