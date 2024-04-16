import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  changeFormOrModalVisibility,
  addFormExitListeners,
  handleInputChangeOnFormWithAmount,
} from "../../../../utility/util.ts";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../selectors/CategorySelector.tsx";
import useUpdateExpense from "../../../../hooks/mutations/expense/useUpdateExpense.ts";
import {
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  SelectorOptionsFormattedData,
  SetFormVisibility,
  Value,
} from "../../../../utility/types.ts";
interface ExpenseUpdatingFormProps {
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  categoryOptions: SelectorOptionsFormattedData[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  currencySymbol: string;
}

/**
 * A form for updating an existing expense item.
 */
export default function ExpenseUpdatingForm({
  setExpenseFormVisibility,
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
  const { mutate: updateExpense } = useUpdateExpense();

  function hideForm() {
    changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateExpenseVisible", false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    return () => {
      removeFormExitEventListeners();
    };
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
      timestamp: oldExpenseBeingEdited.oldTimestamp,
    });

    const updatedExpenseItem: ExpenseItemEntity = {
      ...formData,
      amount: formData.amount,
      expenseId: oldExpenseBeingEdited.expenseId,
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
    };
    updateExpense(updatedExpenseItem);
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
            autoComplete={"off"}
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
