import BudgetList from "./BudgetList.tsx";
import BudgetCreationForm from "./BudgetCreationForm.tsx";
import {
    BudgetItemEntity,
    getAmountBudgeted,
    getBudgetList,
    getGroupListAsOptions,
    RetrievedGroupData
} from "../../util.ts";
import { useEffect, useState } from "react";
import AddNewBudgetButton from "./AddNewBudgetButton.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [isCreateBudgetVisible, setIsCreateBudgetVisible] = useState<boolean>(false);
    const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editingOldAmount, setEditingOldAmount] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
    const [initialGroupOptions, setInitialGroupOptions] = useState<RetrievedGroupData[] | undefined> ();

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList)
            })
        getGroupListAsOptions()
            .then( results => setInitialGroupOptions(results))
    }, []);

    useEffect( () => {
        setAmountLeftToBudget(totalIncome - getAmountBudgeted(budgetArray))
    },[budgetArray, totalIncome])

    useEffect( () => {
        document.getElementById("category")?.focus();
    }, [isCreateBudgetVisible, isUpdateBudgetVisible])

    return (
        <div>
            <h1 className="my-6">Budget</h1>
            <TotalIncomeDisplay totalIncome={totalIncome} setTotalIncome={setTotalIncome} amountLeftToBudget={amountLeftToBudget}/>


            <div className={`elementsBelowPopUpForm ${(isCreateBudgetVisible || isUpdateBudgetVisible) && "blur"} 
            
            
            px-16`}>

                <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome}/>
                <BudgetList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                    setEditingCategory={setEditingCategory}
                    setEditingOldAmount={setEditingOldAmount}
                />

            </div>
            {isCreateBudgetVisible && <BudgetCreationForm setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                                          setBudgetArray={setBudgetArray}
                                                          initialGroupOptions={initialGroupOptions}/>}
            {isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                          category={editingCategory}
                                                          setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                                          oldAmount={editingOldAmount}
                                                          initialGroupOptions={initialGroupOptions}/>}

            <AddNewBudgetButton setIsFormVisible={setIsCreateBudgetVisible} />
        </div>
    );
}