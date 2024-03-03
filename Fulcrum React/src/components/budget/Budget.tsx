import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility, checkForOpenModalOrForm, checkForUser,
    ExpenseItemEntity,
    getTotalAmountBudgeted,
    getGroupList, getLineAngle, getTotalIncome,
    GroupItemEntity,
    handleGroupDeletion,
    PreviousBudgetBeingEdited, PreviousGroupBeingEdited, PublicUserData, getCurrencySymbol,
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import IncomeDisplay from "./IncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";
import BudgetModalsAndForms from "./BudgetModalsAndForms.tsx";
import Loader from "../other/Loader.tsx";
import '../../css/App.css'
import '../../css/Budget.css'


interface BudgetProps {
    publicUserData: PublicUserData;

    expenseArray: ExpenseItemEntity[];
    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>
}

export default function Budget( { publicUserData, expenseArray, budgetArray, groupArray, setBudgetArray, setGroupArray }: BudgetProps) {
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

            const [totalIncome] = await Promise.all([
                getTotalIncome()
            ])
            setTotalIncome(totalIncome);
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
        setAmountLeftToBudget(totalIncome - getTotalAmountBudgeted(budgetArray))
    },[budgetArray, totalIncome])

    useEffect(() => {
        setLineAngle(getLineAngle(amountLeftToBudget/totalIncome * 100))
    }, [amountLeftToBudget, totalIncome]);

    useEffect( () => {
        const formCategoryInput = document.getElementById("category")
        const formGroupInput = document.getElementById("group")
        formCategoryInput ? formCategoryInput.focus() : formGroupInput?.focus();

        document.getElementById("right-button")?.focus()
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
                ${isBudgetFormOrModalOpen && "blur"}`}>
                    <IncomeDisplay
                        totalIncome={totalIncome}
                        setTotalIncome={setTotalIncome}
                        amountLeftToBudget={amountLeftToBudget}
                        publicUserData={publicUserData}/>

                    <FulcrumAnimation lineAngle={lineAngle} isDarkMode={publicUserData.darkModeEnabled}/>

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
                        perCategoryTotalExpenseArray={perCategoryExpenditureMap}
                        publicUserData={publicUserData}/>}

                    <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility} isDarkMode={publicUserData.darkModeEnabled}/>
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
                    setModalFormVisibility={setBudgetModalVisibility} currencySymbol={getCurrencySymbol(publicUserData.currency)}/>
                </div>
            </div> : <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled}/>}
        </>
    );
}