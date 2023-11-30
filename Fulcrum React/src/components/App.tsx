import '../css/App.css'
import ExpenseList from "./ExpenseList.tsx";
// import BudgetList from "./BudgetList.tsx";
import {useState} from "react";
import {tempStartExpenseList} from "../util.ts";
import DBInsertionForm from "./DBInsertionForm.tsx";
import DBDeletionForm from "./DBDeletionForm.tsx";
import DBUpdatingForm from "./DBUpdatingForm.tsx";

export default function App() {

    const [expenseArray, setExpenseArray] = useState(tempStartExpenseList);
    // const [budgetArray, setBudgetArray] = useState(tempStartBudgetList);

    return (
        <>
            <ExpenseList expenseArray={expenseArray} setExpenseArray={setExpenseArray}/>
            {/*<BudgetList budgetArray={budgetArray} setBudgetArray={setBudgetArray}/>*/}
            <DBInsertionForm/>
            <DBDeletionForm/>
            <DBUpdatingForm/>
        </>
    )
}
