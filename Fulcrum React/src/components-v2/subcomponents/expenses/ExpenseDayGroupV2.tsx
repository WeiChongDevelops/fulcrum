import {
  CategoryToIconAndColourMap,
  DayExpenseGroupEntity,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { formatDate, formatDollarAmountStatic, useEmail } from "@/utility/util.ts";
import ExpenseListV2 from "@/components-v2/subcomponents/expenses/ExpenseListV2.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseDayGroupV2Props {
  dayExpenseGroup: DayExpenseGroupEntity;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  categoryOptions: DropdownSelectorOption[];
}

/**
 * Displays a day-labelled group of expenses for a single calendar day.
 */
export default function ExpenseDayGroupV2({
  dayExpenseGroup,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  oldExpenseBeingEdited,
  categoryOptions,
}: ExpenseDayGroupV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

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
    <div className="my-4 w-[95%]">
      <div
        className={`flex flex-row justify-between items-center relative ${userPreferences.darkModeEnabled ? "text-white" : "text-black"}`}
      >
        {/*<div*/}
        {/*  className={`grid grid-cols-3 outline`}*/}
        {/*  style={{*/}
        {/*    gridTemplateColumns: "1fr 1fr 1fr",*/}
        {/*  }}*/}
        {/*>*/}
        <p className="text-2xl text-left">
          {expenseDayGroupCalendarDate === dateStringToday
            ? "Today"
            : expenseDayGroupCalendarDate === dateString
              ? "Yesterday"
              : formatDate(dayExpenseGroup.calendarDate)}
        </p>
        {/*<div className={`dotted-line ${userPreferences.darkModeEnabled && "dotted-line-dark"}`}></div>*/}
        <div className={"flex-grow h-[1px] bg-[#17423f] dark:bg-muted-foreground bg-opacity-20 mx-4"}></div>
        <p className="text-2xl text-right">{formatDollarAmountStatic(dayTotal, userPreferences.currency)}</p>
      </div>
      {dayExpenseGroup.dayExpenseArray.length > 0 && (
        <ExpenseListV2
          dayExpenseArray={dayExpenseGroup.dayExpenseArray}
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseModalVisibility={setExpenseModalVisibility}
          setOldExpenseBeingEdited={setOldExpenseBeingEdited}
          setExpenseItemToDelete={setExpenseItemToDelete}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          categoryOptions={categoryOptions}
        />
      )}
    </div>
  );
}
