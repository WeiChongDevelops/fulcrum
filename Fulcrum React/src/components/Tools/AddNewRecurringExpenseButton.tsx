import {Dispatch, SetStateAction} from "react";
import {RecurringExpenseFormVisibility} from "../../util.ts";

interface AddNewRecurringExpenseButtonProps {
    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
    isDarkMode: boolean;
}

export default function AddNewRecurringExpenseButton({ setRecurringExpenseFormVisibility, isDarkMode }: AddNewRecurringExpenseButtonProps) {

    async function handleClick() {
        setRecurringExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button className={`create-expense-button ${isDarkMode && "create-expense-button-dark"} rounded-2xl mt-4`} onClick={handleClick}>
            <p className="text-2xl font-bold">+</p>
        </button>
    )
}