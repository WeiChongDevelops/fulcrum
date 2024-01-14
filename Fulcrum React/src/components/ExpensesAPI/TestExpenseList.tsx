import {ExpenseItemEntity} from "../../util.ts";
import TestExpenseItem from "./TestExpenseItem.tsx";

interface ExpenseListProps {
    expenseArray: ExpenseItemEntity[]
}

export default function TestExpenseList({expenseArray}: ExpenseListProps) {

    return(
        <>
            <h1>ExpenseList</h1>
            <ul>
            {expenseArray?.map((expenseElement, key) => {
                return <TestExpenseItem expenseId={expenseElement.expenseId}
                                        category={expenseElement.category}
                                        amount={expenseElement.amount}
                                        timestamp={expenseElement.timestamp}
                                        key={key}/>
            })}
            </ul>
        </>
    )
}