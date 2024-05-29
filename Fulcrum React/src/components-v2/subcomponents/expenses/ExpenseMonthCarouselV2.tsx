import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { ExpenseMonthGroupV2 } from "./ExpenseMonthGroupV2.tsx";
import { Carousel, CarouselContent, CarouselItem } from "@/components-v2/ui/carousel.tsx";
import { EmblaCarouselType } from "embla-carousel";
import { ScrollArea } from "@/components-v2/ui/scroll-area";
import { ScrollAreaDemo } from "@/components-v2/subcomponents/budget/Playground.tsx";
import { capitaliseFirstLetter } from "@/utility/util.ts";

interface ExpenseMonthCarouselV2Props {
  budgetArray: BudgetItemEntity[];
  structuredExpenseData: MonthExpenseGroupEntity[];
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  userPreferences: UserPreferences;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
  setApi: (api: EmblaCarouselType | undefined) => void;
  startingIndex: number;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * Renders the horizontally traversable carousel of expenses, grouped by month.
 */
export default function ExpenseMonthCarouselV2({
  budgetArray,
  structuredExpenseData,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  categoryDataMap,
  userPreferences,
  setDefaultCalendarDate,
  setApi,
  startingIndex,
  oldExpenseBeingEdited,
  perCategoryExpenseTotalThisMonth,
}: ExpenseMonthCarouselV2Props) {
  return (
    <Carousel
      id={"expense-carousel"}
      setApi={setApi}
      className={"flex flex-row justify-center w-full z-10 mt-[6vh] transition-all duration-100 ease-out"}
      opts={{ startIndex: startingIndex, watchDrag: false }}
    >
      <CarouselContent className={"-ml-24"}>
        {budgetArray.length > 0 &&
          structuredExpenseData.length > 0 &&
          structuredExpenseData.map((monthExpenseGroupItem, key) => {
            return (
              <CarouselItem key={key} className={"pl-24"}>
                <ScrollArea className={"flex flex-row justify-center h-[94vh]"}>
                  <ExpenseMonthGroupV2
                    budgetArray={budgetArray}
                    perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                    monthExpenseGroupItem={monthExpenseGroupItem}
                    setExpenseFormVisibility={setExpenseFormVisibility}
                    setExpenseModalVisibility={setExpenseModalVisibility}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                    setExpenseItemToDelete={setExpenseItemToDelete}
                    categoryDataMap={categoryDataMap}
                    userPreferences={userPreferences}
                    setDefaultCalendarDate={setDefaultCalendarDate}
                    oldExpenseBeingEdited={oldExpenseBeingEdited}
                  />
                </ScrollArea>
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
}
