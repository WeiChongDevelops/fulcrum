import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  MonthExpenseGroupEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "../../../utility/types.ts";
import useInitialExpenseData from "../../../hooks/queries/useInitialExpenseData.ts";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  getMonthsFromToday,
  getStructuredExpenseData,
  LocationContext,
  monthStringArray,
  updateRecurringExpenseInstances,
  Y2K,
} from "../../../utility/util.ts";
import useBatchDeleteExpenses from "../../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../../hooks/mutations/expense/useBatchCreateExpenses.ts";
import Loader from "../../../components/child/other/Loader.tsx";
import ActiveFormClickShield from "../../../components/child/other/ActiveFormClickShield.tsx";
import ExpenseModalsAndForms from "../../../components/child/expenses/ExpenseModalsAndForms.tsx";
import ExpenseMonthCarouselV2 from "./ExpenseMonthCarouselV2.tsx";
import { CarouselApi } from "@/components/ui/carousel.tsx";
import { Button } from "@/components/ui/button.tsx";
import ExpenseHeaderV2 from "@/components-v2/child/expenses/ExpenseHeaderV2.tsx";

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
  const routerLocation = useContext(LocationContext);

  const { mutate: batchDeleteExpenses } = useBatchDeleteExpenses();
  const { mutate: batchCreateExpenses, isSuccess: expenseCreationIsSuccess } = useBatchCreateExpenses();

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

  const [api, setApi] = useState<CarouselApi>();

  const startingIndex = getMonthsFromToday(Y2K.getMonth(), Y2K.getFullYear());

  // useEffect(() => {
  //   if (!!structuredExpenseData && !!api) {
  //     // console.log(structuredExpenseData[api.slidesInView()[0]].monthIndex);
  //     const activeDataEntry = structuredExpenseData[api.slidesInView()[0]];
  //     setActiveMonthAndYear({ month: monthStringArray[activeDataEntry.monthIndex], year: activeDataEntry.year });
  //   }
  // }, [structuredExpenseData, api?.slidesInView()]);

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  return (
    <div className={"flex flex-col h-screen w-full"}>
      <ExpenseHeaderV2
        carouselAPI={api!}
        structuredExpenseData={structuredExpenseData}
        startingIndex={startingIndex}
        navMenuOpen={navMenuOpen}
        toggleNavMenu={toggleNavMenu}
        publicUserData={publicUserData}
      />
      <div className={"flex flex-row justify-center items-center bg-red-500 w-full h-[94%]"}>
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
        {/*<div className="flex flex-col justify-center items-center relative">*/}
        {/*  <div>*/}
        {/*    <div*/}
        {/*      className={`justify-center items-center elementsBelowPopUpForm*/}
        {/*            ${isExpenseFormOrModalOpen && "blur"}`}*/}
        {/*    >*/}
        {/*      <ExpenseMonthCarouselV2*/}
        {/*        structuredExpenseData={structuredExpenseData!}*/}
        {/*        setExpenseFormVisibility={setExpenseFormVisibility}*/}
        {/*        setExpenseModalVisibility={setExpenseModalVisibility}*/}
        {/*        setOldExpenseBeingEdited={setOldExpenseBeingEdited}*/}
        {/*        setExpenseItemToDelete={setExpenseItemToDelete}*/}
        {/*        categoryDataMap={categoryDataMap}*/}
        {/*        publicUserData={publicUserData}*/}
        {/*        setDefaultCalendarDate={setDefaultCalendarDate}*/}
        {/*      />*/}
        {/*    </div>*/}

        {/*    {isExpenseFormOrModalOpen && <ActiveFormClickShield />}*/}

        {/*    <ExpenseModalsAndForms*/}
        {/*      expenseFormVisibility={expenseFormVisibility}*/}
        {/*      setExpenseFormVisibility={setExpenseFormVisibility}*/}
        {/*      expenseModalVisibility={expenseModalVisibility}*/}
        {/*      setExpenseModalVisibility={setExpenseModalVisibility}*/}
        {/*      expenseArray={expenseArray}*/}
        {/*      budgetArray={budgetArray}*/}
        {/*      groupArray={groupArray}*/}
        {/*      publicUserData={publicUserData}*/}
        {/*      defaultCalendarDate={defaultCalendarDate}*/}
        {/*      oldExpenseBeingEdited={oldExpenseBeingEdited}*/}
        {/*      expenseItemToDelete={expenseItemToDelete}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
