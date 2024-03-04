import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {
    BudgetItemEntity,
    CategoryToIconGroupAndColourMap,
    checkForOpenModalOrForm,
    checkForUser,
    DayExpenseGroupEntity,
    ExpenseItemEntity,
    ExpenseModalVisibility,
    getExpenseList,
    getGroupList,
    getMonthsFromToday,
    getRecurringExpenseInstanceOrNull,
    getRecurringExpenseList,
    getRemovedRecurringExpenses,
    GroupItemEntity,
    handleBatchExpenseDeletion,
    handleExpenseCreation,
    matchingRemovedRecurringExpenseFound,
    MonthExpenseGroupEntity,
    PreviousExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseItemEntity,
    recurringExpenseLandsOnDay,
    RemovedRecurringExpenseItem,
} from "../../util.ts";
import "../../css/Expense.css"
import Loader from "../other/Loader.tsx";
import {v4 as uuid} from "uuid";
import ExpenseMonthCarousel from "./ExpenseMonthCarousel.tsx";
import ExpenseModalsAndForms from "./ExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";


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
        isUpdateRecurringExpenseInstanceVisible: false
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

    useMemo(() => {
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

                            console.log(`Adding an expense item to existing group on ${new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString()}`)
                            dayExpenseGroupItem.dayExpenseArray = [...dayExpenseGroupItem.dayExpenseArray, expenseItem];
                            matchingDayGroupExists = true;
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
    }, [expenseArray, recurringExpenseArray]);


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

    async function updateRecurringExpenseInstances() {
        const today = new Date();
        const misplacedExpensesToRemove = new Set<string>();


        // For each recurring expense...
        recurringExpenseArray.forEach(recurringExpenseItem => {

            // We check each of the dates between when it was added and today.
            for (let date = new Date(recurringExpenseItem.timestamp); date <= today; date.setTime(date.getTime() + (24 * 60 * 60 * 1000))) {
                console.log(`Looking at date: ${date.toLocaleDateString()}`)

                const expenseInstances = getRecurringExpenseInstanceOrNull(expenseArray, recurringExpenseItem, date);
                const isFrequencyMatch = recurringExpenseLandsOnDay(recurringExpenseItem, date);
                const expenseInstanceIsBlacklisted = removedRecurringExpenseInstances ? matchingRemovedRecurringExpenseFound(removedRecurringExpenseInstances, recurringExpenseItem, date) : false;

                // If recurring instance already exists on this day
                if (expenseInstances != null) {
                    let keepFirstInstance = true;

                    // If this instance shouldn't have landed on this day (occurs when freq is changed), queue for removal
                    if (!isFrequencyMatch) {
                        keepFirstInstance = false;
                    }

                    for (let i = keepFirstInstance ? 1 : 0; i < expenseInstances.length ; i++) {
                        misplacedExpensesToRemove.add(expenseInstances[i].expenseId);
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
        if (misplacedExpensesToRemove.size !== 0) {
            console.log("See below; queued for deletion.");
            console.log(misplacedExpensesToRemove);
            await handleBatchExpenseDeletion(misplacedExpensesToRemove);
            setExpenseArray(await getExpenseList());
        } else {
            console.log("SIZE IS ZERO, SEE BELOW:");
            console.log(misplacedExpensesToRemove);
        }
    }

    return (
        <div className={""}>
            {!isLoading ? <div className="flex flex-col justify-center items-center">
                <div className={`justify-center items-center elementsBelowPopUpForm
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

                {isExpenseFormOrModalOpen && <ActiveFormClickShield/>}

                <ExpenseModalsAndForms expenseFormVisibility={expenseFormVisibility}
                                       setExpenseFormVisibility={setExpenseFormVisibility}
                                       expenseModalVisibility={expenseModalVisibility}
                                       setExpenseModalVisibility={setExpenseModalVisibility}
                                       expenseArray={expenseArray}
                                       budgetArray={budgetArray}
                                       groupArray={groupArray}
                                       setExpenseArray={setExpenseArray}
                                       setBudgetArray={setBudgetArray}
                                       setRecurringExpenseArray={setRecurringExpenseArray}
                                       setRemovedRecurringExpenseInstances={setRemovedRecurringExpenseInstances}
                                       publicUserData={publicUserData}
                                       defaultCalendarDate={defaultCalendarDate}
                                       oldExpenseBeingEdited={oldExpenseBeingEdited} expenseIdToDelete={expenseIdToDelete}/>
            </div>: <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled}/>}
        </div>
    );
}