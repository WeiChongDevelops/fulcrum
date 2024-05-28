import { monthStringArray } from "../../../../utility/util.ts";
import { Dispatch, memo, SetStateAction } from "react";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";
import AddNewExpenseButton from "../buttons/AddNewExpenseButton.tsx";
import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface ExpenseMonthGroupProps {
  monthExpenseGroupItem: MonthExpenseGroupEntity;
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  publicUserData: PublicUserData;
  monthsFromY2KToNow: number;
  monthPanelShowingIndex: number;
  setMonthPanelShowingIndex: Dispatch<SetStateAction<number>>;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
}

/**
 * Renders the expense logs for a given month.
 */
export const ExpenseMonthGroup = memo(
  ({
    monthExpenseGroupItem,
    setExpenseFormVisibility,
    setExpenseModalVisibility,
    setOldExpenseBeingEdited,
    setExpenseItemToDelete,
    categoryDataMap,
    publicUserData,
    monthsFromY2KToNow,
    monthPanelShowingIndex,
    setMonthPanelShowingIndex,
    setDefaultCalendarDate,
  }: ExpenseMonthGroupProps) => {
    function scrollLeft() {
      setMonthPanelShowingIndex((prevIndex) => prevIndex - 1);
    }

    function scrollRight() {
      setMonthPanelShowingIndex((prevIndex) => prevIndex + 1);
    }

    const currentMonth = monthStringArray[new Date().getMonth()];

    return (
      <div className={"flex flex-col items-center"}>
        <div className={"flex flex-row justify-center items-center relative w-full"}>
          <div
            className={
              "flex flex-row justify-between items-center w-[40vw] sm:w-[35vw] md:w-[32vw] lg:w-[30vw] py-2 my-4 bg-[#17423f] rounded-3xl text-white select-none"
            }
          >
            <button
              onClick={scrollLeft}
              className={`month-navigation-option navigate-left ${monthPanelShowingIndex === -monthsFromY2KToNow && "opacity-0 pointer-events-none"}`}
            >
              <img src="/static/assets-v2/UI-icons/left-navigation-arrow.svg" alt="Left navigation arrow" />
            </button>
            <p className={"text-3xl"}>
              {monthStringArray[monthExpenseGroupItem.monthIndex] + " " + monthExpenseGroupItem.year.toString()}
            </p>
            <button
              onClick={scrollRight}
              className={`month-navigation-option navigate-right ${monthPanelShowingIndex === 12 && "opacity-0 pointer-events-none"}`}
            >
              <img src="/static/assets-v2/UI-icons/right-navigation-arrow.svg" alt="Right navigation arrow" />
            </button>
          </div>
          <button
            onClick={() => setMonthPanelShowingIndex(0)}
            className={`flex gap-2 flex-row justify-center items-center fulcrum-button absolute bg-[#3f4240] text-white font-bold rounded-2xl mx-2 py-[0.5em] px-[1em] text-center hover:opacity-90 ${monthPanelShowingIndex > 0 ? "left-0" : monthPanelShowingIndex < 0 ? "right-0" : "hidden"}`}
          >
            <img
              src="/static/assets-v2/UI-icons/left-navigation-arrow.svg"
              alt="Left navigation arrow"
              className={`h-4 w-3 left-nav-arrow opacity-0 ${monthPanelShowingIndex > 0 && "opacity-100"}`}
            />
            <span>Back to {currentMonth}</span>
            <img
              src="/static/assets-v2/UI-icons/right-navigation-arrow.svg"
              alt="Right navigation arrow"
              className={`h-4 w-3 right-nav-arrow opacity-0 ${monthPanelShowingIndex < 0 && "opacity-100"}`}
            />
          </button>
        </div>

        <AddNewExpenseButton
          setExpenseFormVisibility={setExpenseFormVisibility}
          isDarkMode={publicUserData.darkModeEnabled}
          setDefaultCalendarDate={setDefaultCalendarDate}
          monthExpenseGroupItem={monthExpenseGroupItem}
        />

        {monthExpenseGroupItem.monthExpenseArray.length > 0 ? (
          monthExpenseGroupItem.monthExpenseArray.map((dayExpenseGroup, key) => {
            return (
              <ExpenseDayGroup
                dayExpenseGroup={dayExpenseGroup}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseItemToDelete={setExpenseItemToDelete}
                categoryDataMap={categoryDataMap}
                publicUserData={publicUserData}
                key={key}
              />
            );
          })
        ) : (
          <p className={`text-xs mt-48 select-none ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
            No expenses added this month.
          </p>
        )}
      </div>
    );
  },
);
