import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  checkForOpenModalOrForm,
  ExpenseItemEntity,
  getStructuredExpenseData,
  GroupItemEntity,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  updateRecurringExpenseInstances,
  RecurringExpenseItemEntity,
} from "../../../util.ts";
import "../../../css/Expense.css";
import Loader from "../other/Loader.tsx";
import ExpenseMonthCarousel from "./main-data-hierarchy/ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialExpenseData from "../../../hooks/useInitialExpenseData.ts";
import FulcrumErrorPage from "../other/FulcrumErrorPage.tsx";

interface ExpensesProps {
  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;
}

/**
 * The root component for the expense page.
 */
export default function Expenses({
  publicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  setExpenseArray,
  setBudgetArray,
  categoryDataMap,
  blacklistedExpenseArray,
  setBlacklistedExpenseArray,
  recurringExpenseArray,
  setRecurringExpenseArray,
}: ExpensesProps) {
  const {
    structuredExpenseData,
    setStructuredExpenseData,

    expenseFormVisibility,
    setExpenseFormVisibility,

    expenseModalVisibility,
    setExpenseModalVisibility,

    isExpenseFormOrModalOpen,
    setIsExpenseFormOrModalOpen,

    oldExpenseBeingEdited,
    setOldExpenseBeingEdited,

    expenseIdToDelete,
    setExpenseIdToDelete,

    defaultCalendarDate,
    setDefaultCalendarDate,
  } = useInitialExpenseData({
    expenseArray,
    blacklistedExpenseArray,
    setExpenseArray,
    recurringExpenseArray,
  });

  // if (isLoading) {
  //   return <Loader isLoading={isLoading} isDarkMode={false} />;
  // }
  //
  // if (isError) {
  //   return <FulcrumErrorPage errors={[error!]} />;
  // }

  return (
    <div className="flex flex-col justify-center items-center relative">
      <div className={""}>
        <div
          className={`justify-center items-center elementsBelowPopUpForm
                    ${isExpenseFormOrModalOpen && "blur"}`}
        >
          <ExpenseMonthCarousel
            structuredExpenseData={structuredExpenseData}
            setExpenseFormVisibility={setExpenseFormVisibility}
            setExpenseModalVisibility={setExpenseModalVisibility}
            setOldExpenseBeingEdited={setOldExpenseBeingEdited}
            setExpenseIdToDelete={setExpenseIdToDelete}
            categoryDataMap={categoryDataMap}
            publicUserData={publicUserData}
            setDefaultCalendarDate={setDefaultCalendarDate}
          />
        </div>

        {isExpenseFormOrModalOpen && <ActiveFormClickShield />}

        <ExpenseModalsAndForms
          expenseFormVisibility={expenseFormVisibility}
          setExpenseFormVisibility={setExpenseFormVisibility}
          expenseModalVisibility={expenseModalVisibility}
          setExpenseModalVisibility={setExpenseModalVisibility}
          expenseArray={expenseArray}
          budgetArray={budgetArray}
          groupArray={groupArray}
          setExpenseArray={setExpenseArray}
          setBudgetArray={setBudgetArray}
          setRecurringExpenseArray={setRecurringExpenseArray}
          setBlacklistedExpenseArray={setBlacklistedExpenseArray}
          publicUserData={publicUserData}
          defaultCalendarDate={defaultCalendarDate}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          expenseIdToDelete={expenseIdToDelete}
        />
      </div>
    </div>
  );
}
