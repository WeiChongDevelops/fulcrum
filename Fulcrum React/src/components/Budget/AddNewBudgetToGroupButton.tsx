import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetToGroupButtonProps {
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>
    setGroupOfNewItem: Dispatch<SetStateAction<string>>
    clickedGroup: string;
}

export default function AddNewBudgetToGroupButton({ setIsCreateBudgetVisible, setGroupOfNewItem, clickedGroup }: AddNewBudgetToGroupButtonProps) {

    function handleClick() {
        setIsCreateBudgetVisible(true)
        setGroupOfNewItem(clickedGroup)
    }

    return (
        <button className="addBudgetButton" onClick={handleClick}>
            <b>+</b>
        </button>
    )
}