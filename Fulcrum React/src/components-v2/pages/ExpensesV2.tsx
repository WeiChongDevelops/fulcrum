import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  MonthExpenseGroupEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "@/utility/types.ts";
import useInitialExpenseData from "../../hooks/queries/useInitialExpenseData.ts";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  getMonthsFromToday,
  getStructuredExpenseData,
  LocationContext,
  updateRecurringExpenseInstances,
  expenseStartDate,
  useLocation,
} from "@/utility/util.ts";
import useBatchDeleteExpenses from "../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../hooks/mutations/expense/useBatchCreateExpenses.ts";
import Loader from "../../components/child/other/Loader.tsx";
import ActiveFormClickShield from "../../components/child/other/ActiveFormClickShield.tsx";
import ExpenseModalsAndForms from "../../components/child/expenses/ExpenseModalsAndForms.tsx";
import ExpenseMonthCarouselV2 from "../subcomponents/expenses/ExpenseMonthCarouselV2.tsx";
import { CarouselApi } from "@/components-v2/ui/carousel.tsx";
import ExpenseHeaderV2 from "@/components-v2/subcomponents/expenses/ExpenseHeaderV2.tsx";
import "@/css/Expense.css";
import { ScrollAreaDemo } from "@/components-v2/subcomponents/budget/Playground.tsx";
import { Separator } from "@/components-v2/ui/separator.tsx";
import { ScrollArea } from "@/components-v2/ui/scroll-area.tsx";

interface ExpensesV2Props {
  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];

  categoryDataMap: CategoryToIconGroupAndColourMap;
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  navMenuOpen: boolean;
}

/**
 * The root component for the expense page.
 */
export default function ExpensesV2({
  publicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  categoryDataMap,
  blacklistedExpenseArray,
  recurringExpenseArray,
  navMenuOpen,
}: ExpensesV2Props) {
  const {
    expenseFormVisibility,
    setExpenseFormVisibility,
    expenseModalVisibility,
    setExpenseModalVisibility,
    isExpenseFormOrModalOpen,
    oldExpenseBeingEdited,
    setOldExpenseBeingEdited,
    expenseItemToDelete,
    setExpenseItemToDelete,
    defaultCalendarDate,
    setDefaultCalendarDate,
  } = useInitialExpenseData();

  const [isLoading, setIsLoading] = useState(true);
  const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>();
  const [api, setApi] = useState<CarouselApi>();
  const [carouselWidth, setCarouselWidth] = useState(0);

  const routerLocation = useLocation();

  const { mutate: batchDeleteExpenses } = useBatchDeleteExpenses();
  const { mutate: batchCreateExpenses, isSuccess: expenseCreationIsSuccess } = useBatchCreateExpenses();

  const startingIndex = getMonthsFromToday(expenseStartDate.getMonth(), expenseStartDate.getFullYear());

  useEffect(() => {
    const updateStructuredExpenseData = async () => {
      setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
    };
    updateStructuredExpenseData().then(() => setIsLoading(false));
  }, [expenseArray, routerLocation]);

  useEffect(() => {
    console.log("!!!!!!!!");
    console.log(routerLocation);
    console.log("!!!!!!!!");
  }, [routerLocation]);

  useEffect(() => {
    updateRecurringExpenseInstances(
      recurringExpenseArray,
      expenseArray,
      blacklistedExpenseArray,
      batchDeleteExpenses,
      batchCreateExpenses,
      expenseCreationIsSuccess,
    );
  }, [expenseArray, recurringExpenseArray, blacklistedExpenseArray, budgetArray, routerLocation]);

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
    rerenderCarousel();
  }, [navMenuOpen]);

  useEffect(() => {
    window.addEventListener("resize", getUpdatedCarouselWidth);
    return () => window.removeEventListener("resize", getUpdatedCarouselWidth);
  }, []);

  useEffect(() => {
    rerenderCarousel();
  }, [carouselWidth]);

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  return (
    <div className={"flex flex-col justify-start items-end relative"}>
      <ExpenseHeaderV2
        carouselAPI={api!}
        structuredExpenseData={structuredExpenseData}
        startingIndex={startingIndex}
        publicUserData={publicUserData}
        navMenuOpen={navMenuOpen}
      />
      <ExpenseMonthCarouselV2
        budgetArray={budgetArray}
        structuredExpenseData={structuredExpenseData!}
        setExpenseFormVisibility={setExpenseFormVisibility}
        setExpenseModalVisibility={setExpenseModalVisibility}
        setOldExpenseBeingEdited={setOldExpenseBeingEdited}
        setExpenseItemToDelete={setExpenseItemToDelete}
        categoryDataMap={categoryDataMap}
        publicUserData={publicUserData}
        setDefaultCalendarDate={setDefaultCalendarDate}
        setApi={setApi}
        startingIndex={startingIndex}
        oldExpenseBeingEdited={oldExpenseBeingEdited}
      />
      <ExpenseModalsAndForms
        expenseFormVisibility={expenseFormVisibility}
        setExpenseFormVisibility={setExpenseFormVisibility}
        expenseModalVisibility={expenseModalVisibility}
        setExpenseModalVisibility={setExpenseModalVisibility}
        expenseArray={expenseArray}
        budgetArray={budgetArray}
        groupArray={groupArray}
        publicUserData={publicUserData}
        defaultCalendarDate={defaultCalendarDate}
        oldExpenseBeingEdited={oldExpenseBeingEdited}
        expenseItemToDelete={expenseItemToDelete}
      />
    </div>
  );
}
