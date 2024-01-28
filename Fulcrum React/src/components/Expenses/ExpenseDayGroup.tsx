import {
    CategoryToIconGroupAndColourMap, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, formatDate, formatDollarAmountStatic,
    PreviousExpenseBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import ExpenseList from "./ExpenseList.tsx";
import "../../css/Expense.css"

interface ExpenseDayGroupProps {

    date: Date;
    filteredExpenseArray: ExpenseItemEntity[];

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;

    categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function ExpenseDayGroup({ date,
                                            filteredExpenseArray,
                                            setExpenseFormVisibility,
                                            setExpenseModalVisibility,
                                            setOldExpenseBeingEdited,
                                            setExpenseIdToDelete,
                                            categoryDataMap}: ExpenseDayGroupProps) {

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
                <p className="text-4xl font-bold">${formatDollarAmountStatic(dayTotal)}</p>
            </div>
            {filteredExpenseArray.length > 0 && <ExpenseList
                filteredExpenseArray={filteredExpenseArray}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseIdToDelete={setExpenseIdToDelete}
                categoryDataMap={categoryDataMap}/>}
        </div>
    );
}
