import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    BudgetItemEntity,
    categoryListAsOptions,
    CategoryToIconGroupAndColourMap,
    checkForOpenModalOrForm,
    checkForUser, DayExpenseGroupEntity,
    ExpenseItemEntity,
    ExpenseModalVisibility, ExpenseUpdatingFormData, getCurrencySymbol,
    getExpenseList,
    getGroupList, getRecurringExpenseInstanceNull,
    getRecurringExpenseList, getRemovedRecurringExpenses,
    GroupItemEntity, handleBatchExpenseDeletion,
    handleExpenseCreation,
    handleExpenseDeletion, handleExpenseUpdating,
    handleRemovedRecurringExpenseCreation, matchingRemovedRecurringExpenseFound, MonthExpenseGroupEntity,
    PreviousExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseItemEntity,
    recurringExpenseLandsOnDay,
    RemovedRecurringExpenseItem,
} from "../../util.ts";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
import ExpenseCreationForm from "../ModalsAndForms/ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "../ModalsAndForms/ExpenseUpdatingForm.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import "../../css/Expense.css"
import Loader from "../Other/Loader.tsx";
import {v4 as uuid} from "uuid";
import {ExpenseMonthGroup} from "./ExpenseMonthGroup.tsx";


interface ExpensesProps {
    publicUserData: PublicUserData;

    expenseArray: ExpenseItemEntity[];
    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>

    categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function Expenses({ publicUserData, expenseArray, budgetArray, groupArray, setExpenseArray, setBudgetArray, setGroupArray, categoryDataMap }: ExpensesProps) {
    // const [expenseMatrix, setExpenseMatrix] = useState<ExpenseItemEntity[][]>([]);
    const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
    const [expenseFormVisibility, setExpenseFormVisibility] = useState({
        isCreateExpenseVisible: false,
        isUpdateExpenseVisible: false,
    });
    const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>( {
        isConfirmExpenseDestructionModalVisible: false,
    })
    const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);
    const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", recurringExpenseId: "", oldCategory: "", oldTimestamp: new Date(), oldAmount: 0 });
    const [expenseIdToDelete, setExpenseIdToDelete] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [removedRecurringExpenseInstances, setRemovedRecurringExpenseInstances] = useState<RemovedRecurringExpenseItem[]>([]);

    const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>([]);

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

                const [recurringExpenseList, removedRecurringExpenses] = await Promise.all([
                    getRecurringExpenseList(),
                    getRemovedRecurringExpenses()
                ]);
                setRecurringExpenseArray(recurringExpenseList);
                setRemovedRecurringExpenseInstances(removedRecurringExpenses);

