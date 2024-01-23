import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility, formatDate, formatDollarAmount, getGroupList,
    GroupItemEntity, PreviousExpenseBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect} from "react";
import ExpenseList from "./ExpenseList.tsx";
import "../../css/Expense.css"

interface ExpenseMonthGroupProps {

    date: Date;
    filteredExpenseArray: ExpenseItemEntity[];

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;

    budgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupArray: GroupItemEntity[];
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;

}

export default function ExpenseMonthGroup({ date,
                                            filteredExpenseArray,
                                            setExpenseArray,
                                            budgetArray,
                                            setBudgetArray,
                                            groupArray,
                                            setGroupArray,
                                            setExpenseFormVisibility,
                                            setExpenseModalVisibility,
                                            setOldExpenseBeingEdited,
                                            setExpenseIdToDelete}: ExpenseMonthGroupProps) {

    useEffect(() => {
        getGroupList()
            .then((groupList: GroupItemEntity[]) => {
                setGroupArray(groupList)
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
