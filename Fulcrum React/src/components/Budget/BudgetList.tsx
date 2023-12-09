import {BudgetItemEntity} from "../../util.ts";
import BudgetItem from "./BudgetItem.tsx";
import {Dispatch, SetStateAction} from "react";

interface BudgetListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
}

export default function BudgetList({budgetArray, setBudgetArray}: BudgetListProps) {

    return(
        <>
            <h1>BudgetList</h1>
            <div>
            {budgetArray?.map((budgetElement, key) => {
                return <BudgetItem category={budgetElement.category}
                                   amount={budgetElement.amount}
                                   icon="/src/assets/icons/construction-icon.svg"
                                   setBudgetArray={setBudgetArray}
                                   key={key}/>
            })}
            </div>
        </>
    )
}