import { BudgetItemEntity, MonthExpenseGroupEntity, PreviousExpenseBeingEdited } from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { ExpenseMonthGroupV2 } from "./ExpenseMonthGroupV2.tsx";
import { Carousel, CarouselContent, CarouselItem } from "@/components-v2/ui/carousel.tsx";
import { EmblaCarouselType } from "embla-carousel";
import { ScrollArea } from "@/components-v2/ui/scroll-area";
import { useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseMonthCarouselV2Props {
  structuredExpenseData: MonthExpenseGroupEntity[];
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setApi: (api: EmblaCarouselType | undefined) => void;
  activeCarouselIndex: number;
  startingIndex: number;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * Renders the horizontally traversable carousel of expenses, grouped by month.
 */
export default function ExpenseMonthCarouselV2({
  structuredExpenseData,
  setOldExpenseBeingEdited,
  setApi,
  startingIndex,
  activeCarouselIndex,
  oldExpenseBeingEdited,
  perCategoryExpenseTotalThisMonth,
}: ExpenseMonthCarouselV2Props) {
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  return (
    <Carousel
      id={"expense-carousel"}
      setApi={setApi}
      className={"flex flex-row justify-center w-full z-10 mt-[6vh] transition-all duration-100 ease-out"}
      opts={{ startIndex: startingIndex, watchDrag: false }}
    >
      <CarouselContent className={"-ml-24"}>
        {!!budgetArray &&
          budgetArray.length > 0 &&
          !!structuredExpenseData &&
          structuredExpenseData.length > 0 &&
          structuredExpenseData.map((monthExpenseGroupItem, key) => {
            return (
              <CarouselItem key={key} className={"pl-24"}>
                <ScrollArea className={"flex flex-row justify-center h-[94vh]"}>
                  <ExpenseMonthGroupV2
                    perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                    monthExpenseGroupItem={monthExpenseGroupItem}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                    oldExpenseBeingEdited={oldExpenseBeingEdited}
                    startingIndex={startingIndex}
                    activeCarouselIndex={activeCarouselIndex}
                  />
                </ScrollArea>
              </CarouselItem>
            );
          })}
      </CarouselContent>
    </Carousel>
  );
}
