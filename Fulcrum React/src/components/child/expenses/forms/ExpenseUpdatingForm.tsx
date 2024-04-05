import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import {
  BudgetItemEntity,
  getBudgetList,
  ExpenseItemEntity,
  SelectorOptionsFormattedData,
  ExpenseUpdatingFormData,
  handleExpenseUpdating,
  getExpenseList,
  handleInputChangeOnFormWithAmount,
  PreviousExpenseBeingEdited,
  Value,
  ExpenseFormVisibility,
  SetFormVisibility,
  changeFormOrModalVisibility,
  EmailContext,
} from "../../../../util.ts";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../selectors/CategorySelector.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";

interface ExpenseUpdatingFormProps {
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  categoryOptions: SelectorOptionsFormattedData[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  currencySymbol: string;
}

/**
 * A form for updating an existing expense item.
 */
export default function ExpenseUpdatingForm({
  setExpenseFormVisibility,
  setExpenseArray,
  setBudgetArray,
  categoryOptions,
  oldExpenseBeingEdited,
  currencySymbol,
}: ExpenseUpdatingFormProps) {
  const [formData, setFormData] = useState<ExpenseUpdatingFormData>({
    category: oldExpenseBeingEdited.oldCategory,
    amount: oldExpenseBeingEdited.oldAmount,
    timestamp: oldExpenseBeingEdited.oldTimestamp,
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
    changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateExpenseVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    hideForm();

    const updatedExpenseItem = {
      ...formData,
      expenseId: uuid(),
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
    };

    expenseUpdatingMutation.mutate(updatedExpenseItem);

    // await handleExpenseUpdating(oldExpenseBeingEdited.expenseId, updatedExpenseItem);

    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
      timestamp: oldExpenseBeingEdited.oldTimestamp,
    });
    getExpenseList().then((expenseList) => setExpenseArray(expenseList));

    // To update budgetArray if new category is made:
    getBudgetList().then((budgetList) => setBudgetArray(budgetList));
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

        <div>
          <label htmlFor="timestamp">Date</label>
          <div className={"text-black"}>
            <DatePicker onChange={onDateInputChange} value={formData.timestamp} />
          </div>
        </div>

        <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
      </form>
    </div>
  );
}
