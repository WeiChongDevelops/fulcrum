import {Dispatch, SetStateAction} from "react";
import {BudgetFormVisibility} from "../../util.ts";

interface AddNewBudgetToGroupButtonProps {
    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>
    groupNameOfNewItem: string;
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
}

export default function AddNewBudgetToGroupButton({ setGroupNameOfNewItem, groupNameOfNewItem, setBudgetFormVisibility }: AddNewBudgetToGroupButtonProps) {

    function handleClick() {
        setBudgetFormVisibility( current => ({...current, isCreateBudgetVisible: true}))
        setGroupNameOfNewItem(groupNameOfNewItem)
    }

    return (
        <button className="create-budget-button rounded-xl" onClick={handleClick}>
            <b>+</b>
        </button>
    )
}