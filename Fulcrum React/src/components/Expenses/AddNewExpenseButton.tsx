import {Dispatch, SetStateAction} from "react";
import {ExpenseFormVisibility} from "../../util.ts";

interface AddNewBudgetButtonProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    isDarkMode: boolean;
}

export default function AddNewExpenseButton({ setExpenseFormVisibility, isDarkMode }: AddNewBudgetButtonProps) {

    async function handleClick() {
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button className={`create-expense-button ${isDarkMode && "create-expense-button-dark"} rounded-2xl mt-4 w-[95vw]`} onClick={handleClick}>
            <p className="text-2xl font-bold">+</p>
        </button>
    )
}