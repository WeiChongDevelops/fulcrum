import FulcrumButton from "../../../other/FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import {
  ExpenseItemEntity,
  getExpenseList,
  handleInputChangeOnFormWithAmount,
  PreviousExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  ExpenseFormVisibility,
  SelectorOptionsFormattedData,
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  changeFormOrModalVisibility,
  EmailContext,
  handleExpenseUpdating,
} from "../../../../../util.ts";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../../selectors/CategorySelector.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RecurringExpenseInstanceUpdatingFormProps {
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  categoryOptions: SelectorOptionsFormattedData[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  currencySymbol: string;
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;
}

/**
 * A form for updating an existing recurring expense instance in the expense database.
 */
export default function RecurringExpenseInstanceUpdatingForm({
  setExpenseFormVisibility,
  setExpenseArray,
  categoryOptions,
  oldExpenseBeingEdited,
  currencySymbol,
  setBlacklistedExpenseArray,
}: RecurringExpenseInstanceUpdatingFormProps) {
  const [formData, setFormData] = useState<RecurringExpenseInstanceUpdatingFormData>({
    category: oldExpenseBeingEdited.oldCategory,
    amount: oldExpenseBeingEdited.oldAmount,
  });
  const formRef = useRef<HTMLDivElement>(null);

  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  const expenseUpdatingMutation = useMutation({
    mutationFn: (updatedExpenseItem: ExpenseItemEntity) => {
      return handleExpenseUpdating(updatedExpenseItem);
    },
    onMutate: async (updatedExpenseItem: ExpenseItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.map((expenseItem) =>
          expenseItem.expenseId === updatedExpenseItem.expenseId ? updatedExpenseItem : expenseItem,
        );
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function hideForm() {
    changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateRecurringExpenseInstanceVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    hideForm();

    const noChangesMade =
      formData.category === oldExpenseBeingEdited.oldCategory && formData.amount === oldExpenseBeingEdited.oldAmount;

    const updatedExpenseItem: ExpenseItemEntity = {
      expenseId: oldExpenseBeingEdited.expenseId,
      category: formData.category,
      amount: formData.amount,
      timestamp: oldExpenseBeingEdited.oldTimestamp,
      recurringExpenseId: noChangesMade ? oldExpenseBeingEdited.recurringExpenseId : null,
    };

    expenseUpdatingMutation.mutate(updatedExpenseItem);

    // await handleRecurringExpenseInstanceUpdating(oldExpenseBeingEdited.expenseId, formData);
    // await handleBlacklistedExpenseCreation(oldExpenseBeingEdited.recurringExpenseId!, oldExpenseBeingEdited.oldTimestamp);
    // setBlacklistedExpenseArray(await getBlacklistedExpenses());

    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
    });
    getExpenseList().then((expenseList) => setExpenseArray(expenseList));
  }

  return (
    <div ref={formRef} className="fulcrum-form justify-start items-center">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 mt-4 font-bold text-3xl">Updating Expense</p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category</label>
        <CategorySelector
          categoryOptions={categoryOptions}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          setFormData={setFormData}
        />

        <label htmlFor="amount">Amount</label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount ?? ""}
            name="amount"
            id="amount"
            className="mb-3"
            required
          />
        </div>

        <div className={"mt-2 text-sm"}>
          <p className={"mb-2"}>You are editing only this instance of your recurring expense.</p>
          <p>To manage all your recurring expenses, go to the Tools section!</p>
        </div>

        <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
      </form>
    </div>
  );
}
