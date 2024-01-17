import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetButtonProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<{
        isCreateExpenseVisible: boolean,
        isUpdateExpenseVisible: boolean,
    }>>;
}

export default function AddNewExpenseButton({setExpenseFormVisibility}: AddNewBudgetButtonProps) {

    async function handleClick() {
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button onClick={handleClick} className="mt-3">
            <b>Create Expense</b>
        </button>
    )
}