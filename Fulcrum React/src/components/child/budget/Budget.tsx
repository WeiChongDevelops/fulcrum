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
} from "../../../util.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import IncomeDisplay from "./IncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./main-data-hierarchy/GroupList.tsx";
import AddNewGroupButton from "./buttons/AddNewGroupButton.tsx";
import BudgetModalsAndForms from "./BudgetModalsAndForms.tsx";
import Loader from "../other/Loader.tsx";
import '../../../css/App.css'
import '../../../css/Budget.css'
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";


interface BudgetProps {
    publicUserData: PublicUserData;

    expenseArray: ExpenseItemEntity[];
    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>

    error: string;
    setError: Dispatch<SetStateAction<string>>;
}

/**
 * The root component for the budget page. It contains the income display, the Fulcrum animation and the user's budget.
 */
export default function Budget( { publicUserData, expenseArray, budgetArray, groupArray, setBudgetArray, setGroupArray, error, setError }: BudgetProps) {
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
            .catch(() => setError("We’re unable to load your data right now. Please try again later."))
    }, []);

    useEffect( () => {
        getGroupList()
            .then( results => setGroupArray(results))
    }, [budgetArray])

    useEffect( () => {
        // Map construction for each category's total expenditure
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
        // Update scale animation line angle when either of its two factors change
        setLineAngle(getLineAngle(amountLeftToBudget/totalIncome * 100))
    }, [amountLeftToBudget, totalIncome]);

    useEffect( () => {
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
        <div>
            {!isLoading ? <div className="flex flex-row justify-center items-center">
                {error === "" ? <div>
                    <div className={`justify-center items-center elementsBelowPopUpForm
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

                    {isBudgetFormOrModalOpen && <ActiveFormClickShield/>}

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
                </div> : <p className={`error-message ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>{error}</p>}
                </div> : <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled}/>}
        </div>
    );
}
