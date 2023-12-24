import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetToGroupButtonProps {
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>
    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>
    groupNameOfNewItem: string;
}

export default function AddNewBudgetToGroupButton({ setIsCreateBudgetVisible, setGroupNameOfNewItem, groupNameOfNewItem}: AddNewBudgetToGroupButtonProps) {

    function handleClick() {
        setIsCreateBudgetVisible(true)
        setGroupNameOfNewItem(groupNameOfNewItem)
    }

    return (
        <button className="addBudgetButton" onClick={handleClick}>
            <b>+</b>
        </button>
    )
}