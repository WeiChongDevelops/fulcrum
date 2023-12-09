import '/src/css/Budget.css';
import { BudgetItemEntity, handleDeletion } from "../../util.ts";
import React, { Dispatch, SetStateAction} from "react";

interface BudgetItemProps {
    category: string;
    amount: number;
    icon: string;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number | null>>;
}

export default function BudgetItem({ category, amount, icon, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount}: BudgetItemProps) {

    function handleEditClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        setIsUpdateBudgetVisible(true);
        setEditingCategory(category);
        setEditingOldAmount(amount);
    }

    function handleDeleteClick() {
        handleDeletion(category, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    const boxShadowStyle = {
        boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 1)"
    };

    return (
        <div className="flex flex-row justify-between items-center bg-blue-200 py-1.5 px-2.5 rounded-3xl my-3 text-black" style={boxShadowStyle}>
            <div className="flex flex-row items-center">
                <div className="rounded-full bg-green-950 p-2">
                    <img src={icon} alt="" />
                </div>
                <div className="flex flex-col items-start ml-2">
                    <b>{category}</b>
                    <h3>Parent Category Filler</h3>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <b>${amount.toFixed(2)}</b>
                <div className="flex flex-row items-center ml-2">
                    <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                        <img src="/src/assets/icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
                    </div>
                    <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                        <img src="/src/assets/icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
                    </div>
                </div>
            </div>

        </div>
    );
}
