import { getMonthsFromToday, Y2K } from "../../../utility/util.ts";
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
} from "../../../utility/types.ts";
import { Dispatch, SetStateAction, useState } from "react";
import { ExpenseMonthGroupV2 } from "./ExpenseMonthGroupV2.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { ExpenseMonthGroup } from "@/components/child/expenses/main-data-hierarchy/ExpenseMonthGroup.tsx";
import { Button } from "@/components/ui/button.tsx";
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
      className={"flex flex-row justify-center w-full h-full transition-all duration-150 ease-out"}
      opts={{ startIndex: startingIndex }}
    >
      <CarouselContent>
        {/*{Array.from({ length: 5 }).map((_, index) => (*/}
        {/*  <CarouselItem key={index}>*/}
        {/*    <div className="p-1">*/}
        {/*      <h1>Here: {index}</h1>*/}
        {/*      /!*<Card>*!/*/}
        {/*      /!*  <CardContent className="flex aspect-square items-center justify-center p-6">*!/*/}
        {/*      /!*    <span className="text-4xl font-semibold">{index + 1}</span>*!/*/}
        {/*      /!*  </CardContent>*!/*/}
        {/*      /!*</Card>*!/*/}
        {/*    </div>*/}
        {/*  </CarouselItem>*/}
        {/*))}*/}
        {structuredExpenseData.map((monthExpenseGroupItem, key) => {
          return (
            <CarouselItem key={key} className={"w-full"}>
              {/*<div className={"flex flex-col items-center w-screen h-[calc(100vh-135px)]"}>*/}
              <div className={"flex flex-row justify-center w-full"}>
                <ExpenseMonthGroupV2
                  monthExpenseGroupItem={monthExpenseGroupItem}
                  setExpenseFormVisibility={setExpenseFormVisibility}
                  setExpenseModalVisibility={setExpenseModalVisibility}
                  setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                  setExpenseItemToDelete={setExpenseItemToDelete}
                  categoryDataMap={categoryDataMap}
                  publicUserData={publicUserData}
                  // monthsFromY2KToNow={monthsFromY2KToNow}
                  // monthPanelShowingIndex={monthPanelShowingIndex}
                  // setMonthPanelShowingIndex={setMonthPanelShowingIndex}
                  setDefaultCalendarDate={setDefaultCalendarDate}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {/*<CarouselPrevious />*/}
      {/*<CarouselNext />*/}
    </Carousel>
    // <div className={"relative"}>
    //   <div
    //     className={"expense-carousel overflow-x-auto absolute left-[-50vw]"}
    //     style={{
    //       transform: `translateX(calc(-100vw * (${monthsFromY2KToNow} + ${monthPanelShowingIndex})))`,
    //     }}
    //   >
    //     <div className={"flex flex-row"}>
    //       {structuredExpenseData.map((monthExpenseGroupItem, key) => {
    //         return (
    //           <div className={"flex flex-col items-center w-screen h-[calc(100vh-135px)]"} key={key}>
    //             <ExpenseMonthGroupV2
    //               monthExpenseGroupItem={monthExpenseGroupItem}
    //               setExpenseFormVisibility={setExpenseFormVisibility}
    //               setExpenseModalVisibility={setExpenseModalVisibility}
    //               setOldExpenseBeingEdited={setOldExpenseBeingEdited}
    //               setExpenseItemToDelete={setExpenseItemToDelete}
    //               categoryDataMap={categoryDataMap}
    //               publicUserData={publicUserData}
    //               monthsFromY2KToNow={monthsFromY2KToNow}
    //               monthPanelShowingIndex={monthPanelShowingIndex}
    //               setMonthPanelShowingIndex={setMonthPanelShowingIndex}
    //               setDefaultCalendarDate={setDefaultCalendarDate}
    //             />
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>
    // </div>
  );
}
