import { Dispatch, SetStateAction, useState } from "react";
import { getMonthsFromToday, expenseStartDate } from "../../../../utility/util.ts";
import { ExpenseMonthGroup } from "./ExpenseMonthGroup.tsx";
import {
  CategoryToIconAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface ExpenseMonthCarouselProps {
  structuredExpenseData: MonthExpenseGroupEntity[];
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryToIconAndColourMap: CategoryToIconAndColourMap;
  userPreferences: UserPreferences;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
}

/**
 * Renders the horizontally traversable carousel of expenses, grouped by month.
 */
export default function ExpenseMonthCarousel({
  structuredExpenseData,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryToIconAndColourMap,
  userPreferences,
  setDefaultCalendarDate,
}: ExpenseMonthCarouselProps) {
  const y2KMonth = expenseStartDate.getMonth();
  const y2KYear = expenseStartDate.getFullYear();
  const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);
  const [monthPanelShowingIndex, setMonthPanelShowingIndex] = useState(0);

  return (
    <div className={"relative"}>
      <div
        className={"expense-carousel overflow-x-auto absolute left-[-50vw]"}
        style={{
          transform: `translateX(calc(-100vw * (${monthsFromY2KToNow} + ${monthPanelShowingIndex})))`,
        }}
      >
        <div className={"flex flex-row"}>
          {structuredExpenseData.map((monthExpenseGroupItem, key) => {
            return (
              <div className={"flex flex-col items-center w-screen h-[calc(100vh-135px)]"} key={key}>
                <ExpenseMonthGroup
                  monthExpenseGroupItem={monthExpenseGroupItem}
                  setExpenseFormVisibility={setExpenseFormVisibility}
                  setExpenseModalVisibility={setExpenseModalVisibility}
                  setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                  setExpenseItemToDelete={setExpenseItemToDelete}
                  categoryToIconAndColourMap={categoryToIconAndColourMap}
                  userPreferences={userPreferences}
                  monthsFromY2KToNow={monthsFromY2KToNow}
                  monthPanelShowingIndex={monthPanelShowingIndex}
                  setMonthPanelShowingIndex={setMonthPanelShowingIndex}
                  setDefaultCalendarDate={setDefaultCalendarDate}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
