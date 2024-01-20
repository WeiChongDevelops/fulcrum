import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, formatDollarAmount,
    GroupItemEntity, PreviousExpenseBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import ExpenseList from "./ExpenseList.tsx";

interface ExpenseDayGroupProps {

    date: string;
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

    const dateStringToday = new Date().toLocaleDateString();
    let dateObjectYesterday = new Date();
    dateObjectYesterday.setDate(new Date().getDate() - 1);
    const dateString = dateObjectYesterday.toLocaleDateString();

    const dayTotal = filteredExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

    return (
        <div className="my-4">
            <div className="dashed-expense-day-group flex flex-row justify-between items-center text-black">
                <h1>{date === dateStringToday ? "Today" : date === dateString ? "Yesterday" : date}</h1>
                <div className="border-dashed left-0 right-0 w"></div>
                <h1>${formatDollarAmount(dayTotal)}</h1>
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
