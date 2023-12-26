import BudgetCreationForm from "./Forms/BudgetCreationForm.tsx";
import {
    BudgetItemEntity, dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList,
    getGroupListAsOptions, GroupOptionsFormattedData,
} from "../../util.ts";
import { useEffect, useState } from "react";
import AddNewBudgetButton from "./AddNewBudgetButton.tsx";
import BudgetUpdatingForm from "./Forms/BudgetUpdatingForm.tsx";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import GroupCreationForm from "./Forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./Forms/GroupUpdatingForm.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    const [isCreateBudgetVisible, setIsCreateBudgetVisible] = useState<boolean>(false);
    const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] = useState<boolean>(false);
    const [isCreateGroupVisible, setIsCreateGroupVisible] = useState<boolean>(false);
    const [isUpdateGroupVisible, setIsUpdateGroupVisible] = useState<boolean>(false);

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
    }, [isCreateBudgetVisible, isUpdateBudgetVisible])

    return (
        <div>
            <h1 className="my-6">Budget</h1>
            <TotalIncomeDisplay
                totalIncome={totalIncome}
                setTotalIncome={setTotalIncome}
                amountLeftToBudget={amountLeftToBudget}/>

            <div className={`elementsBelowPopUpForm ${(isCreateBudgetVisible || isUpdateBudgetVisible) && "blur"} px-16`}>
                <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome}/>

                {setInitialGroupOptions.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                    setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                    setOldGroupBeingEdited={setOldGroupBeingEdited}
                    initialGroupOptions={initialGroupOptions}
                    setGroupNameOfNewItem={setGroupNameOfNewItem}
                    setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                    setIsCreateGroupVisible={setIsCreateGroupVisible}
                    setIsUpdateGroupVisible={setIsUpdateGroupVisible}
                    setInitialGroupOptions={setInitialGroupOptions}/>}
            </div>
            {isCreateBudgetVisible && <BudgetCreationForm setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                                          setBudgetArray={setBudgetArray}
                                                          initialGroupOptions={initialGroupOptions}
                                                          groupNameOfNewItem={groupNameOfNewItem}/>}
            {isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                          setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                                          oldBudgetBeingEdited={oldBudgetBeingEdited}
                                                          initialGroupOptions={initialGroupOptions}/>}
            {isCreateGroupVisible && <GroupCreationForm setIsCreateGroupVisible={setIsCreateGroupVisible}
                                                        setInitialGroupOptions={setInitialGroupOptions}/>}
            {isUpdateGroupVisible && <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited}
                                                        setIsUpdateGroupVisible={setIsUpdateGroupVisible}
                                                        setBudgetArray={setBudgetArray}
                                                        setInitialGroupOptions={setInitialGroupOptions}
                                                        initialGroupOptions={initialGroupOptions}/>}

            <AddNewBudgetButton setIsFormVisible={setIsCreateBudgetVisible} />
        </div>
    );
}
