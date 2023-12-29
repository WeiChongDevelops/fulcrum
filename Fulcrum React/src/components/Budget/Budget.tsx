import {
    BudgetItemEntity, dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList, getGroupList, GroupItemEntity, handleGroupDeletion,
} from "../../util.ts";
import { useEffect, useState } from "react";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";
import ModalsAndForms from "./Forms/ModalsAndForms.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [budgetFormVisibility, setBudgetFormVisibility] = useState({
        isCreateBudgetVisible: false,
        isUpdateBudgetVisible: false,
        isCreateGroupVisible: false,
        isUpdateGroupVisible: false,
    });

    const [isDeleteOptionsModalVisible, setIsDeleteOptionsModalVisible] = useState<boolean>(false);
    const [isConfirmDestructionModalVisible, setIsConfirmDestructionModalVisible] = useState<boolean>(false);
    const [groupToDelete, setGroupToDelete] = useState<string>("");

    const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState({ oldAmount: 0, oldCategory: "", oldGroup: ""});
    const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState({ oldColour: "", oldGroupName: "" });

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

    function runGroupDeletionWithUserPreference(keepContainedBudgets: boolean) {
        setIsDeleteOptionsModalVisible(false);
        setIsConfirmDestructionModalVisible(false);
        handleGroupDeletion(groupToDelete, setGroupArray, setBudgetArray, keepContainedBudgets)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div>
            <div className={`flex flex-col elementsBelowPopUpForm ${((Object.values(budgetFormVisibility).includes(true)) || isDeleteOptionsModalVisible) && "blur"} px-16`}>
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
                    setBudgetFormVisibility={setBudgetFormVisibility}
                    setGroupToDelete={setGroupToDelete}
                    setIsDeleteOptionsModalVisible={setIsDeleteOptionsModalVisible}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>

            <ModalsAndForms budgetFormVisibility={budgetFormVisibility}
                            setBudgetArray={setBudgetArray}
                            groupArray={groupArray}
                            groupNameOfNewItem={groupNameOfNewItem}
                            setBudgetFormVisibility={setBudgetFormVisibility}
                            oldBudgetBeingEdited={oldBudgetBeingEdited}
                            setGroupArray={setGroupArray}
                            oldGroupBeingEdited={oldGroupBeingEdited}
                            isDeleteOptionsModalVisible={isDeleteOptionsModalVisible}
                            groupToDelete={groupToDelete}
                            runGroupDeletionWithUserPreference={runGroupDeletionWithUserPreference}
                            setIsDeleteOptionsModalVisible={setIsDeleteOptionsModalVisible}
                            setIsConfirmDestructionModalVisible={setIsConfirmDestructionModalVisible}
                            isConfirmDestructionModalVisible={isConfirmDestructionModalVisible}/>

        </div>
    );
}
