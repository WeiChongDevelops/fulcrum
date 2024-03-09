import FulcrumButton from "../../other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    BudgetItemEntity,
    getBudgetList,
    ExpenseItemEntity,
    SelectorOptionsFormattedData,
    ExpenseUpdatingFormData,
    handleExpenseUpdating,
    getExpenseList,
    handleInputChangeOnFormWithAmount,
    PreviousExpenseBeingEdited, Value, ExpenseFormVisibility
} from "../../../util.ts";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import CategorySelector from "../../selectors/CategorySelector.tsx";

interface ExpenseUpdatingFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldExpenseBeingEdited: PreviousExpenseBeingEdited;
    currencySymbol: string;
}

/**
 * A form for updating an existing expense item.
 */
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

    function onDateInputChange(newValue: Value) {
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
        <div ref={formRef} className="fulcrum-form justify-start items-center">
            <FulcrumButton onClick={() => {
                hideForm();
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 mt-4 font-bold text-4xl">Updating Expense</p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <CategorySelector categoryOptions={categoryOptions} oldExpenseBeingEdited={oldExpenseBeingEdited} setFormData={setFormData}/>

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