                await updateRecurringExpenseInstances();
            } catch (error) {
                console.log(`Unsuccessful expense page data retrieval - error: ${error}`);
            }
        }
        retrieveInitialData()
            .then(() => setIsLoading(false))
    }, []);

    useEffect(() => {
        console.log("RAW EXPENSE ARRAY BELOW")
        console.log(expenseArray);

        // Declare new structure
        let newStructuredExpenseData: MonthExpenseGroupEntity[] = [];

        // Initialise structure using 12 months back and 12 months forward
        const dateToday = new Date();
        let currentMonth = dateToday.getMonth();
        let currentYear = dateToday.getFullYear();

        for (let i = -12; i <= 12; i++) {
            const monthIndex = (currentMonth + i + 12) % 12;
            const yearAdjustment = Math.floor((currentMonth + i) / 12);
            const year = currentYear + yearAdjustment;

            const newMonthExpenseGroup: MonthExpenseGroupEntity = {
                monthIndex: monthIndex,
                year: year,
                monthExpenseArray: []
            }

            newStructuredExpenseData = [...newStructuredExpenseData, newMonthExpenseGroup]
        }
        // After this loop our data structure has a month entry for all 25 months.
        console.log("POST INITIALISATION EXPENSE STRUCTURE BELOW")
        console.log(newStructuredExpenseData);

        for (const expenseItem of expenseArray) {
            for (let monthExpenseGroupItem of newStructuredExpenseData) {
                if (monthExpenseGroupItem.monthIndex === new Date(expenseItem.timestamp).getMonth()
                    && monthExpenseGroupItem.year === new Date(expenseItem.timestamp).getFullYear()) {
                    // Execution here occurs where a monthExpenseGroupItem's month and year (day) match to this iteration's expenseItem's day.
                    // Here, if a DayExpenseGroupEntity exists for the expenseItem's day, add the expenseItem in.
                    let matchingDayGroupExists = false;
                    for (let dayExpenseGroupItem of monthExpenseGroupItem.monthExpenseArray) {
                        if (dayExpenseGroupItem.calendarDate === new Date(expenseItem.timestamp).toLocaleDateString()) {
                            console.log(`Adding an expense item to existing group on ${dayExpenseGroupItem.calendarDate}`)
                            dayExpenseGroupItem.dayExpenseArray = [...dayExpenseGroupItem.dayExpenseArray, expenseItem];
                            break;
                        }
                    }
                    if (matchingDayGroupExists) {
                        break;
                    }

                    // Otherwise, make a new DayExpenseGroupEntity for the expenseItem's day and add it in.
                    console.log(`Adding an expense item to newly created group on ${new Date(expenseItem.timestamp).toLocaleDateString()}`)
                    const newDayExpenseGroup: DayExpenseGroupEntity = {
                        calendarDate: new Date(expenseItem.timestamp).toLocaleDateString(),
                        dayExpenseArray: [expenseItem]
                    }
                    monthExpenseGroupItem.monthExpenseArray = [...monthExpenseGroupItem.monthExpenseArray, newDayExpenseGroup];
                }
            }
        }
        console.log("POST POPULATION EXPENSE STRUCTURE BELOW")
        console.log(newStructuredExpenseData);

        setStructuredExpenseData(newStructuredExpenseData);
    }, [expenseArray]);


    useEffect(() => {
        getGroupList()
            .then((groupList: GroupItemEntity[]) => {
                setGroupArray(groupList)
            })
        // const uniqueDates = new Set(expenseArray.map(expenseItem => new Date(expenseItem.timestamp).toLocaleDateString()))
        // let updatedMatrix: ExpenseItemEntity[][] = []
        // uniqueDates.forEach(date => {
        //     let constituentExpenseArray: ExpenseItemEntity[] = [];
        //     expenseArray.forEach(expenseItem => {
        //         if (new Date(expenseItem.timestamp).toLocaleDateString() === date) {
        //             constituentExpenseArray = [...constituentExpenseArray, expenseItem];
        //         }
        //     })
        //     updatedMatrix = [...updatedMatrix, constituentExpenseArray]
        // })
        // setExpenseMatrix(updatedMatrix)
    }, [expenseArray]);

    useEffect( () => {
        document.getElementById("category")?.focus()
        document.getElementById("right-button")?.focus()
        setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility))
    }, [expenseFormVisibility, expenseModalVisibility])

    useEffect(() => {
        updateRecurringExpenseInstances();
    }, [recurringExpenseArray]);

    async function runExpenseDeletion() {
        const expenseItemToDelete = expenseArray.find(expenseItem => expenseItem.expenseId === expenseIdToDelete);
        if (expenseItemToDelete) {
            if (expenseItemToDelete.recurringExpenseId !== null) {
                handleRemovedRecurringExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp, setRemovedRecurringExpenseInstances)
                    .then(() => {
                        console.log("Logged recurrence removal successful")
                        handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
                            .then(() => console.log("Deletion successful"))
                            .catch(() => console.log("Deletion unsuccessful"));
                    })
                    .catch(() => console.log("Logged recurrence removal unsuccessful"));
            } else {
                handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
                    .then(() => console.log("Deletion successful"))
                    .catch(() => console.log("Deletion unsuccessful"));
            }
        }
    }

    async function updateRecurringExpenseInstances() {
        const today = new Date();
        let misplacedExpensesToRemove: string[] = [];
        recurringExpenseArray.forEach(recurringExpenseItem => {
            for (let date = new Date(recurringExpenseItem.timestamp); date <= today; date.setTime(date.getTime() + (24 * 60 * 60 * 1000))) {
                const expenseInstance = getRecurringExpenseInstanceNull(expenseArray, recurringExpenseItem, date);
                const isFrequencyMatch = recurringExpenseLandsOnDay(recurringExpenseItem, date);
                const expenseInstanceIsBlacklisted = removedRecurringExpenseInstances ? matchingRemovedRecurringExpenseFound(removedRecurringExpenseInstances, recurringExpenseItem, date) : false;

                if (expenseInstance) {
                    if (expenseInstance.category !== recurringExpenseItem.category) {
                        const updatedExpenseItem: ExpenseUpdatingFormData = {
                            category: recurringExpenseItem.category,
                            amount: expenseInstance.amount,
                            timestamp: expenseInstance.timestamp
                        }

                        handleExpenseUpdating(expenseInstance.expenseId, updatedExpenseItem)
                            .then(() => getExpenseList()
                                .then(results => setExpenseArray(results)))
                    }
                        if (!isFrequencyMatch && recurringExpenseItem.timestamp !== expenseInstance.timestamp) {
                        misplacedExpensesToRemove = [...misplacedExpensesToRemove, expenseInstance.expenseId];
                    }
                } else {
                    if (isFrequencyMatch && !expenseInstanceIsBlacklisted) {
                        const newExpenseItemLanded: ExpenseItemEntity = {
                            expenseId: uuid(),
                            category: recurringExpenseItem.category,
                            amount: recurringExpenseItem.amount,
                            timestamp: date,
                            recurringExpenseId: recurringExpenseItem.recurringExpenseId
                        }
                        handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItemLanded)
                    }
                }
            }
        })
        if (misplacedExpensesToRemove.length !== 0) {
            console.log("see below to delete");
            console.log(misplacedExpensesToRemove);
            await handleBatchExpenseDeletion(misplacedExpensesToRemove);
            setExpenseArray(await getExpenseList());
        }
    }

    return (
        <div>
            {!isLoading ? <div className="flex flex-col justify-center items-center">
                <div className={`flex flex-col justify-center items-center elementsBelowPopUpForm z-2
            ${isExpenseFormOrModalOpen && "blur"}`}>

                    <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility} isDarkMode={publicUserData.darkModeEnabled}/>

                    {structuredExpenseData.map((monthExpenseGroupItem, key) => {
                        return <ExpenseMonthGroup monthExpenseGroupItem={monthExpenseGroupItem}
                                                  setExpenseFormVisibility={setExpenseFormVisibility}
                                                  setExpenseModalVisibility={setExpenseModalVisibility}
                                                  setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                                                  setExpenseIdToDelete={setExpenseIdToDelete}
                                                  categoryDataMap={categoryDataMap}
                                                  publicUserData={publicUserData}
                                                  key={key}/>
                    })}

                    {/*{expenseArray?.length > 0 ? expenseMatrix.map((filteredExpenseArray, key) => (*/}
                    {/*    <ExpenseDayGroup*/}
                    {/*        date={new Date(filteredExpenseArray[0].timestamp)}*/}
                    {/*        filteredExpenseArray={filteredExpenseArray}*/}
                    {/*        setExpenseFormVisibility={setExpenseFormVisibility}*/}
                    {/*        setExpenseModalVisibility={setExpenseModalVisibility}*/}
                    {/*        setOldExpenseBeingEdited={setOldExpenseBeingEdited}*/}
                    {/*        setExpenseIdToDelete={setExpenseIdToDelete}*/}
                    {/*        categoryDataMap={categoryDataMap}*/}
                    {/*        publicUserData={publicUserData}*/}
                    {/*        key={key}/>*/}
                    {/*)): <p className={`text-2xl mt-48 ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>No expenses added yet.</p>}*/}
                </div>

                {isExpenseFormOrModalOpen && <div className="absolute w-full h-full bg-transparent z-3"></div>}

                <div className="z-4">
                    {expenseFormVisibility.isCreateExpenseVisible && <ExpenseCreationForm
                        setExpenseFormVisibility={setExpenseFormVisibility}
                        setExpenseArray={setExpenseArray}
                        setBudgetArray={setBudgetArray}
                        setRecurringExpenseArray={setRecurringExpenseArray}
                        budgetArray={budgetArray}
                        categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                        currencySymbol={getCurrencySymbol(publicUserData.currency)}/>}
                    {expenseFormVisibility.isUpdateExpenseVisible &&
                        <ExpenseUpdatingForm setExpenseFormVisibility={setExpenseFormVisibility}
                                             setExpenseArray={setExpenseArray} setBudgetArray={setBudgetArray}
                                             categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                             oldExpenseBeingEdited={oldExpenseBeingEdited}
                                             currencySymbol={getCurrencySymbol(publicUserData.currency)}/>}

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
            </div>: <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled}/>}
        </div>
    );
}