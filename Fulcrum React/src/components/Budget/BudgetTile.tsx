import '/src/css/Budget.css';
import {
    BudgetFormVisibility,
    BudgetModalVisibility, dynamicallySizeBudgetNumberDisplays, formatDollarAmountStatic,
    PreviousBudgetBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

interface BudgetTileProps {
    category: string;
    amount: number;
    group: string;
    icon: string;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>;

    perCategoryTotalExpenseArray: Map<string, number>

    setCategoryToDelete: Dispatch<SetStateAction<string>>;

}

export default function BudgetTile({ category,
                                       amount,
                                       group,
                                       icon,
                                       setOldBudgetBeingEdited,
                                       setBudgetFormVisibility,
                                       setModalFormVisibility,
                                       setCategoryToDelete,
                                       perCategoryTotalExpenseArray}: BudgetTileProps) {


    const spent = perCategoryTotalExpenseArray.get(category)!

    const [budgetExceeded, setBudgetExceeded] = useState(spent > amount);

    function handleEditClick() {
        setOldBudgetBeingEdited({
            oldCategory: category,
            oldAmount: amount,
            oldGroup: group
        })
        setBudgetFormVisibility( current => ({...current, isUpdateBudgetVisible: true}))
    }

    useEffect(() => {
        setBudgetExceeded(spent > amount);
        dynamicallySizeBudgetNumberDisplays();
    }, [amount, perCategoryTotalExpenseArray]);


    function handleDeleteClick() {
        setCategoryToDelete(category);
        setModalFormVisibility(current => ({...current, isConfirmCategoryDestructionModalVisible: true}))
    }


    return (
        <div className="budget-tile flex flex-col justify-around items-center rounded-2xl"
             style={{backgroundColor: `${budgetExceeded ? "#ff3f3f" : "#44b775"}`}}>
            <div className="tile-icon-container flex justify-center items-center p-2 w-12 h-16 mt-2">
                <img className="budget-tile-icon" src={icon} alt="" />
            </div>
            <div className="budget-name-container h-12 font-bold flex flex-col justify-center">
                <p className="budget-name">{category.toUpperCase()}</p>
            </div>
            <div className="budgeting-values-container flex flex-col break-words break-all text-sm font-semibold">
                <p>Spent: ${formatDollarAmountStatic(spent)} of ${formatDollarAmountStatic(amount)}</p>
                <p>Left: ${formatDollarAmountStatic(amount - spent)}</p>
            </div>
            <div className="flex flex-row mb-2">
                <button className="circle-button rounded-full p-1" onClick={handleEditClick}>
                    <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </button>
                <button className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                    <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
