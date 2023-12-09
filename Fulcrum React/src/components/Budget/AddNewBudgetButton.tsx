import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetButtonProps {
    setIsFormVisible: Dispatch<SetStateAction<boolean>>
}

export default function AddNewBudgetButton({setIsFormVisible}: AddNewBudgetButtonProps) {

    async function handleClick() {
        setIsFormVisible(true)
    }

    return (
        <button onClick={handleClick}>
            <b>+</b>
        </button>
    )
}