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

  error: string;
  setError: Dispatch<SetStateAction<string>>;
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
  error,
  setError,
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

    isLoading,

    defaultCalendarDate,
    setDefaultCalendarDate,
  } = useInitialExpenseData({
    setBlacklistedExpenseArray,
    expenseArray,
    blacklistedExpenseArray,
    setExpenseArray,
    setError,
    recurringExpenseArray,
  });

  useMemo(() => {
    getStructuredExpenseData(expenseArray, setStructuredExpenseData);
  }, [expenseArray]);

  useEffect(() => {
    setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility));
  }, [expenseFormVisibility, expenseModalVisibility]);

  useMemo(() => {
    updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, blacklistedExpenseArray, setExpenseArray);
  }, [recurringExpenseArray]);

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-col justify-center items-center relative">
          {error === "" ? (
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
          ) : (
            <p className={`error-message ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>{error}</p>
          )}
        </div>
      ) : (
        <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled} />
      )}
    </>
  );
}
