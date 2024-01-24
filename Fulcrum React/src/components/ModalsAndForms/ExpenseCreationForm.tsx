import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    ExpenseCreationFormData,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    handleExpenseCreation, colourStyles, handleInputChangeOnFormWithAmount
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

    budgetArray: BudgetItemEntity[];

    categoryOptions: SelectorOptionsFormattedData[];
}

export default function ExpenseCreationForm( { setExpenseFormVisibility, setExpenseArray, setBudgetArray, budgetArray, categoryOptions }: ExpenseCreationFormProps) {

    const [formData, setFormData] = useState<ExpenseCreationFormData>({ category: "", amount: 0 });
    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));
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

        const newExpenseItem: ExpenseItemEntity = {
            expenseId: uuid(),
            category: formData.category,
            amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
            timestamp: new Date()
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
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));

        await handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItem);
        setFormData({ category: "", amount: 0 });
    }

    function handleCategoryInputChange(e: any) {
        setFormData((currentFormData: ExpenseCreationFormData) => ({ ...currentFormData, category: e.value }));
    }

    return (
        <div ref={formRef}  className="fulcrum-form fixed flex flex-col justify-center items-center rounded-3xl">
            <FulcrumButton onClick={() => {
                setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: false}));
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

                <FulcrumButton displayText="Insert Expense"/>
            </form>
        </div>
    )
}
