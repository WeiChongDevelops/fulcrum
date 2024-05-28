import FulcrumButton from "../../../buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  changeFormOrModalVisibility,
  addFormExitListeners,
  handleInputChangeOnFormWithAmount,
  capitaliseFirstLetter,
  recurringFrequencyOptions,
  colourStyles,
  LocationContext,
  useLocation,
} from "../../../../../utility/util.ts";
import Select from "react-select";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../../selectors/CategorySelector.tsx";
import useUpdateRecurringExpense from "../../../../../hooks/mutations/recurring-expense/useUpdateRecurringExpense.ts";
import {
  PreviousRecurringExpenseBeingEdited,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  RecurringExpenseUpdatingFormData,
  DropdownSelectorOption,
  SetFormVisibility,
  Value,
} from "../../../../../utility/types.ts";

interface RecurringExpenseUpdatingFormProps {
  setRecurringExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility>;
  categoryOptions: DropdownSelectorOption[];
  oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
  currencySymbol: string;
}

/**
 * A form for updating an existing recurring expense entry.
 */
export default function RecurringExpenseUpdatingForm({
  setRecurringExpenseFormVisibility,
  categoryOptions,
  oldRecurringExpenseBeingEdited,
  currencySymbol,
}: RecurringExpenseUpdatingFormProps) {
  const [formData, setFormData] = useState<RecurringExpenseUpdatingFormData>({
    category: oldRecurringExpenseBeingEdited.oldCategory,
    amount: oldRecurringExpenseBeingEdited.oldAmount,
    timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
    frequency: oldRecurringExpenseBeingEdited.oldFrequency,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateRecurringExpense } = useUpdateRecurringExpense();
  const routerLocation = useLocation();

  function hideForm() {
    changeFormOrModalVisibility(setRecurringExpenseFormVisibility, "isUpdateRecurringExpenseVisible", false);
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

  function handleFrequencyInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, frequency: e.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    const updatedRecurringExpenseItem: RecurringExpenseItemEntity = {
      ...formData,
      recurringExpenseId: oldRecurringExpenseBeingEdited.recurringExpenseId,
      timestamp: formData.timestamp as Date,
    };
    updateRecurringExpense(updatedRecurringExpenseItem);

    setFormData({
      category: oldRecurringExpenseBeingEdited.oldCategory,
      amount: oldRecurringExpenseBeingEdited.oldAmount,
      timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
      frequency: oldRecurringExpenseBeingEdited.oldFrequency,
    });
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
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

      <p className="mb-6 mt-4 font-bold text-3xl">Updating Recurring Expense</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category</label>
        <CategorySelector
          categoryOptions={categoryOptions}
          oldExpenseBeingEdited={oldRecurringExpenseBeingEdited}
          setFormData={setFormData}
        />

        <label htmlFor="timestamp">Date</label>
        <div className={"text-black"}>
          <DatePicker onChange={onDateInputChange} value={formData.timestamp} />
        </div>

        <label htmlFor="frequency" className={"mt-4"}>
          Frequency
        </label>
        <Select
          id="frequency"
          name="frequency"
          defaultValue={{
            label: capitaliseFirstLetter(oldRecurringExpenseBeingEdited.oldFrequency),
            value: oldRecurringExpenseBeingEdited.oldFrequency as String,
            colour: "black",
          }}
          options={recurringFrequencyOptions}
          onChange={handleFrequencyInputChange}
          styles={colourStyles}
          className="mb-3"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(201,223,201,0.32)",
              primary: "rgba(34,237,34,0.18)",
            },
          })}
          required
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

        <FulcrumButton displayText="Update Budget" optionalTailwind={"mt-8"} />
      </form>
    </div>
  );
}
