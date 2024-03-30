import FulcrumButton from "../../../other/FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ExpenseItemEntity,
  getExpenseList,
  handleInputChangeOnFormWithAmount,
  PreviousExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  handleRecurringExpenseInstanceUpdating,
  ExpenseFormVisibility,
  SelectorOptionsFormattedData,
  handleBlacklistedExpenseCreation,
  BlacklistedExpenseItemEntity,
  SetFormVisibility,
  getBlacklistedExpenses,
  changeFormOrModalVisibility,
} from "../../../../../util.ts";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../../selectors/CategorySelector.tsx";

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

    await handleRecurringExpenseInstanceUpdating(oldExpenseBeingEdited.expenseId, formData);
    await handleBlacklistedExpenseCreation(oldExpenseBeingEdited.recurringExpenseId, oldExpenseBeingEdited.oldTimestamp);
    setBlacklistedExpenseArray(await getBlacklistedExpenses());

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
