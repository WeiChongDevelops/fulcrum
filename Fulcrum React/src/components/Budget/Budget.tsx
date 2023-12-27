import BudgetCreationForm from "./Forms/BudgetCreationForm.tsx";
import {
    BudgetItemEntity, dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList, getGroupList, GroupItemEntity,
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
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

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

    const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList.sort())
            })
        getGroupList()
            .then( results => setGroupArray(results))

    }, []);

    useEffect( () => {
        dynamicallySizeBudgetNameDisplays()
        getGroupList()
            .then( results => setGroupArray(results))
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
            <div className={`flex flex-col elementsBelowPopUpForm ${(Object.values(budgetFormVisibility).includes(true)) && "blur"} px-16`}>
                <TotalIncomeDisplay
                    totalIncome={totalIncome}
                    setTotalIncome={setTotalIncome}
                    amountLeftToBudget={amountLeftToBudget}/>

                <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome} setTotalIncome={setTotalIncome}/>

                {groupArray?.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                    setOldGroupBeingEdited={setOldGroupBeingEdited}
                    groupArray={groupArray}
                    setGroupArray={setGroupArray}
                    setGroupNameOfNewItem={setGroupNameOfNewItem}
                    setBudgetFormVisibility={setBudgetFormVisibility}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>
            {budgetFormVisibility.isCreateBudgetVisible && <BudgetCreationForm setBudgetArray={setBudgetArray}
                                                          groupArray={groupArray}
                                                          groupNameOfNewItem={groupNameOfNewItem}
                                                          setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                          oldBudgetBeingEdited={oldBudgetBeingEdited}
                                                          groupArray={groupArray}
                                                          setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isCreateGroupVisible && <GroupCreationForm setGroupArray={setGroupArray}
                                                        setBudgetFormVisibility={setBudgetFormVisibility}/>}
            {budgetFormVisibility.isUpdateGroupVisible && <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited}
                                                        setBudgetArray={setBudgetArray}
                                                        groupArray={groupArray}
                                                        setGroupArray={setGroupArray}
                                                        setBudgetFormVisibility={setBudgetFormVisibility}/>}

        </div>
    );
}
