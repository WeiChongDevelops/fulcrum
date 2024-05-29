import {
  getStructuredExpenseData,
  LocationContext,
  updateRecurringExpenseInstances,
  useLocation,
} from "../../../utility/util.ts";
import "../../../css/Expense.css";
import ExpenseMonthCarousel from "./main-data-hierarchy/ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialExpenseData from "../../../hooks/queries/useInitialExpenseData.ts";
import Loader from "../other/Loader.tsx";
import { useContext, useEffect, useMemo, useState } from "react";
import useBatchDeleteExpenses from "../../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../../hooks/mutations/expense/useBatchCreateExpenses.ts";
import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  MonthExpenseGroupEntity,
  UserPreferences,
  RecurringExpenseItemEntity,
} from "../../../utility/types.ts";

interface ExpensesProps {
  userPreferences: UserPreferences;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];

  categoryDataMap: CategoryToIconGroupAndColourMap;
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
}

/**
 * The root component for the expense page.
 */
export default function Expenses({
  userPreferences,
  expenseArray,
  budgetArray,
  groupArray,
  categoryDataMap,
  blacklistedExpenseArray,
  recurringExpenseArray,
}: ExpensesProps) {
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

  const routerLocation = useLocation();

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

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  return (
    <div className="flex flex-col justify-center items-center relative">
      <div>
        <div
          className={`justify-center items-center elementsBelowPopUpForm
                    ${isExpenseFormOrModalOpen && "blur"}`}
        >
          <ExpenseMonthCarousel
            structuredExpenseData={structuredExpenseData!}
            setExpenseFormVisibility={setExpenseFormVisibility}
            setExpenseModalVisibility={setExpenseModalVisibility}
            setOldExpenseBeingEdited={setOldExpenseBeingEdited}
            setExpenseItemToDelete={setExpenseItemToDelete}
            categoryDataMap={categoryDataMap}
            userPreferences={userPreferences}
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
          userPreferences={userPreferences}
          defaultCalendarDate={defaultCalendarDate}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          expenseItemToDelete={expenseItemToDelete}
        />
      </div>
    </div>
  );
}
