import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    getBudgetList,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    colourStyles,
    ExpenseUpdatingFormData,
    handleExpenseUpdating,
    getExpenseList,
    handleInputChangeOnFormWithAmount,
    PreviousExpenseBeingEdited, Value, ExpenseFormVisibility
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

interface ExpenseUpdatingFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldExpenseBeingEdited: PreviousExpenseBeingEdited;
    currencySymbol: string;
}

export default function ExpenseUpdatingForm({ setExpenseFormVisibility, setExpenseArray, setBudgetArray, categoryOptions, oldExpenseBeingEdited, currencySymbol }: ExpenseUpdatingFormProps) {


    const [formData, setFormData] = useState<ExpenseUpdatingFormData>({
        category: oldExpenseBeingEdited.oldCategory,
        amount: oldExpenseBeingEdited.oldAmount,
        timestamp: oldExpenseBeingEdited.oldTimestamp
    });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function hideForm() {
        setExpenseFormVisibility(current => ({...current, isUpdateExpenseVisible: false}));
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            hideForm();
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function handleCategoryInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, category: e.value }));
    }
    function onDateInputChange(newValue: Value) {
        console.log(new Date(newValue as Date).toLocaleDateString())
        setFormData(curr => ({ ...curr, timestamp: newValue }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        hideForm();

        await handleExpenseUpdating(oldExpenseBeingEdited.expenseId, formData);

        setFormData({
            category: oldExpenseBeingEdited.oldCategory,
            amount: oldExpenseBeingEdited.oldAmount,
            timestamp: oldExpenseBeingEdited.oldTimestamp
        });
        getExpenseList().then(expenseList => setExpenseArray(expenseList));

        // To update budgetArray if new category is made:
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
            <FulcrumButton onClick={() => {
                hideForm();
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 mt-4 font-bold text-4xl">Updating Expense</p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CreatableSelect
                    id="category"
                    name="category"
                    defaultValue={{
                        label: oldExpenseBeingEdited.oldCategory,
                        value: oldExpenseBeingEdited.oldCategory,
                        colour: categoryOptions.filter(categoryOption => (
                            categoryOption.label === oldExpenseBeingEdited.oldCategory
                        ))[0].colour
                    }}
                    options={categoryOptions.map(option => {
                        return {label: option.label, value: option.value, colour: option.colour!!}
                    })}
                    onChange={handleCategoryInputChange}
                    styles={colourStyles}
                    className="mb-3"
                    theme={(theme: any) => ({
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

                <div>
                    <label htmlFor="timestamp">Date</label>
                    <div className={"text-black"}>
                        <DatePicker onChange={onDateInputChange} value={formData.timestamp}/>
                    </div>
                </div>

                <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
            </form>
        </div>
    );
}
