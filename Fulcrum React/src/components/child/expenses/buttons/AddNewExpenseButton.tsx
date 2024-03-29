import { Dispatch, SetStateAction } from "react";
import { ExpenseFormVisibility, MonthExpenseGroupEntity, SetFormVisibility } from "../../../../util.ts";

interface AddNewExpenseButtonProps {
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  isDarkMode: boolean;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
  monthExpenseGroupItem: MonthExpenseGroupEntity;
}

/**
 * Button to add a new expense log.
 */
export default function AddNewExpenseButton({
  setExpenseFormVisibility,
  isDarkMode,
  setDefaultCalendarDate,
  monthExpenseGroupItem,
}: AddNewExpenseButtonProps) {
  async function handleClick() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const clickedMonth = monthExpenseGroupItem.monthIndex;
    const clickedYear = monthExpenseGroupItem.year;

    // If the current calendar month is the one shown, default new expenses to today's date
    if (currentMonth === clickedMonth && currentYear === clickedYear) {
      setDefaultCalendarDate(new Date());
    } else {
      // Otherwise default new expenses to the first of that month's date
      setDefaultCalendarDate(new Date(monthExpenseGroupItem.year, monthExpenseGroupItem.monthIndex, 1, 0, 0, 0));
    }
    setExpenseFormVisibility((current) => ({
      ...current,
      isCreateExpenseVisible: true,
    }));
  }

  return (
    <button className={`create-expense-button ${isDarkMode && "create-expense-button-dark"}`} onClick={handleClick}>
      <p className="text-2xl font-bold">+</p>
    </button>
  );
}
