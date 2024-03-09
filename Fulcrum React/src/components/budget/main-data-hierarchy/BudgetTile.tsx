import '/src/css/Budget.css';
import {
    BudgetFormVisibility,
    BudgetModalVisibility, dynamicallySizeBudgetNumberDisplays, formatDollarAmountStatic,
    PreviousBudgetBeingEdited, PublicUserData
} from "../../../util.ts";
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

    publicUserData: PublicUserData;
}

/**
 * An individual interactive budget infographic tile in a category group.
 */
export default function BudgetTile({ category,
                                       amount,
                                       group,
                                       icon,
                                       setOldBudgetBeingEdited,
                                       setBudgetFormVisibility,
                                       setModalFormVisibility,
                                       setCategoryToDelete,
                                       perCategoryTotalExpenseArray,
                                       publicUserData}: BudgetTileProps) {

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

    function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        setCategoryToDelete(category);
        setModalFormVisibility(current => ({...current, isConfirmCategoryDestructionModalVisible: true}))
    }

    const currency = publicUserData.currency;

    return (
        <div className="budget-tile"
             style={{backgroundColor: `${budgetExceeded ? "#ff3f3f" : "#44b775"}`}}
             onClick={handleEditClick}>
            <div className="tile-icon-container">
                <img className="budget-tile-icon" src={`/src/assets/category-icons/${icon}`} alt="" />
            </div>
            <div className="budget-name-container">
                <p className="budget-name">{category.toUpperCase()}</p>
            </div>
            <div className="budgeting-values-container">
                <p>Spent: {formatDollarAmountStatic(spent, currency)} of {formatDollarAmountStatic(amount, currency)}</p>
                <p>Left: {formatDollarAmountStatic(amount - spent, currency)}</p>
            </div>
            <div className="flex flex-row mb-2">
                <button className="circle-button" onClick={handleEditClick}>
                    <img src="/src/assets/UI-icons/edit-pencil-white-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </button>
                <button className="circle-button" onClick={handleDeleteClick}>
                    <img src="/src/assets/UI-icons/delete-trash-white-icon.svg" alt="" className="mx-1 w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
