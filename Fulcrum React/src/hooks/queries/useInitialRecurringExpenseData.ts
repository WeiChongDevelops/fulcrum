import { useState } from "react";
import { PreviousRecurringExpenseBeingEdited } from "@/utility/types.ts";
export default function useInitialRecurringExpenseData() {
  const [oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited] = useState<PreviousRecurringExpenseBeingEdited>({
    recurringExpenseId: "",
    oldCategory: "",
    oldAmount: 0,
    oldTimestamp: new Date(),
    oldFrequency: "monthly",
  });

  return {
    oldRecurringExpenseBeingEdited,
    setOldRecurringExpenseBeingEdited,
  };
}
