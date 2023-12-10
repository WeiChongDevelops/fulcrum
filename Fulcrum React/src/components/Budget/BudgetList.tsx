import { BudgetItemEntity } from "../../util.ts";
import BudgetItem from "./BudgetItem.tsx";
import { Dispatch, SetStateAction } from "react";

interface BudgetListProps {
    budgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number | null>>;
}

export default function BudgetList({ budgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount}: BudgetListProps) {
    return (
        <div>
            <h1>BudgetList</h1>
            <div>
                {budgetArray.map((budgetElement, key) => (
                    <BudgetItem
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        // icon="/src/assets/icons/construction-icon.svg"
                        icon={budgetElement.iconPath}
                        setBudgetArray={setBudgetArray}
                        setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                        setEditingCategory={setEditingCategory}
                        setEditingOldAmount={setEditingOldAmount}
                        key={key}
                    />
                ))}
            </div>
        </div>
    );
}
