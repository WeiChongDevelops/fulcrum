import {BudgetItemEntity} from "../../util.ts";
import BudgetItem from "./BudgetItem.tsx";

interface BudgetListProps {
    budgetArray: BudgetItemEntity[]
}

export default function BudgetList({budgetArray}: BudgetListProps) {

    return(
        <>
            <h1>BudgetList</h1>
            <ul>
            {budgetArray?.map((budgetElement, key) => {
                return <BudgetItem category={budgetElement.category}
                                   amount={budgetElement.amount}
                                    key={key}/>
            })}
            </ul>
        </>
    )
}