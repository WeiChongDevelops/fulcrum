import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
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
  publicUserData: PublicUserData;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
  setApi: (api: EmblaCarouselType | undefined) => void;
  startingIndex: number;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
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
  publicUserData,
  setDefaultCalendarDate,
  setApi,
  startingIndex,
  oldExpenseBeingEdited,
}: ExpenseMonthCarouselV2Props) {
  return (
    <Carousel
      id={"expense-carousel"}
      setApi={setApi}
      className={"flex flex-row justify-center w-full z-10 mt-[calc(6vh)] transition-all duration-100 ease-out"}
      opts={{ startIndex: startingIndex }}
    >
      <CarouselContent>
        {budgetArray.length > 0 &&
          structuredExpenseData.length > 0 &&
          structuredExpenseData.map((monthExpenseGroupItem, key) => {
            return (
              <CarouselItem key={key}>
                <ScrollArea className={"flex flex-row justify-center h-[94vh]"}>
                  <ExpenseMonthGroupV2
                    budgetArray={budgetArray}
                    monthExpenseGroupItem={monthExpenseGroupItem}
                    setExpenseFormVisibility={setExpenseFormVisibility}
                    setExpenseModalVisibility={setExpenseModalVisibility}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                    setExpenseItemToDelete={setExpenseItemToDelete}
                    categoryDataMap={categoryDataMap}
                    publicUserData={publicUserData}
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
