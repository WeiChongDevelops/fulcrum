import FulcrumButton from "../Other/FulcrumButton.tsx";
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
    RecurringExpenseItemEntity, recurringFrequencyOptions
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import { v4 as uuid } from "uuid";
import { components } from "react-select";
import { InputProps } from "react-select";

import Select from 'react-select/creatable';


interface ExpenseCreationFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<{
        isCreateExpenseVisible: boolean,
        isUpdateExpenseVisible: boolean,
    }>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>

    budgetArray: BudgetItemEntity[];

    categoryOptions: SelectorOptionsFormattedData[];
}

export default function ExpenseCreationForm( { setExpenseFormVisibility, setExpenseArray, setBudgetArray, setRecurringExpenseArray, budgetArray, categoryOptions }: ExpenseCreationFormProps) {

    const [formData, setFormData] = useState<ExpenseCreationFormData>({ category: "", amount: 0, frequency: "never" });
    const formRef = useRef<HTMLDivElement>(null);

    function hideForm() {
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));
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

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
            handleInputChangeOnFormWithAmount(e, setFormData);
    }
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        hideForm();

        if (formData.frequency === "never") {
            const newExpenseItem: ExpenseItemEntity = {
                expenseId: uuid(),
                category: formData.category,
                amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
                timestamp: new Date(),
                recurringExpenseId: null
            }

            if (budgetArray.map(budgetItem => budgetItem.category).includes(newExpenseItem.category)) {
                setExpenseArray(current => [newExpenseItem, ...current])
            } else {
                const newDefaultBudgetItem: BudgetItemEntity = {
                    category: formData.category,
                    amount: 0,
                    iconPath: "/src/assets/category-icons/category-default-icon.svg",
                    group: "Miscellaneous",
                    timestamp: new Date()
                }
                setBudgetArray(current => [...current, newDefaultBudgetItem])
                setExpenseArray(current => [newExpenseItem, ...current])
            }
            await handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItem);
        } else {
            const newRecurringExpenseItem: RecurringExpenseItemEntity = {
                recurringExpenseId: uuid(),
                category: formData.category,
                amount: formData.amount ? parseFloat(String(formData.amount)): 0,
                timestamp: new Date(),
                frequency: formData.frequency
            }

            await handleRecurringExpenseCreation(newRecurringExpenseItem, setRecurringExpenseArray);
        }
        setFormData({ category: "", amount: 0, frequency: "never" });
    }

    function handleCategoryInputChange(e: any) {
        setFormData((currentFormData: ExpenseCreationFormData) => ({ ...currentFormData, category: e.value }));
    }

    function handleFrequencyInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, frequency: e.value }));
    }

    const MaxLengthInput: any = (props: InputProps) => {
        return <components.Input {...props} maxLength={18} />;
    };

    return (
        <div ref={formRef}  className="fulcrum-form fixed flex flex-col justify-center items-center rounded-3xl">
            <FulcrumButton onClick={() => {
                hideForm();
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 font-bold text-4xl">New Expense Item</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CreatableSelect
                    id="category"
                    name="category"
                    options={categoryOptions.map(option => {
                        return {label: option.label, value: option.value, colour: option.colour!!}
                    })}
                    components={{Input: MaxLengthInput}}
                    onChange={handleCategoryInputChange}
                    styles={colourStyles}
                    className="mb-3"
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: "#f1f3f1",
                            primary: "#808080"
                        },
                    })}
                    placeholder="Select from dropdown/start typing to create..."

                    required
                />
                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">$</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount === 0 ? "" : formData.amount}
                           name="amount"
                           id="amount"
                           className="mb-3 text-black"
                           required/>
                </div>


                <label htmlFor="frequency">Repeat Frequency</label>
                <Select
                    id="frequency"
                    name="frequency"
                    defaultValue={{
                        label: "Never",
                        value: "never",
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
                            primary25: "#f1f3f1",
                            primary: "#808080"
                        },
                    })}
                    required
                />

                <FulcrumButton displayText="Insert Expense"/>
            </form>
        </div>
    )
}
