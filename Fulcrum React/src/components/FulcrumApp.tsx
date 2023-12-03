import '../css/App.css'
import ExpenseList from "./Expenses/ExpenseList.tsx";
// import BudgetList from "./BudgetList.tsx";
import {useEffect, useState} from "react";
import {BudgetItemEntity, ExpenseItemEntity, getBudgetList, getExpenseList} from "../util.ts";
import ExpenseCreationForm from "./Expenses/ExpenseCreationForm.tsx";
import ExpenseDeletionForm from "./Expenses/ExpenseDeletionForm.tsx";
import ExpenseUpdatingForm from "./Expenses/ExpenseUpdatingForm.tsx";
import BudgetList from "./Budget/BudgetList.tsx";
import BudgetCreationForm from "./Budget/BudgetCreationForm.tsx";
import BudgetDeletionForm from "./Budget/BudgetDeletionForm.tsx";
import BudgetUpdatingForm from "./Budget/BudgetUpdatingForm.tsx";

export default function FulcrumApp() {

    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    useEffect( () => {
        async function fetchData() {
            const expenseList = await getExpenseList();
            setExpenseArray(expenseList)
        }
        fetchData();
    }, [])

    useEffect( () => {
        async function fetchData() {
            const budgetList = await getBudgetList();
            setBudgetArray(budgetList)
        }
        fetchData();
    }, [])

    return (
        <div className="flex flex-row justify-between align-middle">
            <div>
                <ExpenseList expenseArray={expenseArray}/>
                <ExpenseCreationForm setExpenseArray={setExpenseArray}/>
                <ExpenseDeletionForm setExpenseArray={setExpenseArray}/>
                <ExpenseUpdatingForm setExpenseArray={setExpenseArray}/>
            </div>
            <div>
                <BudgetList budgetArray={budgetArray}/>
                <BudgetCreationForm setBudgetArray={setBudgetArray}/>
                <BudgetDeletionForm setBudgetArray={setBudgetArray}/>
                <BudgetUpdatingForm setBudgetArray={setBudgetArray}/>
            </div>
        </div>
    )
}
