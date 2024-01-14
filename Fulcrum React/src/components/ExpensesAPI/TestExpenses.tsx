import TestExpenseList from "./TestExpenseList.tsx";
import TestExpenseCreationForm from "./TestExpenseCreationForm.tsx";
import TestExpenseDeletionForm from "./TestExpenseDeletionForm.tsx";
import TestExpenseUpdatingForm from "./TestExpenseUpdatingForm.tsx";
import {ExpenseItemEntity, getExpenseList} from "../../util.ts";
import {useEffect, useState} from "react";

export default function TestExpenses() {
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
            <TestExpenseList expenseArray={expenseArray}/>
            <TestExpenseCreationForm setExpenseArray={setExpenseArray}/>
            <TestExpenseDeletionForm setExpenseArray={setExpenseArray}/>
            <TestExpenseUpdatingForm setExpenseArray={setExpenseArray}/>
        </div>
    )
}

