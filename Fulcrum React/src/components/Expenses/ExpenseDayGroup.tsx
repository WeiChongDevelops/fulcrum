import {
    BudgetItemEntity, ExpenseFormVisibility,
    ExpenseItemEntity, ExpenseModalVisibility,
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

    return (
        <div className="my-4">
            <h1 className="text-black">{date === dateStringToday ? "Today" : date === dateString ? "Yesterday" : date}</h1>
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
