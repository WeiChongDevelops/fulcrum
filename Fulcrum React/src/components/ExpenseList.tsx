import {Dispatch, SetStateAction} from "react";
import {ExpenseItemEntity, tempStartExpenseList} from "../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";

interface ExpenseListProps {
    expenseArray: ExpenseItemEntity[]
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
}

export default function ExpenseList({expenseArray, setExpenseArray}: ExpenseListProps) {
    setExpenseArray(tempStartExpenseList) // Filler use of setExpenseArray

    const date = new Date();

    return(
        <>
            <h1>ExpenseList</h1>
            <ul>
            {expenseArray.map(expenseElement => {
                return <ExpenseItem expenseId={expenseElement.expenseId}
                                    userId={expenseElement.userId}
                                    categoryId={expenseElement.categoryId}
                                    amount={expenseElement.amount}
                                    timestamp={date}/>
            })}
            </ul>
        </>
    )
}