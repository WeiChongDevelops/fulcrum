import {
  BlacklistedExpenseItemEntity,
  ExpenseItemEntity,
  MonthExpenseGroupEntity,
  RecurringExpenseItemEntity,
} from "@/utility/types.ts";
import useInitialExpenseData from "../../hooks/queries/useInitialExpenseData.ts";
import { useEffect, useState } from "react";
import {
  getMonthsFromToday,
  getStructuredExpenseData,
  updateRecurringExpenseInstances,
  expenseStartDate,
  useLocation,
  useEmail,
  useSideBarIsOpen,
} from "@/utility/util.ts";
import useBatchDeleteExpenses from "../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../hooks/mutations/expense/useBatchCreateExpenses.ts";
import Loader from "../subcomponents/other/Loader.tsx";
import ExpenseMonthCarouselV2 from "../subcomponents/expenses/ExpenseMonthCarouselV2.tsx";
import { CarouselApi } from "@/components-v2/ui/carousel.tsx";
import ExpenseHeaderV2 from "@/components-v2/subcomponents/expenses/ExpenseHeaderV2.tsx";
import "@/css/Expense.css";
import { useQueryClient } from "@tanstack/react-query";

interface ExpensesV2Props {
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * The root component for the expense page.
 */
export default function ExpensesV2({ perCategoryExpenseTotalThisMonth }: ExpensesV2Props) {
  const expenseArray: ExpenseItemEntity[] = useQueryClient().getQueryData(["expenseArray", useEmail()])!;
  const recurringExpenseArray: RecurringExpenseItemEntity[] = useQueryClient().getQueryData([
    "recurringExpenseArray",
    useEmail(),
  ])!;
  const blacklistedExpenseArray: BlacklistedExpenseItemEntity[] = useQueryClient().getQueryData([
    "blacklistedExpenseArray",
    useEmail(),
  ])!;
  const { oldExpenseBeingEdited, setOldExpenseBeingEdited } = useInitialExpenseData();
  const sideBarOpen = useSideBarIsOpen();
  const routerLocation = useLocation();

  const { mutate: batchDeleteExpenses } = useBatchDeleteExpenses();
  const { mutate: batchCreateExpenses, isSuccess: expenseCreationIsSuccess } = useBatchCreateExpenses();
  const startingIndex = getMonthsFromToday(expenseStartDate.getMonth(), expenseStartDate.getFullYear());

  const [isLoading, setIsLoading] = useState(true);
  const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>();
  const [api, setApi] = useState<CarouselApi>();
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(startingIndex ?? new Date());

  const rerenderCarousel = () => {
    const carousel = document.querySelector("#expense-carousel");
    if (!!carousel) {
      carousel.classList.add("fadeOut");
      setTimeout(() => {
        carousel.classList.remove("fadeOut");
        api?.reInit();
      }, 300);
    }
  };

  const getUpdatedCarouselWidth = () => {
    const carousel = document.querySelector("#expense-carousel");
    !!carousel && setCarouselWidth(carousel.getBoundingClientRect().width);
  };

  useEffect(() => {
    const updateStructuredExpenseData = async () => {
      !!expenseArray && setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
    };
    updateStructuredExpenseData().then(() => setIsLoading(false));
  }, [expenseArray, routerLocation]);

  useEffect(() => {
    updateRecurringExpenseInstances(
      recurringExpenseArray,
      expenseArray,
      blacklistedExpenseArray,
      batchDeleteExpenses,
      batchCreateExpenses,
      expenseCreationIsSuccess,
    );
  }, [recurringExpenseArray, routerLocation]);
  useEffect(() => {
    rerenderCarousel();
  }, [sideBarOpen, carouselWidth]);

  useEffect(() => {
    window.addEventListener("resize", getUpdatedCarouselWidth);
    return () => window.removeEventListener("resize", getUpdatedCarouselWidth);
  }, []);

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  return (
    <div className={"flex flex-col justify-start items-end relative"}>
      <ExpenseHeaderV2
        carouselAPI={api!}
        structuredExpenseData={structuredExpenseData}
        startingIndex={startingIndex}
        activeCarouselIndex={activeCarouselIndex}
        setActiveCarouselIndex={setActiveCarouselIndex}
      />
      <ExpenseMonthCarouselV2
        structuredExpenseData={structuredExpenseData!}
        setOldExpenseBeingEdited={setOldExpenseBeingEdited}
        setApi={setApi}
        startingIndex={startingIndex}
        activeCarouselIndex={activeCarouselIndex}
        oldExpenseBeingEdited={oldExpenseBeingEdited}
        perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
      />
    </div>
  );
}
