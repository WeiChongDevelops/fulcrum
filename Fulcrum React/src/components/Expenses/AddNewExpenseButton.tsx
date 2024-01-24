import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetButtonProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<{
        isCreateExpenseVisible: boolean,
        isUpdateExpenseVisible: boolean,
    }>>;
}

export default function AddNewExpenseButton({ setExpenseFormVisibility }: AddNewBudgetButtonProps) {

    async function handleClick() {
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button className="create-expense-button rounded-2xl mt-4 w-[95vw]" onClick={handleClick}>
            <p className="text-2xl font-bold">+</p>
        </button>
    )
}