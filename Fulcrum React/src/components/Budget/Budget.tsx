import BudgetCreationForm from "./BudgetCreationForm.tsx";
import {
    BudgetItemEntity,
    getAmountBudgeted,
    getBudgetList,
    getGroupListAsOptions, GroupOptionsFormattedData,
} from "../../util.ts";
import { useEffect, useState } from "react";
import AddNewBudgetButton from "./AddNewBudgetButton.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import GroupCreationForm from "./GroupCreationForm.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    const [isCreateBudgetVisible, setIsCreateBudgetVisible] = useState<boolean>(false);
    const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] = useState<boolean>(false);
    const [isCreateGroupVisible, setIsCreateGroupVisible] = useState<boolean>(false);


    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editingOldAmount, setEditingOldAmount] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
    const [initialGroupOptions, setInitialGroupOptions] = useState<GroupOptionsFormattedData[]>([]);
    const [groupOfNewItem, setGroupOfNewItem] = useState<string>("");

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList.sort())
            })
        getGroupListAsOptions()
            .then( results => setInitialGroupOptions(results))
    }, []);

    useEffect( () => {
        getGroupListAsOptions()
            .then( results => setInitialGroupOptions(results))
    }, [budgetArray])

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

            <div className={`elementsBelowPopUpForm ${(isCreateBudgetVisible || isUpdateBudgetVisible) && "blur"} px-16`}>

                <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome}/>
                {setInitialGroupOptions.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                    setEditingCategory={setEditingCategory}
                    setEditingOldAmount={setEditingOldAmount}
                    initialGroupOptions={initialGroupOptions}
                    setGroupOfNewItem={setGroupOfNewItem}
                    setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                    setIsCreateGroupVisible={setIsCreateGroupVisible}/>}

            </div>
            {isCreateBudgetVisible && <BudgetCreationForm setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                                          setBudgetArray={setBudgetArray}
                                                          initialGroupOptions={initialGroupOptions}
                                                          groupOfNewItem={groupOfNewItem}/>}
            {isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                          category={editingCategory}
                                                          setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                                          oldAmount={editingOldAmount}
                                                          initialGroupOptions={initialGroupOptions}/>}
            {isCreateGroupVisible && <GroupCreationForm setIsCreateGroupVisible={setIsCreateGroupVisible}
                                                        setInitialGroupOptions={setInitialGroupOptions}/>}

            <AddNewBudgetButton setIsFormVisible={setIsCreateBudgetVisible} />
        </div>
    );
}
