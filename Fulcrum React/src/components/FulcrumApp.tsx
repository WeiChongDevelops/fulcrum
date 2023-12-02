import '../css/App.css'
import ExpenseList from "./ExpenseList.tsx";
// import BudgetList from "./BudgetList.tsx";
import {useEffect, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../util.ts";
import DBInsertionForm from "./DBInsertionForm.tsx";
import DBDeletionForm from "./DBDeletionForm.tsx";
import DBUpdatingForm from "./DBUpdatingForm.tsx";

export default function FulcrumApp() {

    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);

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
                <DBInsertionForm setExpenseArray={setExpenseArray}/>
                <DBDeletionForm/>
                <DBUpdatingForm/>
        </>
    )
}
