import '../css/App.css'
import ExpenseList from "./ExpenseList.tsx";
// import BudgetList from "./BudgetList.tsx";
import {useEffect, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../util.ts";
import DBInsertionForm from "./DBInsertionForm.tsx";
import DBDeletionForm from "./DBDeletionForm.tsx";
import DBUpdatingForm from "./DBUpdatingForm.tsx";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FulcrumApp from "./FulcrumApp.tsx";
import Signup from "./Signup.tsx";
import Login from "./Login.tsx";

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
        <Router>
            <Switch>
                <Route path="/login" Component={Login} />
                <Route path="/signup" Component={Signup} />
                <Route path="/" Component={FulcrumApp} />
                <ExpenseList expenseArray={expenseArray}/>
                {/*<BudgetList budgetArray={budgetArray} setBudgetArray={setBudgetArray}/>*/}
                <DBInsertionForm setExpenseArray={setExpenseArray}/>
                <DBDeletionForm/>
                <DBUpdatingForm/>
            </Switch>
        </Router>
    )
}
}
