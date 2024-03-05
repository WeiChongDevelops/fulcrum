import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {
    BudgetItemEntity,
    CategoryToIconGroupAndColourMap,
    checkForOpenModalOrForm,
    checkForUser,
    ExpenseItemEntity,
    ExpenseModalVisibility,
    getGroupList,
    getRecurringExpenseList,
    getRemovedRecurringExpenses, getStructuredExpenseData,
    GroupItemEntity,
    MonthExpenseGroupEntity,
    PreviousExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseItemEntity,
    RemovedRecurringExpenseItem, updateRecurringExpenseInstances,
} from "../../util.ts";
import "../../css/Expense.css"
import Loader from "../other/Loader.tsx";
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

                await updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, removedRecurringExpenseInstances, setBudgetArray, setExpenseArray);
            } catch (error) {
                console.log(`Unsuccessful expense page data retrieval - error: ${error}`);
            }
        }
        retrieveInitialData()
            .then(() => setIsLoading(false))
    }, []);

    useMemo(() => {
        getStructuredExpenseData(expenseArray, setStructuredExpenseData);
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
        updateRecurringExpenseInstances(recurringExpenseArray, expenseArray, removedRecurringExpenseInstances, setBudgetArray, setExpenseArray);
    }, [recurringExpenseArray]);

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