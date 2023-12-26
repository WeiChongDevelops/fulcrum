import {Dispatch, SetStateAction} from "react";
import {BudgetFormVisibilityState} from "../../util.ts";

interface AddNewGroupButtonProps {
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;
}

export default function AddNewGroupButton({ setBudgetFormVisibility }: AddNewGroupButtonProps) {

    async function handleClick() {
        setBudgetFormVisibility(current => ({...current, isCreateGroupVisible: true}))
    }

    return (
        <button className="create-group-button rounded-3xl mb-8" onClick={handleClick}>
            New Group
        </button>
    )
}