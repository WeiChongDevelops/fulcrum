import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    ExpenseCreationFormData,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    handleExpenseCreation, colourStyles
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import { v4 as uuid } from "uuid";

interface ExpenseCreationFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<{
        isCreateExpenseVisible: boolean,
        isUpdateExpenseVisible: boolean,
    }>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    categoryOptions: SelectorOptionsFormattedData[];
}

export default function ExpenseCreationForm( { setExpenseFormVisibility, setExpenseArray, setBudgetArray, categoryOptions }: ExpenseCreationFormProps) {

    const [formData, setFormData] = useState<ExpenseCreationFormData>({ category: "", amount: 0 });
    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData( (currentFormData: ExpenseCreationFormData) => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newExpenseItem: ExpenseItemEntity = {
            expenseId: uuid(),
            category: formData.category,
            amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
            timestamp: new Date()
        }

        setExpenseArray(current => [...current, newExpenseItem])
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));

        await handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItem);
        setFormData({ category: "", amount: 0 });
    }

    function handleCategoryInputChange(e: any) {
        setFormData((currentFormData: ExpenseCreationFormData) => ({ ...currentFormData, category: e.value }));
    }

    return (
        <div ref={formRef}  className="budget-form fixed flex flex-col justify-center items-center rounded-3xl">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault()
                setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));
            }}>Close</button>

            <h1 className="mb-6">New Expense Item</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CreatableSelect
                    id="category"
                    name="category"
                    options={categoryOptions.map(option => {
                        return {label: option.label, value: option.value, colour: option.colour!!}
                    })}
                    onChange={handleCategoryInputChange}
                    styles={colourStyles}
                    className="mb-3"
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: '#262925',
                            primary: "black"
                        },
                    })}
                    required
                />
                <label htmlFor="amount">Amount</label>
                <input type="number"
                       onChange={handleInputChange}
                       value={formData.amount === 0 ? "" : formData.amount}
                       name="amount"
                       id="amount"
                       className="mb-3"
                       min={0.01}
                       step={0.01}
                       required/>

                <div id="icon-selector">
                    <button type="button" className="category-icon-selectable" data-value="category-bank-icon.svg">
                        <img src="/src/assets/category-icons/category-bank-icon.svg" alt="Bank"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-water-icon.svg">
                        <img src="/src/assets/category-icons/category-water-icon.svg" alt="Water"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-pig-icon.svg">
                        <img src="/src/assets/category-icons/category-pig-icon.svg" alt="Piggy Bank"/>
                    </button>
                </div>
                <input type="hidden" id="iconPath" name="iconPath" value="test"/>

                <FulcrumButton displayText="Insert Expense"/>
            </form>
        </div>
    )
}
