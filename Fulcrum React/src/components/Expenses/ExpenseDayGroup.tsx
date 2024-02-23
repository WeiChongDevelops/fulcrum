import {
    CategoryToIconGroupAndColourMap, DayExpenseGroupEntity, ExpenseFormVisibility,
    ExpenseModalVisibility, formatDate, formatDollarAmountStatic,
    PreviousExpenseBeingEdited, PublicUserData
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import ExpenseList from "./ExpenseList.tsx";
import "../../css/Expense.css"

interface ExpenseDayGroupProps {
    dayExpenseGroup: DayExpenseGroupEntity;

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;

    categoryDataMap: CategoryToIconGroupAndColourMap;

    publicUserData: PublicUserData;
}

export default function ExpenseDayGroup({ dayExpenseGroup,
                                            setExpenseFormVisibility,
                                            setExpenseModalVisibility,
                                            setOldExpenseBeingEdited,
                                            setExpenseIdToDelete,
                                            categoryDataMap,
                                            publicUserData}: ExpenseDayGroupProps) {

    const expenseDayGroupCalendarDate = new Date(dayExpenseGroup.calendarDate).toLocaleDateString();
    const dateStringToday = new Date().toLocaleDateString();
    let dateObjectYesterday = new Date();
    dateObjectYesterday.setDate(new Date().getDate() - 1);
    const dateString = dateObjectYesterday.toLocaleDateString();
    const dayTotal = dayExpenseGroup.dayExpenseArray.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0);

    return (
        <div className="my-4">
            <div className={`flex flex-row justify-between items-center relative ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
                <p className="text-4xl font-bold">{expenseDayGroupCalendarDate === dateStringToday ? "Today" : expenseDayGroupCalendarDate === dateString ? "Yesterday" : formatDate(dayExpenseGroup.calendarDate)}</p>
                <div className={`dotted-line ${publicUserData.darkModeEnabled && "dotted-line-dark"}`}></div>
                <p className="text-4xl font-bold">{formatDollarAmountStatic(dayTotal, publicUserData.currency)}</p>
            </div>
            {dayExpenseGroup.dayExpenseArray.length > 0 && <ExpenseList
                dayExpenseArray={dayExpenseGroup.dayExpenseArray}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseIdToDelete={setExpenseIdToDelete}
                categoryDataMap={categoryDataMap}
                publicUserData={publicUserData}/>}
        </div>
    );
}
