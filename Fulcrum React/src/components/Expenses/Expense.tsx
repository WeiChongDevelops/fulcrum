import {useEffect, useState} from "react";
import {
    BudgetItemEntity,
    categoryListAsOptions, checkForUser,
    ExpenseItemEntity, ExpenseModalVisibility,
    getBudgetList,
    getExpenseList,
    getGroupList,
    GroupItemEntity, handleExpenseDeletion,
    implementDynamicBackgroundHeight,
    PreviousExpenseBeingEdited,
} from "../../util.ts";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
import ExpenseCreationForm from "./ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "./ExpenseUpdatingForm.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";


export default function Expense() {
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    const [expenseMatrix, setExpenseMatrix] = useState<ExpenseItemEntity[][]>(
        []
    )
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);

    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [expenseFormVisibility, setExpenseFormVisibility] = useState({
        isCreateExpenseVisible: false,
        isUpdateExpenseVisible: false,
    });

    const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>( {
        isConfirmExpenseDestructionModalVisible: false,
    })

    // const [expenseIdToDelete, setExpenseIdToDelete] = useState<string>("");
    const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", oldCategory: "", oldAmount: 0 });
    const [expenseIdToDelete, setExpenseIdToDelete] = useState("");

    useEffect(() => {
        checkForUser()
            .then(userStatus => {
                if (userStatus["loggedIn"]) {
                    console.log("User logged in.");
                } else {
                    console.log("User not logged in, login redirect initiated.");
                    window.location.href = "/login";
                }
            })
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList)
            })
        getExpenseList()
            .then((expenseList: ExpenseItemEntity[]) => {
                setExpenseArray(expenseList)
                const uniqueDates = new Set(expenseList.map(expenseItem => new Date(expenseItem.timestamp).toLocaleDateString()))
                let updatedMatrix: ExpenseItemEntity[][] = []
                uniqueDates.forEach(date => {
                    let constituentExpenseArray: ExpenseItemEntity[] = []
                    expenseList.forEach(expenseItem => {
                        if (new Date(expenseItem.timestamp).toLocaleDateString() === date) {
                            constituentExpenseArray = [...constituentExpenseArray, expenseItem];
                        }
                    })
                    updatedMatrix = [...updatedMatrix, constituentExpenseArray]
                })
                setExpenseMatrix(updatedMatrix)
            })
        .then(() => {
            getGroupList()
                .then((groupList: GroupItemEntity[]) => {
                    setGroupArray(groupList)
                })
        })
        .then(implementDynamicBackgroundHeight)
        .catch(error => console.log(`Unsuccessful expense page data retrieval - error: ${error}`))
    }, []);

    useEffect(() => {
        const uniqueDates = new Set(expenseArray.map(expenseItem => new Date(expenseItem.timestamp).toLocaleDateString()))
        let updatedMatrix: ExpenseItemEntity[][] = []
        uniqueDates.forEach(date => {
            let constituentExpenseArray: ExpenseItemEntity[] = []
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
        console.log(expenseFormVisibility);
    }, [expenseFormVisibility])

    function runExpenseDeletion() {
        handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    return (
        <div className="flex flex-row justify-center items-center">
            <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${((Object.values(expenseFormVisibility).includes(true))
                || Object.values(expenseModalVisibility).includes(true)) && "blur"} px-16`}>

                <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility}/>

                {expenseArray?.length > 0 && expenseMatrix.map((filteredExpenseArray, key) => (
                    <ExpenseDayGroup
                        date={new Date(filteredExpenseArray[0].timestamp).toLocaleDateString()}
                        filteredExpenseArray={filteredExpenseArray}
                        setExpenseArray={setExpenseArray}
                        budgetArray={budgetArray}
                        setBudgetArray={setBudgetArray}
                        groupArray={groupArray}
                        setExpenseFormVisibility={setExpenseFormVisibility}
                        setExpenseModalVisibility={setExpenseModalVisibility}
                        setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                        setExpenseIdToDelete={setExpenseIdToDelete}
                        key={key}/>
                ))}
            </div>

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
                <TwoOptionModal optionOneText="Cancel" optionOneFunction={() => setExpenseModalVisibility(current => ({
                    ...current,
                    isConfirmExpenseDestructionModalVisible: false
                }))} optionTwoText="Confirm" optionTwoFunction={() => {
                    runExpenseDeletion()
                    setExpenseModalVisibility(current => ({
                        ...current,
                        isConfirmExpenseDestructionModalVisible: false
                    }));
                }}
                                setModalFormVisibility={setExpenseModalVisibility}
                                setVisible="isConfirmExpenseDestructionModalVisible"
                                title="Are you sure you want to delete this expense?"/>}

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
        </div>
    );
}