import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, getColourOfGroup,
    getGroupOfCategory,
    GroupItemEntity, PreviousExpenseBeingEdited
} from "../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import {Dispatch, SetStateAction} from "react";

interface ExpenseListProps {
    filteredExpenseArray: ExpenseItemEntity[];
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;

    budgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupArray: GroupItemEntity[];

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
}

export default function ExpenseList({ filteredExpenseArray,
                                        setExpenseArray,
                                        budgetArray,
                                        setBudgetArray,
                                        groupArray,
                                        setExpenseFormVisibility,
                                        setExpenseModalVisibility,
                                        setOldExpenseBeingEdited,
                                        setExpenseIdToDelete}: ExpenseListProps) {

    return (
        <div>
            <div>
                {filteredExpenseArray.map((expenseElement, key) => {
                    const groupName = getGroupOfCategory(budgetArray, expenseElement.category)

                    const groupColour = getColourOfGroup(groupName ? groupName : "Miscellaneous" , groupArray)!

                    let iconPath = "/src/assets/category-icons/category-default-icon.svg"
                    try {
                        iconPath = budgetArray.filter(budgetItem => budgetItem.category === expenseElement.category)[0].iconPath
                    } catch (e) {
                        console.error(`iconPath retrieval for category ${expenseElement.category} failed. Temporarily assuming default.`)
                    }

                    return <ExpenseItem
                        expenseId={expenseElement.expenseId}
                        category={expenseElement.category}
                        amount={expenseElement.amount}
                        iconPath={iconPath}
                        groupName={groupName ? groupName : "Miscellaneous" }
                        groupColour={groupColour}
                        setExpenseArray={setExpenseArray}
                        setBudgetArray={setBudgetArray}
                        setExpenseFormVisibility={setExpenseFormVisibility}
                        setExpenseModalVisibility={setExpenseModalVisibility}
                        setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                        setExpenseIdToDelete={setExpenseIdToDelete}
                        key={key}
                    />
                })}
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
