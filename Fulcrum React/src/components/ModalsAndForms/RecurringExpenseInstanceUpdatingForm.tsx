import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    ExpenseItemEntity,
    getExpenseList,
    handleInputChangeOnFormWithAmount,
    PreviousExpenseBeingEdited,
    RecurringExpenseInstanceUpdatingFormData,
    handleRecurringExpenseInstanceUpdating,
    ExpenseFormVisibility,
    colourStyles,
    SelectorOptionsFormattedData,
    handleRemovedRecurringExpenseCreation,
    RemovedRecurringExpenseItem
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

interface RecurringExpenseInstanceUpdatingFormProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    categoryOptions: SelectorOptionsFormattedData[];
    oldExpenseBeingEdited: PreviousExpenseBeingEdited;
    currencySymbol: string;
    setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItem[]>>
}

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

    function handleCategoryInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, category: e.value }));
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

                <div className={"mt-2 text-sm"}>
                    <p>You are editing only this instance of your recurring expense.</p>
                    <p>To manage your recurring expenses, please see the Tools section.</p>
                </div>

                <FulcrumButton displayText="Update Expense" optionalTailwind={"mt-8"} />
            </form>
        </div>
    );
}
