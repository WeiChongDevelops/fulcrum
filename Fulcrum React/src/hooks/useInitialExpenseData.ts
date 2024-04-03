import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  BlacklistedExpenseItemEntity,
  checkForOpenModalOrForm,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getStructuredExpenseData,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  RecurringExpenseItemEntity,
  updateRecurringExpenseInstances,
} from "../util.ts";

interface useInitialExpenseDataProps {
  expenseArray: ExpenseItemEntity[];
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  recurringExpenseArray: RecurringExpenseItemEntity[];
}

export default function useInitialExpenseData({
  expenseArray,
  blacklistedExpenseArray,
  setExpenseArray,
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
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

  const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>([]);

  useMemo(() => {
    getStructuredExpenseData(expenseArray, setStructuredExpenseData);
  }, [expenseArray]);

  useEffect(() => {
    setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility));
  }, [expenseFormVisibility, expenseModalVisibility]);

  useMemo(() => {
    updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, blacklistedExpenseArray, setExpenseArray);
  }, [recurringExpenseArray]);

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
    defaultCalendarDate,
    setDefaultCalendarDate,
  };
}
