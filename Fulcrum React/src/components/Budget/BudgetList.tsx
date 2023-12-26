import { BudgetItemEntity } from "../../util.ts";
import BudgetItem from "./BudgetItem.tsx";
import { Dispatch, SetStateAction } from "react";

interface BudgetListProps {
    budgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
}

export default function BudgetList({ budgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount}: BudgetListProps) {
    return (
        <div>
            <div>
                {budgetArray.map((budgetElement, key) => (
                    <BudgetItem
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        group={budgetElement.group}
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
