import { Button } from "@/components-v2/ui/button.tsx";
import { monthStringArray } from "@/utility/util.ts";
import { useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { MonthExpenseGroupEntity, PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";

interface ExpenseHeaderV2Props {
  carouselAPI: EmblaCarouselType;
  structuredExpenseData: MonthExpenseGroupEntity[] | undefined;
  startingIndex: number;
  publicUserData: PublicUserData;
}

export default function ExpenseHeaderV2({
  carouselAPI,
  structuredExpenseData,
  startingIndex,
  publicUserData,
}: ExpenseHeaderV2Props) {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(startingIndex);
  const [activeMonthAndYear, setActiveMonthAndYear] = useState<{
    month: string;
    year: number;
  }>();
  const prevSlide = () => {
    carouselAPI?.scrollPrev();
    setActiveCarouselIndex(activeCarouselIndex - 1);
  };
  const nextSlide = () => {
    carouselAPI?.scrollNext();
    setActiveCarouselIndex(activeCarouselIndex + 1);
  };
  const returnToThisMonth = () => {
    carouselAPI?.scrollTo(startingIndex);
    setActiveCarouselIndex(startingIndex);
  };

  useEffect(() => {
    if (!!structuredExpenseData) {
      const activeDataEntry = structuredExpenseData[activeCarouselIndex];
      setActiveMonthAndYear({ month: monthStringArray[activeDataEntry.monthIndex], year: activeDataEntry.year });
    }
  }, [structuredExpenseData, activeCarouselIndex]);

  return (
    <div className={"fixed flex flex-row z-20 gap-4 justify-start items-center bg-gray-400 w-[calc(100vw-16rem)] h-[6vh]"}>
      <div
        className={
          "flex flex-row justify-between items-center ml-6 w-[40vw] sm:w-[35vw] md:w-[32vw] lg:w-[30vw] py-1 my-4 bg-[#17423f] rounded-3xl text-white select-none"
        }
      >
        <button
          onClick={prevSlide}
          disabled={activeCarouselIndex < 1}
          className={`month-navigation-option ${activeCarouselIndex >= 1 && "enabled-bounce-left"} disabled:opacity-50`}
        >
          <img src="/static/assets-v2/UI-icons/left-navigation-arrow.svg" alt="Left navigation arrow" />
        </button>
        <p className={"text-xl font-medium"}>
          {!!activeMonthAndYear ? activeMonthAndYear.month + " " + activeMonthAndYear.year.toString() : "Loading..."}
        </p>
        <button
          onClick={nextSlide}
          disabled={activeCarouselIndex === startingIndex + 12}
          className={`month-navigation-option ${activeCarouselIndex !== startingIndex + 12 && "enabled-bounce-right"} disabled:opacity-50`}
        >
          <img src="/static/assets-v2/UI-icons/right-navigation-arrow.svg" alt="Right navigation arrow" />
        </button>
      </div>
      {activeCarouselIndex !== startingIndex && (
        <Button onClick={returnToThisMonth}>
          <span>Back to {monthStringArray[new Date().getMonth()]}</span>
        </Button>
      )}
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Expenses</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
