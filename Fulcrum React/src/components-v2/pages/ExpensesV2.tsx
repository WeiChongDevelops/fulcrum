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
  Y2K,
} from "@/utility/util.ts";
import useBatchDeleteExpenses from "../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../hooks/mutations/expense/useBatchCreateExpenses.ts";
import Loader from "../../components/child/other/Loader.tsx";
import ActiveFormClickShield from "../../components/child/other/ActiveFormClickShield.tsx";
import ExpenseModalsAndForms from "../../components/child/expenses/ExpenseModalsAndForms.tsx";
import ExpenseMonthCarouselV2 from "../subcomponents/expenses/ExpenseMonthCarouselV2.tsx";
import { CarouselApi } from "@/components/ui/carousel.tsx";
import ExpenseHeaderV2 from "@/components-v2/subcomponents/expenses/ExpenseHeaderV2.tsx";
import "@/css/Expense.css";

interface ExpensesV2Props {
  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];

  categoryDataMap: CategoryToIconGroupAndColourMap;
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
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
  toggleNavMenu,
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

  const routerLocation = useContext(LocationContext);

  const { mutate: batchDeleteExpenses } = useBatchDeleteExpenses();
  const { mutate: batchCreateExpenses, isSuccess: expenseCreationIsSuccess } = useBatchCreateExpenses();

  const startingIndex = getMonthsFromToday(Y2K.getMonth(), Y2K.getFullYear());

  useEffect(() => {
    const updateStructuredExpenseData = async () => {
      setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
    };
    updateStructuredExpenseData().then(() => setIsLoading(false));
  }, [expenseArray, routerLocation]);

  useMemo(() => {
    updateRecurringExpenseInstances(
      recurringExpenseArray,
      expenseArray,
      blacklistedExpenseArray,
      batchDeleteExpenses,
      batchCreateExpenses,
      expenseCreationIsSuccess,
    );
  }, [recurringExpenseArray]);

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
    <div className={"flex flex-col justify-start items-end h-screen w-full relative overflow-y-scroll"}>
      <ExpenseHeaderV2
        carouselAPI={api!}
        structuredExpenseData={structuredExpenseData}
        startingIndex={startingIndex}
        publicUserData={publicUserData}
      />
      <ExpenseMonthCarouselV2
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
      {/*<div className={"bg-red-500 h-[94%] relative"}>*/}
      {/*  <div className="flex flex-col justify-center items-center relative">*/}
      {/*    <div>*/}
      {/*      <div*/}
      {/*        className={`justify-center items-center elementsBelowPopUpForm*/}
      {/*              ${isExpenseFormOrModalOpen && "blur"}`}*/}
      {/*      >*/}
      {/*        <ExpenseMonthCarouselV2*/}
      {/*          structuredExpenseData={structuredExpenseData!}*/}
      {/*          setExpenseFormVisibility={setExpenseFormVisibility}*/}
      {/*          setExpenseModalVisibility={setExpenseModalVisibility}*/}
      {/*          setOldExpenseBeingEdited={setOldExpenseBeingEdited}*/}
      {/*          setExpenseItemToDelete={setExpenseItemToDelete}*/}
      {/*          categoryDataMap={categoryDataMap}*/}
      {/*          publicUserData={publicUserData}*/}
      {/*          setDefaultCalendarDate={setDefaultCalendarDate}*/}
      {/*          setApi={setApi}*/}
      {/*          startingIndex={startingIndex}*/}
      {/*        />*/}
      {/*      </div>*/}

      {/*      {isExpenseFormOrModalOpen && <ActiveFormClickShield />}*/}

      {/*      <ExpenseModalsAndForms*/}
      {/*        expenseFormVisibility={expenseFormVisibility}*/}
      {/*        setExpenseFormVisibility={setExpenseFormVisibility}*/}
      {/*        expenseModalVisibility={expenseModalVisibility}*/}
      {/*        setExpenseModalVisibility={setExpenseModalVisibility}*/}
      {/*        expenseArray={expenseArray}*/}
      {/*        budgetArray={budgetArray}*/}
      {/*        groupArray={groupArray}*/}
      {/*        publicUserData={publicUserData}*/}
      {/*        defaultCalendarDate={defaultCalendarDate}*/}
      {/*        oldExpenseBeingEdited={oldExpenseBeingEdited}*/}
      {/*        expenseItemToDelete={expenseItemToDelete}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
