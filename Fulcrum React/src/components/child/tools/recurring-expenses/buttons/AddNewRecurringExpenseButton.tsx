import {Dispatch, SetStateAction} from "react";
import {RecurringExpenseFormVisibility} from "../../../../../util.ts";

interface AddNewRecurringExpenseButtonProps {
    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
    isDarkMode: boolean;
}

/**
 * A button that creates a new recurring expense.
 */
export default function AddNewRecurringExpenseButton({ setRecurringExpenseFormVisibility, isDarkMode }: AddNewRecurringExpenseButtonProps) {

    async function handleClick() {
        setRecurringExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button className={`create-expense-button ${isDarkMode && "create-expense-button-dark"}`} onClick={handleClick}>
            <p className="text-2xl font-bold">+</p>
        </button>
    )
}