import {
    BudgetItemEntity,
    categoryListAsOptions,
    getBudgetList,
    getColourOfGroup,
    getGroupList,
    getGroupOfCategory,
    getRecurringExpenseList,
    GroupItemEntity, handleRecurringExpenseDeletion,
    PreviousRecurringExpenseBeingEdited,
    RecurringExpenseFormVisibility,
    RecurringExpenseItemEntity,
    RecurringExpenseModalVisibility
} from "../../util.ts";
import {useEffect, useState} from "react";
import RecurringExpenseItem from "./RecurringExpenseItem.tsx";
import TwoOptionModal from "../ModalsAndForms/TwoOptionModal.tsx";
import RecurringExpenseUpdatingForm from "../ModalsAndForms/RecurringExpenseUpdatingForm.tsx";

export default function RecurringExpenses() {

    const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
    const [recurringExpenseModalVisibility, setRecurringExpenseModalVisibility] = useState<RecurringExpenseModalVisibility>({
        isConfirmRecurringExpenseDestructionModalVisible: false,
    });
    const [recurringExpenseFormVisibility, setRecurringExpenseFormVisibility] = useState<RecurringExpenseFormVisibility>({
        isUpdateRecurringExpenseVisible: false
    });

    const [oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited] = useState<PreviousRecurringExpenseBeingEdited>({ recurringExpenseId: "", oldCategory: "", oldAmount: 0, oldFrequency: "annually" });
    const [recurringExpenseIdToDelete, setRecurringExpenseIdToDelete] = useState("");

    useEffect(() => {
        async function retrieveData() {
            setRecurringExpenseArray(await getRecurringExpenseList());
            setBudgetArray(await getBudgetList());
            setGroupArray(await getGroupList());
        }
        retrieveData();
    }, []);

    function runRecurringExpenseDeletion() {
        handleRecurringExpenseDeletion(recurringExpenseIdToDelete, setRecurringExpenseArray, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    return (
        <div>
            <div>
                {recurringExpenseArray.map((recurringExpenseItem, key) => {
                    const groupName = getGroupOfCategory(budgetArray, recurringExpenseItem.category)

                    const groupColour = getColourOfGroup(groupName ? groupName : "Miscellaneous" , groupArray)!

                    let iconPath = "/src/assets/category-icons/category-default-icon.svg"
                    try {
                        iconPath = budgetArray.filter((budgetItem: BudgetItemEntity) => budgetItem.category === recurringExpenseItem.category)[0].iconPath
                    } catch (e) {
                        console.error(`iconPath retrieval for category ${recurringExpenseItem.category} failed. Temporarily assuming default.`)
                    }

                    return <RecurringExpenseItem
                        recurringExpenseId={recurringExpenseItem.recurringExpenseId}
                        category={recurringExpenseItem.category}
                        amount={recurringExpenseItem.amount}
                        iconPath={iconPath}
                        groupName={groupName ? groupName : "Miscellaneous" }
                        groupColour={groupColour}
                        setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                        setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
                        setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
                        setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
                        key={key}
                    />
                })}
            </div>
            <div className="z-4">
                {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible &&
                    <RecurringExpenseUpdatingForm setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                                                  setRecurringExpenseArray={setRecurringExpenseArray} setBudgetArray={setBudgetArray}
                                                  categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                                  oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}/>}

                {recurringExpenseModalVisibility.isConfirmRecurringExpenseDestructionModalVisible &&
                    <TwoOptionModal optionOneText="Cancel"
                                    optionOneFunction={() => setRecurringExpenseModalVisibility(current => ({
                                        ...current,
                                        isConfirmExpenseDestructionModalVisible: false
                                    }))} optionTwoText="Confirm" optionTwoFunction={() => {
                        runRecurringExpenseDeletion()
                        setRecurringExpenseModalVisibility(current => ({
                            ...current,
                            isConfirmExpenseDestructionModalVisible: false
                        }));
                    }}
                                    setModalFormVisibility={setRecurringExpenseModalVisibility}
                                    isVisible="isConfirmExpenseDestructionModalVisible"
                                    title="Are you sure you want to delete this expense?"/>}
            </div>
        </div>
    );
}
// import {
//     BudgetItemEntity, ExpenseFormVisibility,
//     ExpenseItemEntity, ExpenseModalVisibility, getColourOfGroup,
//     getGroupOfCategory,
//     GroupItemEntity, PreviousExpenseBeingEdited
// } from "../../util.ts";
// import ExpenseItem from "./ExpenseItem.tsx";
// import {Dispatch, SetStateAction} from "react";
//
// interface ExpenseListProps {
//     expenseArray: ExpenseItemEntity[];
//     setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
//
//     budgetArray: BudgetItemEntity[];
//     setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
//
//     groupArray: GroupItemEntity[];
//
//     setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
//     setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;
//
//     setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
//     setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
// }
//
// export default function ExpenseList({ expenseArray,
//                                         setExpenseArray,
//                                         budgetArray,
//                                         setBudgetArray,
//                                         groupArray,
//                                         setExpenseFormVisibility,
//                                         setExpenseModalVisibility,
//                                         setOldExpenseBeingEdited,
//                                         setExpenseIdToDelete}: ExpenseListProps) {
//
//     return (
//         <div>
//             <div>
//                 {expenseArray.map((expenseElement, key) => {
//                     const groupName = getGroupOfCategory(budgetArray, expenseElement.category)
//                     const groupColour = getColourOfGroup(groupName, groupArray)!
//
//                     const iconPath = budgetArray.filter(budgetItem => budgetItem.category === expenseElement.category)[0].iconPath
//
//                     return <ExpenseItem
//                         expenseId={expenseElement.expenseId}
//                         category={expenseElement.category}
//                         amount={expenseElement.amount}
//                         iconPath={iconPath}
//                         groupName={groupName}
//                         groupColour={groupColour}
//                         setExpenseArray={setExpenseArray}
//                         setBudgetArray={setBudgetArray}
//                         setExpenseFormVisibility={setExpenseFormVisibility}
//                         setExpenseModalVisibility={setExpenseModalVisibility}
//                         setOldExpenseBeingEdited={setOldExpenseBeingEdited}
//                         setExpenseIdToDelete={setExpenseIdToDelete}
//                         key={key}
//                     />
//                 })}
//             </div>
//         </div>
//     );
// }
