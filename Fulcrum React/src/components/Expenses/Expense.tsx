import {useEffect, useState} from "react";
import {
    BudgetItemEntity,
    categoryListAsOptions,
    ExpenseItemEntity, ExpenseModalVisibility,
    getBudgetList,
    getExpenseList,
    getGroupList,
    GroupColourAndCategories,
    GroupItemEntity,
    groupListAsOptions,
    implementDynamicBackgroundHeight,
    PreviousExpenseBeingEdited,
} from "../../util.ts";
import ExpenseList from "./ExpenseList.tsx";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
import ExpenseCreationForm from "./ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "./ExpenseUpdatingForm.tsx";


export default function Expense() {
    const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]); // We need to maintain this state because each time it changes we use it to update groupColourAndCategoriesArray

    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
    const [groupColourAndCategoriesArray, setGroupColourAndCategoriesArray] = useState<GroupColourAndCategories[]>([]);

    const [expenseFormVisibility, setExpenseFormVisibility] = useState({
        isCreateExpenseVisible: false,
        isUpdateExpenseVisible: false,
    });

    const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>( {
        isConfirmExpenseDestructionModalVisible: false,
    })

    // const [expenseIdToDelete, setExpenseIdToDelete] = useState<string>("");
    const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", oldCategory: "", oldAmount: 0 });

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList)
            })
            .then(() => {
                getExpenseList()
                    .then(expenseList => {
                        setExpenseArray(expenseList)
                    })
            })
            .then(() => {
                getGroupList()
                    .then((groupList: GroupItemEntity[]) => {
                        groupList.forEach(groupEntity => {
                            setGroupColourAndCategoriesArray(current => ([...current, {
                                group: groupEntity.group,
                                categories: budgetArray.filter(budgetItem => budgetItem.group === groupEntity.group)
                            }]))
                        })
                        setGroupArray(groupList)
                    })
            })
            .then(implementDynamicBackgroundHeight)
            .catch(error => console.log(`Unsuccessful expense page data retrieval - error: ${error}`))
    }, []);

    useEffect( () => {
        document.getElementById("category")?.focus()
        console.log(expenseFormVisibility);
    }, [expenseFormVisibility])

    return (
        <div className="flex flex-row justify-center items-center">
            <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${((Object.values(expenseFormVisibility).includes(true))
                || Object.values(expenseModalVisibility).includes(true)) && "blur"} px-16`}>

                <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility}/>

                {expenseArray?.length > 0 && <ExpenseList
                    expenseArray={expenseArray}
                    setExpenseArray={setExpenseArray}
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    groupArray={groupArray}
                    setExpenseFormVisibility={setExpenseFormVisibility}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}/>}
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

// import BudgetList from "./BudgetList.tsx";
// import BudgetCreationForm from "./BudgetCreationForm.tsx";
// import {
//     BudgetItemEntity,
//     getAmountBudgeted,
//     getBudgetList,
//     BasicGroupData
// } from "../../util.ts";
// import { useEffect, useState } from "react";
// import AddNewBudgetButton from "./AddNewBudgetButton.tsx";
// import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
// import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
//
// export default function Expense() {
//     const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
//     const [isCreateBudgetVisible, setIsCreateBudgetVisible] = useState<boolean>(false);
//     const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] = useState<boolean>(false);
//     const [editingCategory, setEditingCategory] = useState<string | null>(null);
//     const [editingOldAmount, setEditingOldAmount] = useState<number>(0);
//     const [totalIncome, setTotalIncome] = useState<number>(1000);
//     const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
//     const [initialGroupOptions, setInitialGroupOptions] = useState<BasicGroupData[] | undefined> ();
//
//     useEffect(() => {
//         getBudgetList()
//             .then(budgetList => {
//                 setBudgetArray(budgetList)
//             })
//         getGroupListAsOptions()
//             .then( results => setInitialGroupOptions(results))
//     }, []);
//
//     useEffect( () => {
//         setAmountLeftToBudget(totalIncome - getAmountBudgeted(budgetArray))
//     },[budgetArray, totalIncome])
//
//     useEffect( () => {
//         document.getElementById("category")?.focus();
//     }, [isCreateBudgetVisible, isUpdateBudgetVisible])
//
//     return (
//         <div>
//             <h1 className="my-6">Budget</h1>
//             <TotalIncomeDisplay totalIncome={totalIncome} setTotalIncome={setTotalIncome} amountLeftToBudget={amountLeftToBudget}/>
//
//
//             <div className={`elementsBelowPopUpForm ${(isCreateBudgetVisible || isUpdateBudgetVisible) && "blur"}
//
//
//             px-16`}>
//
//                 <FulcrumAnimation amountLeftToBudget={amountLeftToBudget} totalIncome={totalIncome}/>
//                 <BudgetList
//                     budgetArray={budgetArray}
//                     setBudgetArray={setBudgetArray}
//                     setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
//                     setEditingCategory={setEditingCategory}
//                     setEditingOldAmount={setEditingOldAmount}
//                 />
//
//             </div>
//             {isCreateBudgetVisible && <BudgetCreationForm setIsCreateBudgetVisible={setIsCreateBudgetVisible}
//                                                           setBudgetArray={setBudgetArray}
//                                                           initialGroupOptions={initialGroupOptions}/>}
//             {isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
//                                                           category={editingCategory}
//                                                           setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
//                                                           oldAmount={editingOldAmount}
//                                                           initialGroupOptions={initialGroupOptions}/>}
//
//             <AddNewBudgetButton setIsFormVisible={setIsCreateBudgetVisible} />
//         </div>
//     );
// }
