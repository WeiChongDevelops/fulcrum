import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, getColourOfGroup,
    getGroupOfCategory,
    GroupItemEntity, PreviousExpenseBeingEdited
} from "../../util.ts";
import ExpenseItem from "./ExpenseItem.tsx";
import {Dispatch, SetStateAction} from "react";

interface ExpenseListProps {
    expenseArray: ExpenseItemEntity[];
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;

    budgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupArray: GroupItemEntity[];

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
}

export default function ExpenseList({ expenseArray,
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
                {expenseArray.map((expenseElement, key) => {

                    // Search through groupColourAndCategoriesArray for the expense using filter, and give that items values to the ExpenseItem component below
                    // const expenseItemGroupData = groupColourAndCategoriesArray.filter(
                    //     groupColourAndCategoriesItem => groupColourAndCategoriesItem.categories.filter(budgetItem => (
                    //         budgetItem.category === expenseElement.category
                    //     ))[0]
                    // )[0]
                    // const expenseItemGroupData = groupColourAndCategoriesArray.filter(groupColourAndCategoriesItem => groupColourAndCategoriesItem.categories.includes(expenseElement.category))
                    // export interface GroupColourAndCategories {
                    //     group: string
                    //     categories: BudgetItemEntity[]
                    // }
                    // export interface ExpenseItemEntity {
                    //     expenseId: string
                    //     category: string
                    //     amount: number
                    //     timestamp: Date
                    // }


                    // So with the expense creatable select we're seeing expenseElement.category == [new category that doesn't exist yet because it was created in the expense page]

                    const groupName = getGroupOfCategory(budgetArray, expenseElement.category)
                    const groupColour = getColourOfGroup(groupName, groupArray)!

                    const iconPath = budgetArray.filter(budgetItem => budgetItem.category === expenseElement.category)[0].iconPath

                    return <ExpenseItem
                        expenseId={expenseElement.expenseId}
                        category={expenseElement.category}
                        amount={expenseElement.amount}
                        iconPath={iconPath}
                        groupName={groupName}
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
