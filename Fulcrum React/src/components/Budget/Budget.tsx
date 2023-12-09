import BudgetList2 from "./BudgetList2.tsx";
import BudgetCreationForm from "./BudgetCreationForm.tsx";
import BudgetDeletionForm from "./BudgetDeletionForm.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";
import {useEffect, useState} from "react";
import AddNewBudgetButton from "./AddNewBudgetButton.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect( () => {
        async function fetchData() {
            const budgetList = await getBudgetList();
            setBudgetArray(budgetList)
        }
        fetchData();
    }, [])

    return (
        <div>
            <BudgetList2 budgetArray={budgetArray}/>
            <AddNewBudgetButton setIsFormVisible={setIsFormVisible}/>
            {isFormVisible && <BudgetCreationForm setIsFormVisible={setIsFormVisible} setBudgetArray={setBudgetArray}/>}
            <BudgetDeletionForm setBudgetArray={setBudgetArray}/>
            <BudgetUpdatingForm setBudgetArray={setBudgetArray}/>
        </div>
    )
}