import FulcrumButton from "../other/FulcrumButton.tsx";
import {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react";
import {
    BudgetItemEntity,
    ExpenseCreationFormData,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    handleExpenseCreation,
    colourStyles,
    handleInputChangeOnFormWithAmount,
    handleRecurringExpenseCreation,
    RecurringExpenseItemEntity, recurringFrequencyOptions, Value, ExpenseFormVisibility, RecurringExpenseFormVisibility
} from "../../util.ts";
import { v4 as uuid } from "uuid";

import Select from 'react-select/creatable';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import CategorySelector from "../selectors/CategorySelector.tsx";


interface ExpenseCreationFormProps {
    setExpenseFormVisibility: (Dispatch<SetStateAction<ExpenseFormVisibility>> | Dispatch<SetStateAction<RecurringExpenseFormVisibility>>);
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>

    budgetArray: BudgetItemEntity[];

    categoryOptions: SelectorOptionsFormattedData[];

    currencySymbol: string;

    defaultCalendarDate: Date;

    mustBeRecurring: boolean;
}


export default function ExpenseCreationForm( { setExpenseFormVisibility, setExpenseArray, setBudgetArray, setRecurringExpenseArray, budgetArray, categoryOptions, currencySymbol, defaultCalendarDate, mustBeRecurring }: ExpenseCreationFormProps) {

    const [formData, setFormData] = useState<ExpenseCreationFormData>({
        category: "",
        amount: 0,
        timestamp: defaultCalendarDate,
        frequency: mustBeRecurring ? "monthly" : "never"
    });
    const formRef = useRef<HTMLDivElement>(null);

    function hideForm() {
        setExpenseFormVisibility((current: any) => ({...current, isCreateExpenseVisible: false}));
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            hideForm();
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        hideForm();

        const newExpenseItem: ExpenseItemEntity = {
            expenseId: uuid(),
            category: formData.category,
            amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
            timestamp: formData.timestamp as Date,
            recurringExpenseId: null
        }

        if (formData.frequency === "never") {
            if (budgetArray.map(budgetItem => budgetItem.category).includes(newExpenseItem.category)) {
                setExpenseArray(current => [newExpenseItem, ...current]);
            } else {
                const newDefaultBudgetItem: BudgetItemEntity = {
                    category: formData.category,
                    amount: 0,
                    iconPath: "/src/assets/category-icons/category-default-icon.svg",
                    group: "Miscellaneous",
                    timestamp: new Date(),
                }
                setBudgetArray(current => [...current, newDefaultBudgetItem]);
            }
            await handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItem);
        } else {
            const newRecurringExpenseItem: RecurringExpenseItemEntity = {
                recurringExpenseId: uuid(),
                category: formData.category,
                amount: formData.amount ? parseFloat(String(formData.amount)): 0,
                timestamp: formData.timestamp as Date,
                frequency: formData.frequency
            }
            await handleRecurringExpenseCreation(newRecurringExpenseItem, setRecurringExpenseArray);
        }
        setFormData({
            category: "",
            amount: 0,
            timestamp: defaultCalendarDate,
            frequency: mustBeRecurring ? "monthly" : "never"
        });
    }

    function handleFrequencyInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, frequency: e.value }));
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function onDateInputChange(newValue: Value) {
        console.log(new Date(newValue as Date).toLocaleDateString())
        setFormData(curr => ({ ...curr, timestamp: newValue }));
    }

    return (
        <div ref={formRef}  className="fulcrum-form fixed flex flex-col justify-center items-center rounded-3xl">
            <FulcrumButton onClick={() => {
                hideForm();
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 mt-4 font-bold text-4xl">New {mustBeRecurring && "Recurring "}Expense</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CategorySelector categoryOptions={categoryOptions} setFormData={setFormData}/>

                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">{currencySymbol}</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount === 0 ? "" : formData.amount}
                           name="amount"
                           id="amount"
                           className="mb-3 text-black"
                           required/>
                </div>

                <label htmlFor="timestamp">Date</label>
                <div className={"text-black"}>
                    <DatePicker onChange={onDateInputChange} value={formData.timestamp}/>
                </div>

                <label htmlFor="frequency">Repeat Frequency</label>
                <Select
                    id="frequency"
                    name="frequency"
                    defaultValue={{
                        label: mustBeRecurring ? "Monthly" : "Never",
                        value: mustBeRecurring ? "monthly" : "never",
                        colour: "black"
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
                            primary: "rgba(34,237,34,0.18)"
                        },
                    })}
                    required
                />

                <FulcrumButton displayText={`Insert ${mustBeRecurring ? "Recurring " : ""}Expense`} optionalTailwind={"mt-6"}/>
            </form>
        </div>
    )
}
