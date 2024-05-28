import FulcrumButton from "../../../buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  changeFormOrModalVisibility,
  addFormExitListeners,
  handleInputChangeOnFormWithAmount,
  LocationContext,
  useLocation,
} from "../../../../../utility/util.ts";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../../selectors/CategorySelector.tsx";
import useUpdateExpense from "../../../../../hooks/mutations/expense/useUpdateExpense.ts";
import {
  ExpenseFormVisibility,
  ExpenseItemEntity,
  PreviousExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  DropdownSelectorOption,
  SetFormVisibility,
} from "../../../../../utility/types.ts";

interface RecurringExpenseInstanceUpdatingFormProps {
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  categoryOptions: DropdownSelectorOption[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  currencySymbol: string;
}

/**
 * A form for updating an existing recurring expense instance in the expense database.
 */
export default function RecurringExpenseInstanceUpdatingForm({
  setExpenseFormVisibility,
  categoryOptions,
  oldExpenseBeingEdited,
  currencySymbol,
}: RecurringExpenseInstanceUpdatingFormProps) {
  const [formData, setFormData] = useState<RecurringExpenseInstanceUpdatingFormData>({
    category: oldExpenseBeingEdited.oldCategory,
    amount: oldExpenseBeingEdited.oldAmount,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateExpense } = useUpdateExpense();
  const routerLocation = useLocation();

  function hideForm() {
    changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateRecurringExpenseInstanceVisible", false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    return () => {
      removeFormExitEventListeners();
    };
  }, [routerLocation]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
    });

    const noChangesMade =
      formData.category === oldExpenseBeingEdited.oldCategory && formData.amount === oldExpenseBeingEdited.oldAmount;

    const updatedExpenseItem: ExpenseItemEntity = {
      expenseId: oldExpenseBeingEdited.expenseId,
      category: formData.category,
      amount: formData.amount,
      timestamp: oldExpenseBeingEdited.oldTimestamp,
      recurringExpenseId: noChangesMade ? oldExpenseBeingEdited.recurringExpenseId : null,
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
            type="number"
            onChange={handleInputChange}
            value={formData.amount ?? ""}
            name="amount"
            id="amount"
            className="mb-3"
            autoComplete={"off"}
            required
          />
        </div>

        <div className={"mt-2 text-sm"}>
          <p className={"mb-2"}>You are only editing this particular repeat of your recurring expense.</p>
          <p>To manage your recurring expenses further, please see the 'Tools' section.</p>
        </div>

        <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
      </form>
    </div>
  );
}
