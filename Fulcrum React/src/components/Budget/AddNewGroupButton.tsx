import {Dispatch, SetStateAction} from "react";

interface AddNewGroupButtonProps {
    setIsCreateGroupVisible: Dispatch<SetStateAction<boolean>>
}

export default function AddNewGroupButton({ setIsCreateGroupVisible }: AddNewGroupButtonProps) {

    async function handleClick() {
        setIsCreateGroupVisible(true)
    }

    return (
        <button onClick={handleClick}>
            New Group
        </button>
    )
}