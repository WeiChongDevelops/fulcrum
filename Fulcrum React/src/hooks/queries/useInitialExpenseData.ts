import { PreviousExpenseBeingEdited } from "@/utility/types.ts";
import { useState } from "react";

export default function useInitialExpenseData() {
  const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({
    expenseId: "",
    recurringExpenseId: "",
    oldCategory: "",
    oldTimestamp: new Date(),
    oldAmount: 0,
  });

  return {
    oldExpenseBeingEdited,
    setOldExpenseBeingEdited,
  };
}
