import { formatDate, formatDollarAmountStatic } from "../../../../utility/util.ts";
import { Dispatch, SetStateAction } from "react";
import ExpenseList from "./ExpenseList.tsx";
import "../../../../css/Expense.css";
import {
  CategoryToIconGroupAndColourMap,
  DayExpenseGroupEntity,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface ExpenseDayGroupProps {
  dayExpenseGroup: DayExpenseGroupEntity;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
  userPreferences: UserPreferences;
}

/**
 * Displays a day-labelled group of expenses for a single calendar day.
 */
export default function ExpenseDayGroup({
  dayExpenseGroup,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryDataMap,
  userPreferences,
}: ExpenseDayGroupProps) {
  const expenseDayGroupCalendarDate = new Date(dayExpenseGroup.calendarDate).toLocaleDateString();
  const dateStringToday = new Date().toLocaleDateString();
  let dateObjectYesterday = new Date();
  dateObjectYesterday.setDate(new Date().getDate() - 1);
  const dateString = dateObjectYesterday.toLocaleDateString();
  const dayTotal = dayExpenseGroup.dayExpenseArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0,
  );

  return (
    <div className="my-4">
      <div
        className={`flex flex-row justify-between items-center relative ${userPreferences.darkModeEnabled ? "text-white" : "text-black"}`}
      >
        <p className="text-3xl font-bold">
          {expenseDayGroupCalendarDate === dateStringToday
            ? "Today"
            : expenseDayGroupCalendarDate === dateString
              ? "Yesterday"
              : formatDate(dayExpenseGroup.calendarDate)}
        </p>
        <div className={`dotted-line ${userPreferences.darkModeEnabled && "dotted-line-dark"}`}></div>
        <p className="text-3xl font-bold">{formatDollarAmountStatic(dayTotal, userPreferences.currency)}</p>
      </div>
      {dayExpenseGroup.dayExpenseArray.length > 0 && (
        <ExpenseList
          dayExpenseArray={dayExpenseGroup.dayExpenseArray}
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseModalVisibility={setExpenseModalVisibility}
          setOldExpenseBeingEdited={setOldExpenseBeingEdited}
          setExpenseItemToDelete={setExpenseItemToDelete}
          categoryDataMap={categoryDataMap}
          userPreferences={userPreferences}
        />
      )}
    </div>
  );
}
