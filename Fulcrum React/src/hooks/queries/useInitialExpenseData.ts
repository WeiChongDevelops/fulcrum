import { useEffect, useState } from "react";
import { checkForOpenModalOrForm } from "../../utility/util.ts";
import { ExpenseItemEntity, ExpenseModalVisibility, PreviousExpenseBeingEdited } from "../../utility/types.ts";

export default function useInitialExpenseData() {
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
  const [expenseItemToDelete, setExpenseItemToDelete] = useState<ExpenseItemEntity>({
    expenseId: "",
    category: "",
    amount: 0,
    timestamp: new Date(),
    recurringExpenseId: null,
  });
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

  useEffect(() => {
    setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility));
  }, [expenseFormVisibility, expenseModalVisibility]);

  return {
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
  };
}
