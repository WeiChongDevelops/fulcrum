import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  RecurringExpenseItemEntity,
  MonthExpenseGroupEntity,
  getStructuredExpenseData,
  updateRecurringExpenseInstances,
} from "../../../util.ts";
import "../../../css/Expense.css";
import ExpenseMonthCarousel from "./main-data-hierarchy/ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialExpenseData from "../../../hooks/initialisations/useInitialExpenseData.ts";
import Loader from "../other/Loader.tsx";
import { useMemo, useState } from "react";
import useBatchDeleteExpenses from "../../../hooks/mutations/expense/useBatchDeleteExpenses.ts";
import useBatchCreateExpenses from "../../../hooks/mutations/expense/useBatchCreateExpenses.ts";

interface ExpensesProps {
  publicUserData: PublicUserData;

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
  publicUserData,
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

  const { mutate: batchDeleteExpenses } = useBatchDeleteExpenses();
  const { mutate: batchCreateExpenses, isSuccess: expenseCreationIsSuccess } = useBatchCreateExpenses();

  useMemo(() => {
    const updateStructuredExpenseData = async () => {
      setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
    };
    updateStructuredExpenseData().then(() => setIsLoading(false));
  }, [expenseArray]);

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
      <div className={""}>
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
          publicUserData={publicUserData}
          defaultCalendarDate={defaultCalendarDate}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          expenseItemToDelete={expenseItemToDelete}
        />
      </div>
    </div>
  );
}
