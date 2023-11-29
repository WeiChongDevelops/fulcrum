import ExpenseItem from "./BudgetItem.tsx";
import {Dispatch, SetStateAction} from "react";
import {GenericItemList, tempStartExpenseList} from "../util.ts";

interface ExpenseListProps {
    expenseArray: GenericItemList[]
    setExpenseArray: Dispatch<SetStateAction<GenericItemList[]>>
}

export default function ExpenseList({expenseArray, setExpenseArray}: ExpenseListProps) {
    setExpenseArray(tempStartExpenseList) // Filler use of setExpenseArray
    return(
        <>
            <h1>ExpenseList</h1>
            <ul>
            {expenseArray.map(expenseElement => {
                return <ExpenseItem category={expenseElement.category}
                                    categoryId={expenseElement.categoryId}
                                    amount={expenseElement.amount}/>
            })}
            </ul>
        </>
    )
}