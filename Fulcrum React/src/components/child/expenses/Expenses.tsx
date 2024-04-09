import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  RecurringExpenseItemEntity,
} from "../../../util.ts";
import "../../../css/Expense.css";
import ExpenseMonthCarousel from "./main-data-hierarchy/ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialExpenseData from "../../../hooks/useInitialExpenseData.ts";
import Loader from "../other/Loader.tsx";

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
    structuredExpenseData,
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
    isLoading,
  } = useInitialExpenseData({
    expenseArray,
    blacklistedExpenseArray,
    recurringExpenseArray,
  });

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
