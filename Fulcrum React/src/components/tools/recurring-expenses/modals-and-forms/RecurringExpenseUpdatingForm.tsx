import FulcrumButton from "../../../other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    getBudgetList,
    SelectorOptionsFormattedData,
    colourStyles,
    handleInputChangeOnFormWithAmount,
    RecurringExpenseItemEntity,
    PreviousRecurringExpenseBeingEdited,
    RecurringExpenseUpdatingFormData,
    recurringFrequencyOptions,
    capitaliseFirstLetter,
    handleRecurringExpenseUpdating,
    getRecurringExpenseList,
    RecurringExpenseFormVisibility, Value,
} from "../../../../util.ts";
import Select from 'react-select/creatable';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import CategorySelector from "../../../selectors/CategorySelector.tsx";

interface RecurringExpenseUpdatingFormProps {
    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;

    currencySymbol: string;
}

/**
 * A form for updating an existing recurring expense entry.
 */
export default function RecurringExpenseUpdatingForm({ setRecurringExpenseFormVisibility, setRecurringExpenseArray, setBudgetArray, categoryOptions, oldRecurringExpenseBeingEdited, currencySymbol }: RecurringExpenseUpdatingFormProps) {

    const [formData, setFormData] = useState<RecurringExpenseUpdatingFormData>({
        category: oldRecurringExpenseBeingEdited.oldCategory,
        amount: oldRecurringExpenseBeingEdited.oldAmount,
        timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
        frequency: oldRecurringExpenseBeingEdited.oldFrequency
    });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function hideForm() {
        setRecurringExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseVisible: false}))
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            hideForm();
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function handleFrequencyInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, frequency: e.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        hideForm();

        await handleRecurringExpenseUpdating(oldRecurringExpenseBeingEdited.recurringExpenseId, formData);

        setFormData({
            category: oldRecurringExpenseBeingEdited.oldCategory,
            amount: oldRecurringExpenseBeingEdited.oldAmount,
            timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
            frequency: oldRecurringExpenseBeingEdited.oldFrequency
        });
        getRecurringExpenseList().then(expenseList => setRecurringExpenseArray(expenseList));

        // To update budgetArray if new category is made:
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    function onDateInputChange(newValue: Value) {
        setFormData(curr => ({ ...curr, timestamp: newValue }));
    }

    return (
        <div ref={formRef} className="fulcrum-form justify-start items-center">
            <FulcrumButton onClick={() => {
                hideForm();
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 mt-4 font-bold text-4xl">Updating Expense</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CategorySelector categoryOptions={categoryOptions} oldExpenseBeingEdited={oldRecurringExpenseBeingEdited} setFormData={setFormData}/>


                <label htmlFor="timestamp">Date</label>
                <div className={"text-black"}>
                    <DatePicker onChange={onDateInputChange} value={formData.timestamp}/>
                </div>

                <label htmlFor="frequency">Frequency</label>
                <Select
                    id="frequency"
                    name="frequency"
                    defaultValue={{
                        label: capitaliseFirstLetter(oldRecurringExpenseBeingEdited.oldFrequency),
                        value: oldRecurringExpenseBeingEdited.oldFrequency as String,
                        colour: "black"
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
                            primary: "rgba(34,237,34,0.18)"
                        },
                    })}
                    required
                />

                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">{currencySymbol}</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount ?? ""}
                           name="amount"
                           id="amount"
                           className="mb-3"
                           required
                    />
                </div>

                <FulcrumButton displayText="Update Budget" optionalTailwind={"mt-8"}/>
            </form>
        </div>
    );
}
