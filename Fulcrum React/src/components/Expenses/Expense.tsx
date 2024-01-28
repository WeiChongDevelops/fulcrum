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
    GroupItemEntity,
    handleExpenseDeletion,
    implementDynamicBackgroundHeight,
    PreviousExpenseBeingEdited,
} from "../../util.ts";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
import ExpenseCreationForm from "../ModalsAndForms/ExpenseCreationForm.tsx";
import ExpenseUpdatingForm from "../ModalsAndForms/ExpenseUpdatingForm.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";
import "../../css/Expense.css"
import Loader from "../Other/Loader.tsx";


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
    const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);

    const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", oldCategory: "", oldAmount: 0 });
    const [expenseIdToDelete, setExpenseIdToDelete] = useState("");

    const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());

    const [isLoading, setIsLoading] = useState(true);

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
                const [budgetList, expenseList, groupList] = await Promise.all([
                    getBudgetList(),
                    getExpenseList(),
                    getGroupList(),
                ]);
                setBudgetArray(budgetList);
                setExpenseArray(expenseList);
                setGroupArray(groupList);

                // Await next render after state updates, before populating map; to avoid undefined errors.
                await new Promise(resolve => setTimeout(resolve, 0));
                const categoryMap = await getGroupAndColourMap(budgetList, groupList);
                setCategoryDataMap(categoryMap);

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
        setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility))
    }, [expenseFormVisibility, expenseModalVisibility])

    function runExpenseDeletion() {
        handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }


    return (
        <>
            {!isLoading ? <div className="flex flex-col justify-center items-center">
                <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility) && "blur"} px-16`}>

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
                                        setModalFormVisibility={setExpenseModalVisibility}
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

// import {useEffect, useState} from "react";
// import {
//     BudgetItemEntity,
//     categoryListAsOptions,
//     CategoryToIconGroupAndColourMap,
//     checkForOpenExpenseModalOrForm,
//     checkForUser,
//     ExpenseItemEntity,
//     ExpenseModalVisibility,
//     getBudgetList,
//     getExpenseList,
//     getGroupAndColourMap,
//     getGroupList,
//     GroupItemEntity,
//     handleExpenseDeletion,
//     implementDynamicBackgroundHeight,
//     PreviousExpenseBeingEdited,
// } from "../../util.ts";
// import AddNewExpenseButton from "./AddNewExpenseButton.tsx";
// import ExpenseCreationForm from "../ModalsAndForms/ExpenseCreationForm.tsx";
// import ExpenseUpdatingForm from "../ModalsAndForms/ExpenseUpdatingForm.tsx";
// import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
// import ExpenseDayGroup from "./ExpenseDayGroup.tsx";
// import "../../css/Expense.css"
// import Loader from "../Other/Loader.tsx";
//
//
// export default function Expense() {
//     const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
//     const [expenseMatrix, setExpenseMatrix] = useState<ExpenseItemEntity[][]>(
//         []
//     )
//     const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
//
//     const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
//
//     const [expenseFormVisibility, setExpenseFormVisibility] = useState({
//         isCreateExpenseVisible: false,
//         isUpdateExpenseVisible: false,
//     });
//
//     const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>( {
//         isConfirmExpenseDestructionModalVisible: false,
//     })
//     const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);
//
//     const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({ expenseId: "", oldCategory: "", oldAmount: 0 });
//     const [expenseIdToDelete, setExpenseIdToDelete] = useState("");
//
//     const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(() => getGroupAndColourMap(budgetArray, groupArray));
//
//     const [isLoading, setIsLoading] = useState(true);
//
//     useEffect(() => {
//         async function retrieveInitialData() {
//             await checkForUser()
//                 .then(userStatus => {
//                     if (userStatus["loggedIn"]) {
//                         console.log("User logged in.");
//                     } else {
//                         console.log("User not logged in, login redirect initiated.");
//                         window.location.href = "/login";
//                     }
//                 })
//             setBudgetArray(await getBudgetList());
//             setExpenseArray(await getExpenseList());
//             setGroupArray(await getGroupList());
//             setCategoryDataMap(await getGroupAndColourMap(budgetArray, groupArray));
//             await implementDynamicBackgroundHeight()
//             setIsLoading(false)
//         }
//         retrieveInitialData()
//             .catch(error => console.log(`Unsuccessful expense page data retrieval - error: ${error}`))
//     }, []);
//
//     useEffect(() => {
//         getGroupList()
//             .then((groupList: GroupItemEntity[]) => {
//                 setGroupArray(groupList)
//             })
//         const uniqueDates = new Set(expenseArray.map(expenseItem => new Date(expenseItem.timestamp).toLocaleDateString()))
//         let updatedMatrix: ExpenseItemEntity[][] = []
//         uniqueDates.forEach(date => {
//             let constituentExpenseArray: ExpenseItemEntity[] = []
//             expenseArray.forEach(expenseItem => {
//                 if (new Date(expenseItem.timestamp).toLocaleDateString() === date) {
//                     constituentExpenseArray = [...constituentExpenseArray, expenseItem];
//                 }
//             })
//             updatedMatrix = [...updatedMatrix, constituentExpenseArray]
//         })
//         setExpenseMatrix(updatedMatrix)
//     }, [expenseArray]);
//
//     useEffect( () => {
//         document.getElementById("category")?.focus()
//         console.log(expenseFormVisibility);
//         setIsExpenseFormOrModalOpen(checkForOpenExpenseModalOrForm(expenseFormVisibility, expenseModalVisibility))
//     }, [expenseFormVisibility, expenseModalVisibility])
//
//     // useEffect( () => {
//     //     // State here is used for conditional blurring, local variable is used for button disabling.
//     //     const FormOrModalOpenOnThisRender = checkForOpenExpenseModalOrForm(expenseFormVisibility, expenseModalVisibility)
//     //     setIsExpenseFormOrModalOpen(checkForOpenExpenseModalOrForm(expenseFormVisibility, expenseModalVisibility));
//     //
//     //     const buttons = document.querySelectorAll(".elementsBelowPopUpForm button") as NodeListOf<HTMLButtonElement>
//     //     buttons.forEach(button => {
//     //         button.disabled = FormOrModalOpenOnThisRender;
//     //     })
//     // },[expenseFormVisibility, expenseModalVisibility])
//
//     function runExpenseDeletion() {
//         handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
//             .then(() => console.log("Deletion successful"))
//             .catch(() => console.log("Deletion unsuccessful"));
//     }
//
//
//     return (
//         <>
//             {!isLoading ? <div className="flex flex-row justify-center items-center">
//                 <div className={`flex flex-col elementsBelowPopUpForm z-2
//             ${checkForOpenExpenseModalOrForm(expenseFormVisibility, expenseModalVisibility) && "blur"} px-16`}>
//
//                     <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility}/>
//
//                     {expenseArray?.length > 0 && expenseMatrix.map((filteredExpenseArray, key) => (
//                         <ExpenseDayGroup
//                             date={new Date(filteredExpenseArray[0].timestamp)}
//                             filteredExpenseArray={filteredExpenseArray}
//                             budgetArray={budgetArray}
//                             groupArray={groupArray}
//                             setExpenseFormVisibility={setExpenseFormVisibility}
//                             setExpenseModalVisibility={setExpenseModalVisibility}
//                             setOldExpenseBeingEdited={setOldExpenseBeingEdited}
//                             setExpenseIdToDelete={setExpenseIdToDelete}
//                             categoryDataMap={categoryDataMap}
//                             setCategoryDataMap={setCategoryDataMap}
//                             key={key}/>
//                     ))}
//                 </div>
//
//                 {isExpenseFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}
//
//                 <div className="z-4">
//                     {expenseFormVisibility.isCreateExpenseVisible && <ExpenseCreationForm
//                         setExpenseFormVisibility={setExpenseFormVisibility}
//                         setExpenseArray={setExpenseArray}
//                         setBudgetArray={setBudgetArray}
//                         budgetArray={budgetArray}
//                         categoryOptions={categoryListAsOptions(budgetArray, groupArray)}/>}
//                     {expenseFormVisibility.isUpdateExpenseVisible &&
//                         <ExpenseUpdatingForm setExpenseFormVisibility={setExpenseFormVisibility}
//                                              setExpenseArray={setExpenseArray} setBudgetArray={setBudgetArray}
//                                              categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
//                                              oldExpenseBeingEdited={oldExpenseBeingEdited}/>}
//
//                     {expenseModalVisibility.isConfirmExpenseDestructionModalVisible &&
//                         <TwoOptionModal optionOneText="Cancel"
//                                         optionOneFunction={() => setExpenseModalVisibility(current => ({
//                                             ...current,
//                                             isConfirmExpenseDestructionModalVisible: false
//                                         }))} optionTwoText="Confirm" optionTwoFunction={() => {
//                             runExpenseDeletion()
//                             setExpenseModalVisibility(current => ({
//                                 ...current,
//                                 isConfirmExpenseDestructionModalVisible: false
//                             }));
//                         }}
//                                         setModalFormVisibility={setExpenseModalVisibility}
//                                         isVisible="isConfirmExpenseDestructionModalVisible"
//                                         title="Are you sure you want to delete this expense?"/>}
//                 </div>
//
//                 {/*<ExpenseModalsAndForms setModalFormVisibility={setModalFormVisibility}*/}
//                 {/*                      setBudgetArray={setBudgetArray}*/}
//                 {/*                      groupArray={groupArray}*/}
//                 {/*                      groupNameOfNewItem={groupNameOfNewItem}*/}
//                 {/*                      setBudgetFormVisibility={setBudgetFormVisibility}*/}
//                 {/*                      oldBudgetBeingEdited={oldBudgetBeingEdited}*/}
//                 {/*                      setGroupArray={setGroupArray}*/}
//                 {/*                      oldGroupBeingEdited={oldGroupBeingEdited}*/}
//                 {/*                      groupToDelete={groupToDelete}*/}
//                 {/*                      categoryToDelete={categoryToDelete}*/}
//                 {/*                      runGroupDeletionWithUserPreference={runGroupDeletionWithUserPreference}*/}
//                 {/*                      modalFormVisibility={modalFormVisibility}*/}
//                 {/*                      setModalFormVisibility={setModalFormVisibility}/>*/}
//             </div>: <Loader isLoading={isLoading}/>}
//         </>
//     );
// }