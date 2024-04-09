import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getMonthsFromToday,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
  y2K,
} from "../../../../util.ts";
import { ExpenseMonthGroup } from "./ExpenseMonthGroup.tsx";

interface ExpenseMonthCarouselProps {
  structuredExpenseData: MonthExpenseGroupEntity[];
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  publicUserData: PublicUserData;
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
  categoryDataMap,
  publicUserData,
  setDefaultCalendarDate,
}: ExpenseMonthCarouselProps) {
  const y2KMonth = y2K.getMonth();
  const y2KYear = y2K.getFullYear();

  const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);

  const [monthPanelShowingIndex, setMonthPanelShowingIndex] = useState(0);

  useEffect(() => {
    console.log(`Month panel index: ${monthPanelShowingIndex}`);
  }, [monthPanelShowingIndex]);
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
                  categoryDataMap={categoryDataMap}
                  publicUserData={publicUserData}
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
