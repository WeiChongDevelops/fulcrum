import { Button } from "@/components/ui/button.tsx";
import { monthStringArray } from "@/utility/util.ts";
import { useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { MonthExpenseGroupEntity, PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/child/toggles/DarkModeToggleV2.tsx";

interface ExpenseHeaderV2Props {
  carouselAPI: EmblaCarouselType;
  structuredExpenseData: MonthExpenseGroupEntity[] | undefined;
  startingIndex: number;
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  publicUserData: PublicUserData;
}

export default function ExpenseHeaderV2({
  carouselAPI,
  structuredExpenseData,
  startingIndex,
  navMenuOpen,
  toggleNavMenu,
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
    <div className={"flex flex-row gap-4 justify-start items-center bg-pink-500 w-full h-[6%]"}>
      {!navMenuOpen && <Button onClick={toggleNavMenu}>{">>"}</Button>}
      <div
        className={
          "flex flex-row justify-between items-center ml-6 w-[40vw] sm:w-[35vw] md:w-[32vw] lg:w-[30vw] py-1 my-4 bg-[#17423f] rounded-3xl text-white select-none"
        }
      >
        <button onClick={prevSlide} disabled={activeCarouselIndex < 1} className={"month-navigation-option navigate-left"}>
          <img src="/static/assets-v2/UI-icons/left-navigation-arrow.svg" alt="Left navigation arrow" />
        </button>
        <p className={"text-xl"}>
          {!!activeMonthAndYear ? activeMonthAndYear.month + " " + activeMonthAndYear.year.toString() : "Loading..."}
        </p>
        <button
          onClick={nextSlide}
          disabled={activeCarouselIndex >= startingIndex + 12}
          className={"month-navigation-option navigate-right"}
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
        <img src="https://github.com/shadcn.png" alt="Navigate to Expenses" className={"size-8"} />
        <p className={"mx-8 font-bold text-xl"}>Expenses</p>
        <img src="https://github.com/shadcn.png" alt="Navigate to Expenses" className={"size-8"} />
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
