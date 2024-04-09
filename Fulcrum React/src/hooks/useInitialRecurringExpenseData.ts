import { useState } from "react";
import {
  PreviousRecurringExpenseBeingEdited,
  RecurringExpenseFormVisibility,
  RecurringExpenseModalVisibility,
} from "../util.ts";

export default function useInitialRecurringExpenseData() {
  const [recurringExpenseModalVisibility, setRecurringExpenseModalVisibility] = useState<RecurringExpenseModalVisibility>({
    isConfirmRecurringExpenseDeletionModalVisible: false,
    isSelectRecurringExpenseDeletionTypeModalVisible: false,
  });
  const [recurringExpenseFormVisibility, setRecurringExpenseFormVisibility] = useState<RecurringExpenseFormVisibility>({
    isCreateExpenseVisible: false,
    isUpdateRecurringExpenseVisible: false,
  });

  const [isRecurringExpenseFormOrModalOpen, setIsRecurringExpenseFormOrModalOpen] = useState(false);

  const [oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited] = useState<PreviousRecurringExpenseBeingEdited>({
    recurringExpenseId: "",
    oldCategory: "",
    oldAmount: 0,
    oldTimestamp: new Date(),
    oldFrequency: "monthly",
  });
  const [recurringExpenseIdToDelete, setRecurringExpenseIdToDelete] = useState("");

  return {
    recurringExpenseModalVisibility,
    setRecurringExpenseModalVisibility,
    recurringExpenseFormVisibility,
    setRecurringExpenseFormVisibility,
    isRecurringExpenseFormOrModalOpen,
    setIsRecurringExpenseFormOrModalOpen,
    oldRecurringExpenseBeingEdited,
    setOldRecurringExpenseBeingEdited,
    recurringExpenseIdToDelete,
    setRecurringExpenseIdToDelete,
  };
}
