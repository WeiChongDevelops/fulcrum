import {BudgetItemEntity} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";

interface GroupProps {
    groupName: String
    filteredBudgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
}

export default function Group({ groupName, filteredBudgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount }: GroupProps) {

    return (
        <div className="flex flex-col bg-amber-200 rounded-3xl my-10 p-5">
            <h1 className="mb-5">{groupName}</h1>
            <div className="flex flex-row">
                {filteredBudgetArray.map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
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