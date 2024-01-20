import '/src/css/Budget.css';
import {
    BudgetFormVisibility,
    BudgetModalVisibility, formatDollarAmount,
    PreviousBudgetBeingEdited
} from "../../util.ts";
import React, {Dispatch, SetStateAction} from "react";

interface BudgetTileProps {
    category: string;
    amount: number;
    group: string;
    icon: string;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>;

    setCategoryToDelete: Dispatch<SetStateAction<string>>;

}

export default function BudgetTile({ category,
                                       amount,
                                       group,
                                       icon,
                                       setOldBudgetBeingEdited,
                                       setBudgetFormVisibility,
                                       setModalFormVisibility,
                                       setCategoryToDelete}: BudgetTileProps) {

    function handleEditClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setOldBudgetBeingEdited({
            oldCategory: category,
            oldAmount: amount,
            oldGroup: group
        })
        setBudgetFormVisibility( current => ({...current, isUpdateBudgetVisible: true}))
    }

    const tempHardCodedColour = "red"

    function handleDeleteClick() {
        setCategoryToDelete(category);
        setModalFormVisibility(current => ({...current, isConfirmCategoryDestructionModalVisible: true}))
    }

    return (
        <div className="budget-tile flex flex-col justify-center items-center rounded-2xl"
             style={{backgroundColor: `${tempHardCodedColour}`}}>
            <div className="flex justify-center items-center rounded-full bg-green-950 p-3 w-14 h-14">
                <img className="budget-icon" src={icon} alt="" />
            </div>
            <b className="budget-name">{category}</b>
            <b>${formatDollarAmount(amount)}</b>
            <div className="flex flex-row">
                <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                    <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </div>
                <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                    <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
