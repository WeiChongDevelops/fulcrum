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
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { ExpenseMonthGroupV2 } from "./ExpenseMonthGroupV2.tsx";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel.tsx";
import { EmblaCarouselType } from "embla-carousel";

interface ExpenseMonthCarouselV2Props {
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
}

/**
 * Renders the horizontally traversable carousel of expenses, grouped by month.
 */
export default function ExpenseMonthCarouselV2({
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
}: ExpenseMonthCarouselV2Props) {
  return (
    <Carousel
      id={"expense-carousel"}
      setApi={setApi}
      className={"flex flex-row justify-center w-full h-full z-10 mt-[6vw] transition-all duration-100 ease-out"}
      opts={{ startIndex: startingIndex }}
    >
      <CarouselContent>
        {structuredExpenseData.map((monthExpenseGroupItem, key) => {
          return (
            <CarouselItem key={key}>
              <div className={"flex flex-row justify-center"}>
                <ExpenseMonthGroupV2
                  monthExpenseGroupItem={monthExpenseGroupItem}
                  setExpenseFormVisibility={setExpenseFormVisibility}
                  setExpenseModalVisibility={setExpenseModalVisibility}
                  setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                  setExpenseItemToDelete={setExpenseItemToDelete}
                  categoryDataMap={categoryDataMap}
                  publicUserData={publicUserData}
                  setDefaultCalendarDate={setDefaultCalendarDate}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
