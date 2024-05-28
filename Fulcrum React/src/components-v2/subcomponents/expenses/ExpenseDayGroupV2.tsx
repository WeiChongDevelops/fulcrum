import {
  CategoryToIconGroupAndColourMap,
  DayExpenseGroupEntity,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { formatDate, formatDollarAmountStatic } from "@/utility/util.ts";
import ExpenseListV2 from "@/components-v2/subcomponents/expenses/ExpenseListV2.tsx";
import { Separator } from "@/components-v2/ui/separator.tsx";

interface ExpenseDayGroupV2Props {
  dayExpenseGroup: DayExpenseGroupEntity;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
  publicUserData: PublicUserData;
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
  categoryDataMap,
  publicUserData,
  oldExpenseBeingEdited,
  categoryOptions,
}: ExpenseDayGroupV2Props) {
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
        className={`flex flex-row justify-between items-center relative ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}
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
        {/*<div className={`dotted-line ${publicUserData.darkModeEnabled && "dotted-line-dark"}`}></div>*/}
        <div className={"flex-grow h-[1px] bg-[#17423f] bg-opacity-20 mx-4"}></div>
        <p className="text-2xl text-right">{formatDollarAmountStatic(dayTotal, publicUserData.currency)}</p>
      </div>
      {dayExpenseGroup.dayExpenseArray.length > 0 && (
        <ExpenseListV2
          dayExpenseArray={dayExpenseGroup.dayExpenseArray}
          setExpenseFormVisibility={setExpenseFormVisibility}
          setExpenseModalVisibility={setExpenseModalVisibility}
          setOldExpenseBeingEdited={setOldExpenseBeingEdited}
          setExpenseItemToDelete={setExpenseItemToDelete}
          categoryDataMap={categoryDataMap}
          publicUserData={publicUserData}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          categoryOptions={categoryOptions}
        />
      )}
    </div>
  );
}
