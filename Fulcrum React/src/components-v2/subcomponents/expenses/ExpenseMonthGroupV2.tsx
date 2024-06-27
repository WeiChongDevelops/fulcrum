import {
  BudgetItemEntity,
  CategoryToIconAndColourMap,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  UserPreferences,
} from "@/utility/types.ts";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import ExpenseDayGroupV2 from "@/components-v2/subcomponents/expenses/ExpenseDayGroupV2.tsx";
import CreateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/CreateExpenseFormV2.tsx";
import { capitaliseFirstLetter, expenseStartDate, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseMonthGroupV2Props {
  monthExpenseGroupItem: MonthExpenseGroupEntity;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  activeCarouselIndex: number;
  startingIndex: number;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * Renders the expense logs for a given month.
 */
export const ExpenseMonthGroupV2 = memo(
  ({
    monthExpenseGroupItem,
    setOldExpenseBeingEdited,
    oldExpenseBeingEdited,
    perCategoryExpenseTotalThisMonth,
    activeCarouselIndex,
    startingIndex,
  }: ExpenseMonthGroupV2Props) => {
    const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

    const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
    const categoryToIconAndColourMap: CategoryToIconAndColourMap = useQueryClient().getQueryData([
      "categoryToIconAndColourMap",
      useEmail(),
    ])!;
    const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
    const categoryOptions = !!budgetArray
      ? budgetArray.map((budgetItem) => {
          const dataMapEntry = categoryToIconAndColourMap.get(budgetItem.category);
          return {
            value: budgetItem.category,
            label: capitaliseFirstLetter(budgetItem.category),
            colour: !!dataMapEntry && !!dataMapEntry.colour ? dataMapEntry.colour : "black",
          };
        })
      : [];

    const updateDefaultCalendarDate = () => {
      let defaultCalendarDate = new Date();

      const monthDelta = (activeCarouselIndex - startingIndex) % 12;
      const activeYear = expenseStartDate.getFullYear() + Math.floor(activeCarouselIndex / 12);

      if (monthDelta === 0 && activeYear === defaultCalendarDate.getFullYear()) {
        return new Date();
      }

      const startingMonthIndex = defaultCalendarDate.getMonth();
      defaultCalendarDate.setMonth(startingMonthIndex + monthDelta);
      defaultCalendarDate.setFullYear(activeYear);
      defaultCalendarDate.setDate(1);
      return defaultCalendarDate;
    };

    useEffect(() => {
      setDefaultCalendarDate(updateDefaultCalendarDate);
    }, [activeCarouselIndex]);

    return (
      <div className={"flex flex-col items-center w-full pt-8"}>
        <CreateExpenseFormV2
          defaultCalendarDate={defaultCalendarDate}
          mustBeRecurring={false}
          perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
        />

        {!!monthExpenseGroupItem &&
        !!monthExpenseGroupItem.monthExpenseArray &&
        monthExpenseGroupItem.monthExpenseArray.length > 0 ? (
          monthExpenseGroupItem.monthExpenseArray.map((dayExpenseGroup, key) => {
            return (
              <ExpenseDayGroupV2
                categoryOptions={categoryOptions}
                dayExpenseGroup={dayExpenseGroup}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                oldExpenseBeingEdited={oldExpenseBeingEdited}
                key={key}
              />
            );
          })
        ) : (
          <p className={`text-lg mt-48 select-none ${userPreferences.darkModeEnabled ? "text-white" : "text-black"}`}>
            No expenses added this month.
          </p>
        )}
      </div>
    );
  },
);
