import FulcrumButton from "../other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    ExpenseItemEntity,
    getExpenseList,
    handleInputChangeOnFormWithAmount,
    PreviousExpenseBeingEdited,
    RecurringExpenseInstanceUpdatingFormData,
    handleRecurringExpenseInstanceUpdating,
    ExpenseFormVisibility,
    SelectorOptionsFormattedData,
    handleRemovedRecurringExpenseCreation,
    RemovedRecurringExpenseItem
} from "../../util.ts";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import CategorySelector from "../selectors/CategorySelector.tsx";

interface RecurringExpenseInstanceUpdatingFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldExpenseBeingEdited: PreviousExpenseBeingEdited;
    currencySymbol: string;
    setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItem[]>>
}

/**
 * A form for updating an existing recurring expense instance in the expense database.
 */
export default function RecurringExpenseInstanceUpdatingForm({ setExpenseFormVisibility, setExpenseArray, categoryOptions, oldExpenseBeingEdited, currencySymbol, setRemovedRecurringExpenseInstances }: RecurringExpenseInstanceUpdatingFormProps) {


    const [formData, setFormData] = useState<RecurringExpenseInstanceUpdatingFormData>({
        category: oldExpenseBeingEdited.oldCategory,
        amount: oldExpenseBeingEdited.oldAmount,
    });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function hideForm() {
        setExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseInstanceVisible: false}));
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            hideForm();
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        hideForm();

        await handleRecurringExpenseInstanceUpdating(oldExpenseBeingEdited.expenseId, formData);
        await handleRemovedRecurringExpenseCreation(oldExpenseBeingEdited.recurringExpenseId, oldExpenseBeingEdited.oldTimestamp, setRemovedRecurringExpenseInstances)

        setFormData({
            category: oldExpenseBeingEdited.oldCategory,
            amount: oldExpenseBeingEdited.oldAmount,
        });
        getExpenseList().then(expenseList => setExpenseArray(expenseList));
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

                <div className={"mt-2 text-sm"}>
                    <p>You are editing only this instance of your recurring expense.</p>
                    <p>To manage your recurring expenses, please see the Tools section.</p>
                </div>

                <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
            </form>
        </div>
    );
}
