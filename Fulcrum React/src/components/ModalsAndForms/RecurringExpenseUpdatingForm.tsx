import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    getBudgetList,
    SelectorOptionsFormattedData,
    colourStyles,
    handleExpenseUpdating,
    getExpenseList,
    handleInputChangeOnFormWithAmount,
    RecurringExpenseItemEntity, PreviousRecurringExpenseBeingEdited, RecurringExpenseUpdatingFormData
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';

interface RecurringExpenseUpdatingFormProps {
    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<{
        isUpdateRecurringExpenseVisible: boolean,
    }>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
}

export default function RecurringExpenseUpdatingForm({ setRecurringExpenseFormVisibility, setRecurringExpenseArray, setBudgetArray, categoryOptions, oldRecurringExpenseBeingEdited }: RecurringExpenseUpdatingFormProps) {


    const [formData, setFormData] = useState<RecurringExpenseUpdatingFormData>({
        category: oldRecurringExpenseBeingEdited.oldCategory, amount: oldRecurringExpenseBeingEdited.oldAmount, frequency: oldRecurringExpenseBeingEdited.oldFrequency
    });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setRecurringExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseVisible: false}))
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function handleCategoryInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, category: e.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setRecurringExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseVisible: false}))

        await handleExpenseUpdating(oldRecurringExpenseBeingEdited.recurringExpenseId, formData);

        setFormData({
            category: oldRecurringExpenseBeingEdited.oldCategory, amount: oldRecurringExpenseBeingEdited.oldAmount, frequency: oldRecurringExpenseBeingEdited.oldFrequency
        });
        getExpenseList().then(expenseList => setRecurringExpenseArray(expenseList));

        // To update budgetArray if new category is made:
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
            <FulcrumButton onClick={() => {
                setRecurringExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseVisible: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 font-bold text-4xl">Updating Expense</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CreatableSelect
                    id="category"
                    name="category"
                    defaultValue={{
                        label: oldRecurringExpenseBeingEdited.oldCategory,
                        value: oldRecurringExpenseBeingEdited.oldCategory,
                        colour: categoryOptions.filter(categoryOption => (
                            categoryOption.label === oldRecurringExpenseBeingEdited.oldCategory
                        ))[0].colour
                    }}
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
                            primary25: "#f1f3f1",
                            primary: "#808080"
                        },
                    })}
                    required
                />

                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">$</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount ?? ""}
                           name="amount"
                           id="amount"
                           className="mb-3"
                           required
                    />
                </div>

                <FulcrumButton displayText="Update Budget" />
            </form>
        </div>
    );
}