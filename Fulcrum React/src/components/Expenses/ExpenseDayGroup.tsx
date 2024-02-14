import {
    CategoryToIconGroupAndColourMap, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, formatDate, formatDollarAmountStatic,
    PreviousExpenseBeingEdited, PublicUserData
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

    publicUserData: PublicUserData;
}

export default function ExpenseDayGroup({ date,
                                            filteredExpenseArray,
                                            setExpenseFormVisibility,
                                            setExpenseModalVisibility,
                                            setOldExpenseBeingEdited,
                                            setExpenseIdToDelete,
                                            categoryDataMap,
                                            publicUserData}: ExpenseDayGroupProps) {

    const expenseDayGroupDate = date.toLocaleDateString();
    const dateStringToday = new Date().toLocaleDateString();
    let dateObjectYesterday = new Date();
    dateObjectYesterday.setDate(new Date().getDate() - 1);
    const dateString = dateObjectYesterday.toLocaleDateString();
    const dayTotal = filteredExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

    return (
        <div className="my-4">
            <div className={`flex flex-row justify-between items-center relative ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
                <p className="text-4xl font-bold">{expenseDayGroupDate === dateStringToday ? "Today" : expenseDayGroupDate === dateString ? "Yesterday" : formatDate(new Date(date))}</p>
                <div className={`dotted-line ${publicUserData.darkModeEnabled && "dotted-line-dark"}`}></div>
                <p className="text-4xl font-bold">{formatDollarAmountStatic(dayTotal, publicUserData.currency)}</p>
            </div>
            {filteredExpenseArray.length > 0 && <ExpenseList
                filteredExpenseArray={filteredExpenseArray}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseIdToDelete={setExpenseIdToDelete}
                categoryDataMap={categoryDataMap}
                publicUserData={publicUserData}/>}
        </div>
    );
}
