import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, formatDate, formatDollarAmount, getBudgetList,
    GroupItemEntity, PreviousExpenseBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect} from "react";
import ExpenseList from "./ExpenseList.tsx";
import "../../css/Expense.css"

interface ExpenseDayGroupProps {

    date: Date;
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

export default function ExpenseDayGroup({ date,
                                            filteredExpenseArray,
                                            setExpenseArray,
                                            budgetArray,
                                            setBudgetArray,
                                            groupArray,
                                            setExpenseFormVisibility,
                                            setExpenseModalVisibility,
                                            setOldExpenseBeingEdited,
                                            setExpenseIdToDelete}: ExpenseDayGroupProps) {

    useEffect(() => {
        getBudgetList()
            .then((budgetList: BudgetItemEntity[]) => {
                setBudgetArray(budgetList)
            })
    }, []);

    const expenseDayGroupDate = date.toLocaleDateString();
    const dateStringToday = new Date().toLocaleDateString();
    let dateObjectYesterday = new Date();
    dateObjectYesterday.setDate(new Date().getDate() - 1);
    const dateString = dateObjectYesterday.toLocaleDateString();

    const dayTotal = filteredExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

    return (
        <div className="my-4">
            <div className="flex flex-row justify-between items-center text-black relative">
                <p className="text-4xl font-bold">{expenseDayGroupDate === dateStringToday ? "Today" : expenseDayGroupDate === dateString ? "Yesterday" : formatDate(new Date(date))}</p>
                <div className="dotted-line"></div>
                <p className="text-4xl font-bold">${formatDollarAmount(dayTotal)}</p>
            </div>
            {filteredExpenseArray.length > 0 && <ExpenseList
                filteredExpenseArray={filteredExpenseArray}
                setExpenseArray={setExpenseArray}
                budgetArray={budgetArray}
                setBudgetArray={setBudgetArray}
                groupArray={groupArray}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseIdToDelete={setExpenseIdToDelete}/>}
        </div>
    );
}
