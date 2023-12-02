import '../css/App.css'
import ExpenseList from "./ExpenseList.tsx";
// import BudgetList from "./BudgetList.tsx";
import {useEffect, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../util.ts";
import DBInsertionForm from "./DBInsertionForm.tsx";
import DBDeletionForm from "./DBDeletionForm.tsx";
import DBUpdatingForm from "./DBUpdatingForm.tsx";

export default function App() {

    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    // const [budgetArray, setBudgetArray] = useState(tempStartBudgetList);

    useEffect( () => {
        async function fetchData() {
            const expenseList = await getExpenseList();
            setExpenseArray(expenseList)
        }
        fetchData();
    }, [])

    return (
        <>
            <ExpenseList expenseArray={expenseArray}/>
            {/*<BudgetList budgetArray={budgetArray} setBudgetArray={setBudgetArray}/>*/}
            <DBInsertionForm/>
            <DBDeletionForm/>
            <DBUpdatingForm/>
        </>
    )
}
