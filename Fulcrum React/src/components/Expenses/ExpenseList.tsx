import {ExpenseItemEntity} from "../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";

interface ExpenseListProps {
    expenseArray: ExpenseItemEntity[]
}

export default function ExpenseList({expenseArray}: ExpenseListProps) {

    return(
        <>
            <h1>ExpenseList</h1>
            <ul>
            {expenseArray?.map((expenseElement, key) => {
                return <ExpenseItem expenseId={expenseElement.expenseId}
                                    category={expenseElement.category}
                                    amount={expenseElement.amount}
                                    timestamp={expenseElement.timestamp}
                                    key={key}/>
            })}
            </ul>
        </>
    )
}