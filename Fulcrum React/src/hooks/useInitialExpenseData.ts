import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  BlacklistedExpenseItemEntity,
  checkForUser,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getBlacklistedExpenses,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  RecurringExpenseItemEntity,
  updateRecurringExpenseInstances,
} from "../util.ts";

interface useInitialExpenseDataProps {
  setBlacklistedExpenseArray: (blacklistedExpenses: BlacklistedExpenseItemEntity[]) => void;
  expenseArray: ExpenseItemEntity[];
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setError: Dispatch<SetStateAction<string>>;
  recurringExpenseArray: RecurringExpenseItemEntity[];
}

export default function useInitialExpenseData({
  setBlacklistedExpenseArray,
  expenseArray,
  blacklistedExpenseArray,
  setExpenseArray,
  setError,
  recurringExpenseArray,
}: useInitialExpenseDataProps) {
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

        setBlacklistedExpenseArray(await getBlacklistedExpenses());

        await updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, blacklistedExpenseArray, setExpenseArray);
      } catch (error) {
        console.log(`Unsuccessful expense page data retrieval - error: ${error}`);
      }
    }
    retrieveInitialData()
      .then(() => setIsLoading(false))
      .catch(() => setError("We’re unable to load your data right now. Please try again later."));
  }, []);

  return {
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
  };
}
