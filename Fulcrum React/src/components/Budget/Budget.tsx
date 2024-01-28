import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility, checkForOpenModalOrForm, checkForUser,
    ExpenseItemEntity,
    getAmountBudgeted,
    getBudgetList, getExpenseList,
    getGroupList, getLineAngle, getTotalIncome,
    GroupItemEntity,
    handleGroupDeletion,
    implementDynamicBackgroundHeight,
    PreviousBudgetBeingEdited, PreviousGroupBeingEdited,
} from "../../util.ts";
import { useEffect, useState } from "react";
import IncomeDisplay from "./IncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";
import BudgetModalsAndForms from "../ModalsAndForms/BudgetModalsAndForms.tsx";
import Loader from "../Other/Loader.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);

    const [budgetFormVisibility, setBudgetFormVisibility] = useState<BudgetFormVisibility>({
        isCreateBudgetVisible: false,
        isUpdateBudgetVisible: false,
        isCreateGroupVisible: false,
        isUpdateGroupVisible: false,
    });

    const [budgetModalVisibility, setBudgetModalVisibility] = useState<BudgetModalVisibility>( {
        isDeleteOptionsModalVisible: false,
        isConfirmGroupDestructionModalVisible: false,
        isConfirmCategoryDestructionModalVisible: false
    })

    const [groupToDelete, setGroupToDelete] = useState<string>("");
    const [categoryToDelete, setCategoryToDelete] = useState<string>("");

    const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState<PreviousBudgetBeingEdited>({ oldAmount: 0, oldCategory: "", oldGroup: ""});
    const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState<PreviousGroupBeingEdited>({ oldColour: "", oldGroupName: "" });

    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);

    const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");

    const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [lineAngle, setLineAngle] = useState(0);

    const [perCategoryExpenditureMap, setPerCategoryExpenditureMap] = useState<Map<string, number>>(new Map())

    useEffect(() => {
        async function retrieveInitialData() {
            const userStatus = await checkForUser();
            !userStatus["loggedIn"] && (window.location.href = "/login");

            const [budgetArray, groupArray, expenseArray, totalIncome] = await Promise.all([
                getBudgetList(),
                getGroupList(),
                getExpenseList(),
                getTotalIncome()
            ])

            setBudgetArray(budgetArray);
            setGroupArray(groupArray);
            setExpenseArray(expenseArray);
            setTotalIncome(totalIncome);
            await implementDynamicBackgroundHeight();
        }
        retrieveInitialData()
            .then(() => {
                setIsLoading(false)
            })
    }, []);

    useEffect( () => {
        getGroupList()
            .then( results => setGroupArray(results))
    }, [budgetArray])

    useEffect( () => {
        const categoryArray = budgetArray.map(budgetItem => budgetItem.category);
        categoryArray.forEach(category => {
            const thisCategoryExpenseArray = expenseArray.filter(expenseItem => expenseItem.category === category)
            const totalExpenses = thisCategoryExpenseArray.reduce((acc, expenseItem) => (acc + expenseItem.amount), 0)

            setPerCategoryExpenditureMap(currentMap => {
                const updatedMap = new Map(currentMap);
                updatedMap.set(category, totalExpenses);
                return updatedMap;
            })
        })
    },[budgetArray, expenseArray])

    useEffect( () => {
        setAmountLeftToBudget(totalIncome - getAmountBudgeted(budgetArray))
    },[budgetArray, totalIncome])

    useEffect(() => {
        setLineAngle(getLineAngle(amountLeftToBudget/totalIncome * 100))
    }, [amountLeftToBudget, totalIncome]);

    useEffect( () => {
        const formCategoryInput = document.getElementById("category")
        const formGroupInput = document.getElementById("group")
        formCategoryInput ? formCategoryInput.focus() : formGroupInput?.focus();
        console.log(budgetFormVisibility);
        console.log(budgetModalVisibility);
        setIsBudgetFormOrModalOpen(checkForOpenModalOrForm(budgetFormVisibility, budgetModalVisibility))
    }, [budgetFormVisibility, budgetModalVisibility])

    function runGroupDeletionWithUserPreference(keepContainedBudgets: boolean) {
        setBudgetModalVisibility(current => ({...current,
            isDeleteOptionsModalVisible: false,
            isConfirmGroupDestructionModalVisible: false
        }))

        handleGroupDeletion(groupToDelete, setGroupArray, setBudgetArray, keepContainedBudgets)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }


    return (
        <>
            {!isLoading ?<div className="flex flex-row justify-center items-center">
             <div className={`flex flex-col items-center elementsBelowPopUpForm z-2
            ${isBudgetFormOrModalOpen && "blur"} px-16`}>
                <IncomeDisplay
                    totalIncome={totalIncome}
                    setTotalIncome={setTotalIncome}
                    amountLeftToBudget={amountLeftToBudget}/>

                <FulcrumAnimation lineAngle={lineAngle}/>

                {groupArray?.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    expenseArray={expenseArray}
                    setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                    setOldGroupBeingEdited={setOldGroupBeingEdited}
                    groupArray={groupArray}
                    setGroupArray={setGroupArray}
                    setGroupNameOfNewItem={setGroupNameOfNewItem}
                    setBudgetFormVisibility={setBudgetFormVisibility}
                    setGroupToDelete={setGroupToDelete}
                    setCategoryToDelete={setCategoryToDelete}
                    setModalFormVisibility={setBudgetModalVisibility}
                    perCategoryTotalExpenseArray={perCategoryExpenditureMap}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>

            {isBudgetFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

                <div className="z-4">
                <BudgetModalsAndForms budgetFormVisibility={budgetFormVisibility}
            setBudgetArray={setBudgetArray}
            groupArray={groupArray}
            groupNameOfNewItem={groupNameOfNewItem}
            setBudgetFormVisibility={setBudgetFormVisibility}
            oldBudgetBeingEdited={oldBudgetBeingEdited}
            setGroupArray={setGroupArray}
            oldGroupBeingEdited={oldGroupBeingEdited}
            groupToDelete={groupToDelete}
            categoryToDelete={categoryToDelete}
            runGroupDeletionWithUserPreference={runGroupDeletionWithUserPreference}
            modalFormVisibility={budgetModalVisibility}
            setModalFormVisibility={setBudgetModalVisibility}/>
            </div>
            </div> : <Loader isLoading={isLoading}/>}
        </>
    );
}
