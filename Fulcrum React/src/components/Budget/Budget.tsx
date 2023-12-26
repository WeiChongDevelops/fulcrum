import BudgetCreationForm from "./Forms/BudgetCreationForm.tsx";
import {
    BudgetItemEntity, dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList,
    getGroupListAsOptions, GroupOptionsFormattedData,
} from "../../util.ts";
import { useEffect, useState } from "react";
import BudgetUpdatingForm from "./Forms/BudgetUpdatingForm.tsx";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import GroupCreationForm from "./Forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./Forms/GroupUpdatingForm.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    const [budgetFormVisibility, setBudgetFormVisibility] = useState({
        isCreateBudgetVisible: false,
        isUpdateBudgetVisible: false,
        isCreateGroupVisible: false,
        isUpdateGroupVisible: false,
    });

    const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState({ oldAmount: 0, oldCategory: "", oldGroup: ""})
    const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState({ oldColour: "", oldGroupName: "" })

    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
    const [initialGroupOptions, setInitialGroupOptions] = useState<GroupOptionsFormattedData[]>([]);

    const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList.sort())
            })
        getGroupListAsOptions()
            .then( results => setInitialGroupOptions(results))

    }, []);

    useEffect( () => {
        dynamicallySizeBudgetNameDisplays()
        getGroupListAsOptions()
            .then( results => setInitialGroupOptions(results))
    }, [budgetArray])

    useEffect( () => {
        setAmountLeftToBudget(totalIncome - getAmountBudgeted(budgetArray))
    },[budgetArray, totalIncome])

    useEffect( () => {
        document.getElementById("category")?.focus();
        console.log(budgetFormVisibility);
    }, [budgetFormVisibility])

    return (
        <div>
            <div className={`elementsBelowPopUpForm ${(Object.values(budgetFormVisibility).includes(true)) && "blur"} px-16`}>
                <TotalIncomeDisplay
                    totalIncome={totalIncome}
                    setTotalIncome={setTotalIncome}
                    amountLeftToBudget={amountLeftToBudget}/>

                <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome}/>

                {setInitialGroupOptions.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                    setOldGroupBeingEdited={setOldGroupBeingEdited}
                    initialGroupOptions={initialGroupOptions}
                    setGroupNameOfNewItem={setGroupNameOfNewItem}
                    setBudgetFormVisibility={setBudgetFormVisibility}

                    setInitialGroupOptions={setInitialGroupOptions}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>
            {budgetFormVisibility.isCreateBudgetVisible && <BudgetCreationForm setBudgetArray={setBudgetArray}
                                                          initialGroupOptions={initialGroupOptions}
                                                          groupNameOfNewItem={groupNameOfNewItem}
                                                          setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                          oldBudgetBeingEdited={oldBudgetBeingEdited}
                                                          initialGroupOptions={initialGroupOptions}
                                                          setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isCreateGroupVisible && <GroupCreationForm setInitialGroupOptions={setInitialGroupOptions}
                                                        setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isUpdateGroupVisible && <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited}
                                                        setBudgetArray={setBudgetArray}
                                                        setInitialGroupOptions={setInitialGroupOptions}
                                                        initialGroupOptions={initialGroupOptions}
                                                        setBudgetFormVisibility={setBudgetFormVisibility}/>}

        </div>
    );
}
