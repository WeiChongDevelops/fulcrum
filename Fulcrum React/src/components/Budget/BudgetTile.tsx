import '/src/css/Budget.css';
import {BudgetFormVisibilityState, BudgetItemEntity, formatNumberWithCommas, handleBudgetDeletion} from "../../util.ts";
import React, {Dispatch, SetStateAction} from "react";

interface BudgetTileProps {
    category: string;
    amount: number;
    group: string;
    icon: string;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;
}

export default function BudgetTile({ category,
                                       amount,
                                       group,
                                       icon,
                                       setBudgetArray,
                                       setOldBudgetBeingEdited,
                                       setBudgetFormVisibility}: BudgetTileProps) {



    function handleEditClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setOldBudgetBeingEdited({
            oldCategory: category,
            oldAmount: amount,
            oldGroup: group
        })

        // setIsUpdateBudgetVisible(true);
        setBudgetFormVisibility( current => ({...current, isUpdateBudgetVisible: true}))
    }


    const tempHardCodedColour = "red"

    function handleDeleteClick() {
        handleBudgetDeletion(category, setBudgetArray)
            .then((response) => console.log("Deletion successful", response))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div className="box-shadow budget-tile flex flex-col justify-center items-center rounded-2xl"
             style={{backgroundColor: `${tempHardCodedColour}`}}>
            <div className="flex justify-center items-center rounded-full bg-green-950 p-4 w-20 h-20">
                <img className="budget-icon" src={icon} alt="" />
            </div>
            <b className="budget-name">{category}</b>

            <div className="flex flex-row items-center">
                <b>${formatNumberWithCommas(amount.toFixed(2))}</b>
            </div>
            <div className="flex flex-row mt-2">
                <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                    <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
                </div>
                <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                    <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
