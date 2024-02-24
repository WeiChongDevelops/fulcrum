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
    getGroupList, getMonthsFromToday, getRecurringExpenseInstanceOrNull,
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
import ExpenseCreationForm from "../ModalsAndForms/ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "../ModalsAndForms/ExpenseUpdatingForm.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import "../../css/Expense.css"
import Loader from "../Other/Loader.tsx";
import {v4 as uuid} from "uuid";
import ExpenseMonthCarousel from "./ExpenseMonthCarousel.tsx";


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
    const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

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
        const currentMonth = dateToday.getMonth();
        const currentYear = dateToday.getFullYear();

        const y2K = new Date('2000-01-01T00:00:00Z');
        const y2KMonth = y2K.getMonth();
        const y2KYear = y2K.getFullYear();

        const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);

        for (let i = -monthsFromY2KToNow; i <= 12; i++) {
            const monthIndex = (currentMonth + i + 1200) % 12;
            const yearAdjustment = Math.floor((currentMonth + i) / 12);
            const year = currentYear + yearAdjustment;

            const newMonthExpenseGroup: MonthExpenseGroupEntity = {
                monthIndex: monthIndex,
                year: year,
                // monthsFromToday: getMonthsFromToday(monthIndex, year),
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
                        if (new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString() === new Date(expenseItem.timestamp).toLocaleDateString()) {
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

                    const startOfDayCalendarDate = new Date(expenseItem.timestamp);
                    startOfDayCalendarDate.setHours(0,0,0,0);

                    const newDayExpenseGroup: DayExpenseGroupEntity = {
                        calendarDate: startOfDayCalendarDate,
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
                const expenseInstance = getRecurringExpenseInstanceOrNull(expenseArray, recurringExpenseItem, date);
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

                    <ExpenseMonthCarousel
                        structuredExpenseData={structuredExpenseData}
                        setExpenseFormVisibility={setExpenseFormVisibility}
                        setExpenseModalVisibility={setExpenseModalVisibility}
                        setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                        setExpenseIdToDelete={setExpenseIdToDelete}
                        categoryDataMap={categoryDataMap}
                        publicUserData={publicUserData}
                        setDefaultCalendarDate={setDefaultCalendarDate}
                    />

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
                        currencySymbol={getCurrencySymbol(publicUserData.currency)}
                        defaultCalendarDate={defaultCalendarDate}/>}
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