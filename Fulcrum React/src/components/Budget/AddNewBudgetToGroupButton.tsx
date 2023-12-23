import {Dispatch, SetStateAction} from "react";

interface AddNewBudgetToGroupButtonProps {
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>
    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>
    setGroupColourOfNewItem: Dispatch<SetStateAction<string>>
    groupNameOfNewItem: string;
    groupColourOfNewItem: string;
}

export default function AddNewBudgetToGroupButton({ setIsCreateBudgetVisible, setGroupNameOfNewItem, setGroupColourOfNewItem, groupNameOfNewItem, groupColourOfNewItem }: AddNewBudgetToGroupButtonProps) {

    function handleClick() {
        setIsCreateBudgetVisible(true)
        setGroupNameOfNewItem(groupNameOfNewItem)
        setGroupColourOfNewItem(groupColourOfNewItem)
    }

    return (
        <button className="addBudgetButton" onClick={handleClick}>
            <b>+</b>
        </button>
    )
}