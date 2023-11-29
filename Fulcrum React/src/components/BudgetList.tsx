import ExpenseItem from "./BudgetItem.tsx";
import {Dispatch, SetStateAction} from "react";
import {GenericItemList, tempStartBudgetList} from "../util.ts";

interface BudgetListProps {
    budgetArray: GenericItemList[]
    setBudgetArray: Dispatch<SetStateAction<GenericItemList[]>>
}

export default function ExpenseList({budgetArray, setBudgetArray}: BudgetListProps) {
    setBudgetArray(tempStartBudgetList) // Filler use of setBudgetArray
    return(
        <>
            <h1>BudgetList</h1>
            <ul>
                {budgetArray.map(budgetElement => {
                    return <ExpenseItem category={budgetElement.category}
                                        categoryId={budgetElement.categoryId}
                                        amount={budgetElement.amount}/>
                })}
            </ul>
        </>
    )
}