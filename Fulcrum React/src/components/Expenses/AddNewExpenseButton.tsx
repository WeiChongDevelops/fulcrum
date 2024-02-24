import {Dispatch, SetStateAction} from "react";
import {ExpenseFormVisibility, MonthExpenseGroupEntity} from "../../util.ts";

interface AddNewBudgetButtonProps {
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    isDarkMode: boolean;
    setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
    monthExpenseGroupItem: MonthExpenseGroupEntity;
}

export default function AddNewExpenseButton({ setExpenseFormVisibility, isDarkMode, setDefaultCalendarDate, monthExpenseGroupItem }: AddNewBudgetButtonProps) {

    async function handleClick() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const clickedMonth = monthExpenseGroupItem.monthIndex;
        const clickedYear = monthExpenseGroupItem.year;

        if (currentMonth === clickedMonth && currentYear === clickedYear) {
            setDefaultCalendarDate(new Date());
        } else {
            setDefaultCalendarDate(new Date(monthExpenseGroupItem.year, monthExpenseGroupItem.monthIndex, 1, 0, 0, 0))
        }
        setExpenseFormVisibility(current => ({...current, isCreateExpenseVisible: true}))
    }

    return (
        <button className={`create-expense-button ${isDarkMode && "create-expense-button-dark"} rounded-2xl mt-4 w-[95vw]`} onClick={handleClick}>
            <p className="text-2xl font-bold">+</p>
        </button>
    )
}