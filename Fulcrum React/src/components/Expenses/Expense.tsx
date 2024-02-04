import {useEffect, useState} from "react";
import {
    BudgetItemEntity,
    categoryListAsOptions,
    CategoryToIconGroupAndColourMap,
    checkForOpenModalOrForm,
    checkForUser,
    ExpenseItemEntity,
    ExpenseModalVisibility,
    getBudgetList,
    getExpenseList,
    getGroupAndColourMap,
    getGroupList,
    getPublicUserData,
    getRecurringExpenseList, getRemovedRecurringExpenses,
    GroupItemEntity,
    handleExpenseCreation,
    handleExpenseDeletion,
    handleRemovedRecurringExpenseCreation,
    implementDynamicBackgroundHeight,
    PreviousExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseItemEntity,
    recurringExpenseLandsOnDay,
    RemovedRecurrenceExpenseItem,
} from "../../util.ts";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
import ExpenseCreationForm from "../ModalsAndForms/ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "../ModalsAndForms/ExpenseUpdatingForm.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";
import "../../css/Expense.css"
import Loader from "../Other/Loader.tsx";
import {v4 as uuid} from "uuid";


export default function Expense() {
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    const [expenseMatrix, setExpenseMatrix] = useState<ExpenseItemEntity[][]>(
        []
    )

    const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);

    const [publicUserData, setPublicUserData] = useState<PublicUserData>({
        createdAt: new Date(),
        darkModeEnabled: false,
        accessibilityEnabled: false
    })

    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [expenseFormVisibility, setExpenseFormVisibility] = useState({
        isCreateExpenseVisible: false,
        isUpdateExpenseVisible: false,
    });

    const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>( {
        isConfirmExpenseDestructionModalVisible: false,
    })
    const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);

    const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", oldCategory: "", oldAmount: 0 });
    const [expenseIdToDelete, setExpenseIdToDelete] = useState("");

    const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());

    const [isLoading, setIsLoading] = useState(true);

    const [removedRecurringExpenseInstances, setRemovedRecurringExpenseInstances] = useState<RemovedRecurrenceExpenseItem[]>([]);

    useEffect(() => {
        async function retrieveInitialData() {
            try {
                await checkForUser().then(userStatus => {
                    if (userStatus["loggedIn"]) {
                        console.log("User logged in.");
                    } else {
                        console.log("User not logged in, login redirect initiated.");
                        window.location.href = "/login";
                    }
                });

                // Fetch budget, expense, and group lists concurrently
                const [budgetList, expenseList, groupList, recurringExpenseList, publicUserDataObject, removedRecurringExpenses] = await Promise.all([
                    getBudgetList(),
                    getExpenseList(),
                    getGroupList(),
                    getRecurringExpenseList(),
                    getPublicUserData(),
                    getRemovedRecurringExpenses()
                ]);
                setBudgetArray(budgetList);
                setExpenseArray(expenseList);
                setGroupArray(groupList);
                setRecurringExpenseArray(recurringExpenseList);
                setPublicUserData(publicUserDataObject);
                setRemovedRecurringExpenseInstances(removedRecurringExpenses);


                // Await next render after state updates, before populating map; to avoid undefined errors.
                await new Promise(resolve => setTimeout(resolve, 0));
                setCategoryDataMap(await getGroupAndColourMap(budgetList, groupList));
            } catch (error) {
                console.log(`Unsuccessful expense page data retrieval - error: ${error}`);
            }
        }
        retrieveInitialData()
            .then(() => implementDynamicBackgroundHeight())
            .then(() => setIsLoading(false))
    }, []);


    useEffect(() => {
        getGroupList()
            .then((groupList: GroupItemEntity[]) => {
                setGroupArray(groupList)
            })
        const uniqueDates = new Set(expenseArray.map(expenseItem => new Date(expenseItem.timestamp).toLocaleDateString()))
        let updatedMatrix: ExpenseItemEntity[][] = []
        uniqueDates.forEach(date => {
            let constituentExpenseArray: ExpenseItemEntity[] = [];
            expenseArray.forEach(expenseItem => {
                if (new Date(expenseItem.timestamp).toLocaleDateString() === date) {
                    constituentExpenseArray = [...constituentExpenseArray, expenseItem];
                }
            })
            updatedMatrix = [...updatedMatrix, constituentExpenseArray]
        })
        setExpenseMatrix(updatedMatrix)
    }, [expenseArray]);

    useEffect( () => {
        document.getElementById("category")?.focus()
        document.getElementById("right-button")?.focus()
        setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility))
    }, [expenseFormVisibility, expenseModalVisibility])

    useEffect(() => {
        populateWithRecurringExpenses();
    }, [expenseArray]);

    function runExpenseDeletion() {
        const expenseItemToDelete = expenseArray.find(expenseItem => expenseItem.expenseId === expenseIdToDelete);
        if (expenseItemToDelete) {
            if (expenseItemToDelete.recurringExpenseId) {
                handleRemovedRecurringExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp)
                    .then(() => console.log("Logged recurrence removal successful"))
                    .catch(() => console.log("Logged recurrence removal unsuccessful"));
            }
        }
        handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    function populateWithRecurringExpenses() {
        const today = new Date();

        recurringExpenseArray.forEach((recurringExpenseItem: RecurringExpenseItemEntity) => {
            console.log(`Looking at the below recurringExpenseItem`)
            console.log(recurringExpenseItem)

            for (let date = new Date(recurringExpenseItem.timestamp); date <= today; date.setTime(date.getTime() + (24 * 60 * 60 * 1000))) {
                console.log(`Looking at date: ${date}`)

                // removedRecurringExpenseInstances.filter(removedRecurringExpenseItem => {
                //     return removedRecurringExpenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
                //         && removedRecurringExpenseItem.timestampOfRemovedInstance === recurringExpenseItem.timestamp
                // })
                // const newTing = removedRecurringExpenseInstances.filter(removedRecurringExpenseItem => {
                //     return removedRecurringExpenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
                //         && removedRecurringExpenseItem.timestampOfRemovedInstance === recurringExpenseItem.timestamp
                // })
                // console.log("newting");
                // console.log(newTing);

                if (recurringExpenseLandsOnDay(recurringExpenseItem, date) && removedRecurringExpenseInstances.filter(removedRecurringExpenseItem => {
                    return removedRecurringExpenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
                        && removedRecurringExpenseItem.timestampOfRemovedInstance === recurringExpenseItem.timestamp
                }).length !== 0) {
                    const newExpenseItemLanded: ExpenseItemEntity = {
                        expenseId: uuid(),
                        category: recurringExpenseItem.category,
                        amount: recurringExpenseItem.amount,
                        timestamp: date,
                        recurringExpenseId: recurringExpenseItem.recurringExpenseId
                    }

                    // If it's not already been loaded in, add it in.
                    if (expenseArray.filter((expenseItem: ExpenseItemEntity) => {
                        console.log(`For the expenseItem below....`)
                        console.log(expenseItem)
                        console.log("...")
                        console.log(`First condition is ${expenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId}`) //false
                        console.log(`Second condition is ${new Date(expenseItem.timestamp).toLocaleDateString() === date.toLocaleDateString()}`) //true
                        return (expenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
                            && new Date(expenseItem.timestamp).toLocaleDateString() === new Date(date).toLocaleDateString())
                    }).length === 0) {
                        console.log(`Conditions met. Adding entry on date ${new Date(date).toLocaleDateString()}.`)
                        handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItemLanded)
                    } else {
                        console.log(`Conditions not met. NOT adding entry on date ${date.toLocaleDateString()}`)
                    }
                }
            }
        })
    }

    return (
        <>
            {!isLoading ? <div className="flex flex-col justify-center items-center">
                <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${isExpenseFormOrModalOpen && "blur"} px-16`}>

                    <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility}/>

                    {expenseArray?.length > 0 ? expenseMatrix.map((filteredExpenseArray, key) => (
                        <ExpenseDayGroup
                            date={new Date(filteredExpenseArray[0].timestamp)}
                            filteredExpenseArray={filteredExpenseArray}
                            setExpenseFormVisibility={setExpenseFormVisibility}
                            setExpenseModalVisibility={setExpenseModalVisibility}
                            setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                            setExpenseIdToDelete={setExpenseIdToDelete}
                            categoryDataMap={categoryDataMap}
                            key={key}/>
                    )): <p className={"text-2xl mt-48"}>No expenses added yet.</p>}
                </div>

                {isExpenseFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

                <div className="z-4">
                    {expenseFormVisibility.isCreateExpenseVisible && <ExpenseCreationForm
                        setExpenseFormVisibility={setExpenseFormVisibility}
                        setExpenseArray={setExpenseArray}
                        setBudgetArray={setBudgetArray}
                        budgetArray={budgetArray}
                        categoryOptions={categoryListAsOptions(budgetArray, groupArray)}/>}
                    {expenseFormVisibility.isUpdateExpenseVisible &&
                        <ExpenseUpdatingForm setExpenseFormVisibility={setExpenseFormVisibility}
                                             setExpenseArray={setExpenseArray} setBudgetArray={setBudgetArray}
                                             categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                             oldExpenseBeingEdited={oldExpenseBeingEdited}/>}

                    {expenseModalVisibility.isConfirmExpenseDestructionModalVisible &&
                        <TwoOptionModal optionOneText="Cancel"
                                        optionOneFunction={() => setExpenseModalVisibility(current => ({
                                            ...current,
                                            isConfirmExpenseDestructionModalVisible: false
                                        }))} optionTwoText="Confirm" optionTwoFunction={() => {
                            runExpenseDeletion()
                            setExpenseModalVisibility(current => ({
                                ...current,
                                isConfirmExpenseDestructionModalVisible: false
                            }));
                        }}
                                        setModalVisibility={setExpenseModalVisibility}
                                        isVisible="isConfirmExpenseDestructionModalVisible"
                                        title="Are you sure you want to delete this expense?"/>}
                </div>

                {/*<ExpenseModalsAndForms setModalFormVisibility={setModalFormVisibility}*/}
                {/*                      setBudgetArray={setBudgetArray}*/}
                {/*                      groupArray={groupArray}*/}
                {/*                      groupNameOfNewItem={groupNameOfNewItem}*/}
                {/*                      setBudgetFormVisibility={setBudgetFormVisibility}*/}
                {/*                      oldBudgetBeingEdited={oldBudgetBeingEdited}*/}
                {/*                      setGroupArray={setGroupArray}*/}
                {/*                      oldGroupBeingEdited={oldGroupBeingEdited}*/}
                {/*                      groupToDelete={groupToDelete}*/}
                {/*                      categoryToDelete={categoryToDelete}*/}
                {/*                      runGroupDeletionWithUserPreference={runGroupDeletionWithUserPreference}*/}
                {/*                      modalFormVisibility={modalFormVisibility}*/}
                {/*                      setModalFormVisibility={setModalFormVisibility}/>*/}
            </div>: <Loader isLoading={isLoading}/>}
        </>
    );
}