import ExpenseList from "./ExpenseList.tsx";
import ExpenseCreationForm from "./ExpenseCreationForm.tsx";
import ExpenseDeletionForm from "./ExpenseDeletionForm.tsx";
import ExpenseUpdatingForm from "./ExpenseUpdatingForm.tsx";
import {ExpenseItemEntity, getExpenseList} from "../../util.ts";
import {useEffect, useState} from "react";

export default function Expenses() {
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);


    useEffect( () => {
        async function fetchData() {
            const expenseList = await getExpenseList();
            setExpenseArray(expenseList)
        }
        fetchData();
    }, [])

    return (
        <div>
            <ExpenseList expenseArray={expenseArray}/>
            <ExpenseCreationForm setExpenseArray={setExpenseArray}/>
            <ExpenseDeletionForm setExpenseArray={setExpenseArray}/>
            <ExpenseUpdatingForm setExpenseArray={setExpenseArray}/>
        </div>
    )
}

