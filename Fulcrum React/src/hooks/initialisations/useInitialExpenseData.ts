import { useEffect, useState } from "react";
import {
  checkForOpenModalOrForm,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
} from "../../util.ts";

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

  // let structuredExpenseDataQuery = useQuery({
  //   queryKey: ["structuredExpenseData", email],
  //   queryFn: async () => {
  //     await updateRecurringExpenseInstances(
  //       recurringExpenseArray,
  //       expenseArray,
  //       blacklistedExpenseArray,
  //       expenseCreationMutation as UseMutationResult,
  //       batchExpenseDeletionMutation as UseMutationResult,
  //     );
  //     return await getStructuredExpenseData(expenseArray);
  //   },
  // });

  // useEffect(() => {
  //   async function updateExpenseDisplay() {
  //     await updateRecurringExpenseInstances(
  //       recurringExpenseArray,
  //       expenseArray,
  //       blacklistedExpenseArray,
  //       expenseCreationMutation as UseMutationResult,
  //       batchExpenseDeletionMutation as UseMutationResult,
  //     );
  //     setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
  //   }
  //   updateExpenseDisplay();
  // }, [expenseArray]);

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
