import {Dispatch, SetStateAction} from "react";
import {GenericItemList, tempStartExpenseList} from "../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";

interface ExpenseListProps {
    expenseArray: GenericItemList[]
    setExpenseArray: Dispatch<SetStateAction<GenericItemList[]>>
}

export default function ExpenseList({expenseArray, setExpenseArray}: ExpenseListProps) {
    setExpenseArray(tempStartExpenseList) // Filler use of setExpenseArray

    const date = new Date();

    return(
        <>
            <h1>ExpenseList</h1>
            <ul>
            {expenseArray.map(expenseElement => {
                return <ExpenseItem category={expenseElement.category}
                                    categoryId={expenseElement.categoryId}
                                    amount={expenseElement.amount}
                                    userId={0}
                                    timestamp={date}/>
            })}
            </ul>
        </>
    )
}