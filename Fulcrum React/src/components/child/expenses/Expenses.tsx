import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  checkForOpenModalOrForm,
  checkForUser,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getRecurringExpenseList,
  getBlacklistedExpenses,
  getStructuredExpenseData,
  GroupItemEntity,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseItemEntity,
  BlacklistedExpenseItemEntity,
  updateRecurringExpenseInstances,
} from "../../../util.ts";
import "../../../css/Expense.css";
import Loader from "../other/Loader.tsx";
import ExpenseMonthCarousel from "./main-data-hierarchy/ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";

interface ExpensesProps {
  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

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
  error,
  setError,
}: ExpensesProps) {
  const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
  const [expenseFormVisibility, setExpenseFormVisibility] = useState({
    isCreateExpenseVisible: false,
    isUpdateExpenseVisible: false,
    isUpdateRecurringExpenseInstanceVisible: false,
  });
  const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>({
    isConfirmExpenseDeletionModalVisible: false,
  });
  const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);
  const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({
    expenseId: "",
    recurringExpenseId: "",
    oldCategory: "",
    oldTimestamp: new Date(),
    oldAmount: 0,
  });
  const [expenseIdToDelete, setExpenseIdToDelete] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

  const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>([]);

  useEffect(() => {
    async function retrieveInitialData() {
      try {
        const userStatus = await checkForUser();
        if (userStatus["loggedIn"]) {
          console.log("User logged in.");
        } else {
          console.log("User not logged in, login redirect initiated.");
          window.location.href = "/login";
        }

        const [recurringExpenseList, blacklistedExpenses] = await Promise.all([
          getRecurringExpenseList(),
          getBlacklistedExpenses(),
        ]);
        setRecurringExpenseArray(recurringExpenseList);
        setBlacklistedExpenseArray(blacklistedExpenses);

        await updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, blacklistedExpenseArray, setExpenseArray);
      } catch (error) {
        console.log(`Unsuccessful expense page data retrieval - error: ${error}`);
      }
    }
    retrieveInitialData()
      .then(() => setIsLoading(false))
      .catch(() => setError("We’re unable to load your data right now. Please try again later."));
  }, []);

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
