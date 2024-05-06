import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  recurringFrequencyOptions,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_GROUP,
  addFormExitListeners,
  handleInputChangeOnFormWithAmount,
  colourStyles,
  LocationContext,
} from "../../../../utility/util.ts";
import { v4 as uuid } from "uuid";
import Select from "react-select/creatable";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import CategorySelector from "../../selectors/CategorySelector.tsx";
import useCreateExpense from "../../../../hooks/mutations/expense/useCreateExpense.ts";
import useCreateRecurringExpense from "../../../../hooks/mutations/recurring-expense/useCreateRecurringExpense.ts";
import {
  BudgetItemEntity,
  ExpenseCreationFormData,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  SelectorOptionsFormattedData,
  SetFormVisibility,
  Value,
} from "../../../../utility/types.ts";

interface ExpenseCreationFormProps {
  setExpenseFormVisibility: SetFormVisibility<RecurringExpenseFormVisibility> | SetFormVisibility<ExpenseFormVisibility>;
  budgetArray: BudgetItemEntity[];
  categoryOptions: SelectorOptionsFormattedData[];
  currencySymbol: string;
  defaultCalendarDate: Date;
  mustBeRecurring: boolean;
}

/**
 * A form for creating a new expense item.
 */
export default function ExpenseCreationForm({
  setExpenseFormVisibility,
  budgetArray,
  categoryOptions,
  currencySymbol,
  defaultCalendarDate,
  mustBeRecurring,
}: ExpenseCreationFormProps) {
  const { mutate: createExpense } = useCreateExpense();
  const { mutate: createRecurringExpense } = useCreateRecurringExpense();
  const routerLocation = useContext(LocationContext);

  const [formData, setFormData] = useState<ExpenseCreationFormData>({
    category: "",
    amount: 0,
    timestamp: defaultCalendarDate,
    frequency: mustBeRecurring ? "monthly" : "never",
  });
  const formRef = useRef<HTMLDivElement>(null);

  function hideForm() {
    setExpenseFormVisibility((current: any) => ({
      ...current,
      isCreateExpenseVisible: false,
    }));
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    return () => {
      removeFormExitEventListeners();
    };
  }, [routerLocation]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: "",
      amount: 0,
      timestamp: defaultCalendarDate,
      frequency: mustBeRecurring ? "monthly" : "never",
    });
    let newDefaultBudgetItem: BudgetItemEntity | undefined = undefined;

    const newExpenseItem: ExpenseItemEntity = {
      expenseId: uuid(),
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
    };

    if (!budgetArray.map((budgetItem) => budgetItem.category).includes(newExpenseItem.category)) {
      newDefaultBudgetItem = {
        category: formData.category,
        amount: 0,
        iconPath: DEFAULT_CATEGORY_ICON,
        group: DEFAULT_CATEGORY_GROUP,
        timestamp: formData.timestamp as Date,
      };
    }

    if (formData.frequency === "never") {
      createExpense({
        newExpenseItem: newExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    } else {
      const newRecurringExpenseItem: RecurringExpenseItemEntity = {
        recurringExpenseId: uuid(),
        category: formData.category,
        amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
        timestamp: formData.timestamp as Date,
        frequency: formData.frequency,
      };
      createRecurringExpense({
        newRecurringExpenseItem: newRecurringExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    }
  }

  function handleFrequencyInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, frequency: e.value }));
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
  }

  return (
    <div ref={formRef} className="fulcrum-form justify-center items-center">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 mt-4 font-bold text-3xl">New {mustBeRecurring && "Recurring "}Expense</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category</label>
        <CategorySelector categoryOptions={categoryOptions} setFormData={setFormData} />

        <label htmlFor="amount">Amount</label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount === 0 ? "" : formData.amount}
            name="amount"
            id="amount"
            className="mb-3 text-black text-center"
            autoComplete={"off"}
            required
          />
        </div>

        <label htmlFor="timestamp">Date</label>
        <div className={"text-black"}>
          <DatePicker onChange={onDateInputChange} value={formData.timestamp} />
        </div>

        <label htmlFor="frequency" className={"mt-4"}>
          Repeat Frequency
        </label>
        <Select
          id="frequency"
          name="frequency"
          defaultValue={{
            label: mustBeRecurring ? "Monthly" : "Never",
            value: mustBeRecurring ? "monthly" : "never",
            colour: "black",
          }}
          options={mustBeRecurring ? recurringFrequencyOptions.slice(1) : recurringFrequencyOptions}
          onChange={handleFrequencyInputChange}
          styles={colourStyles}
          className="mb-3"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(201,223,201,0.1)",
              primary: "rgba(34,237,34,0.18)",
            },
          })}
          required
        />

        <FulcrumButton displayText={`Insert ${mustBeRecurring ? "Recurring " : ""}Expense`} optionalTailwind={"mt-6"} />
      </form>
    </div>
  );
}
