import {
    CategoryToIconGroupAndColourMap, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility,
    PreviousExpenseBeingEdited
} from "../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import {Dispatch, SetStateAction} from "react";

interface ExpenseListProps {
    filteredExpenseArray: ExpenseItemEntity[];

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;

    categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function ExpenseList({ filteredExpenseArray,
                                        setExpenseFormVisibility,
                                        setExpenseModalVisibility,
                                        setOldExpenseBeingEdited,
                                        setExpenseIdToDelete,
                                        categoryDataMap}: ExpenseListProps) {

    return (
        <div>
            <div>
                {filteredExpenseArray.map((expenseElement, key) => {
                    return <ExpenseItem
                        expenseId={expenseElement.expenseId}
                        category={expenseElement.category}
                        amount={expenseElement.amount}
                        iconPath={categoryDataMap.get(expenseElement.category)!.iconPath}
                        groupName={categoryDataMap.get(expenseElement.category)!.group}
                        groupColour={categoryDataMap.get(expenseElement.category)!.colour}
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
