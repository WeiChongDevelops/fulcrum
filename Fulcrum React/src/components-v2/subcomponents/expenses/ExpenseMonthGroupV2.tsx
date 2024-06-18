import {
  BudgetItemEntity,
  CategoryToIconAndColourMap,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  UserPreferences,
} from "@/utility/types.ts";
import { Dispatch, memo, SetStateAction } from "react";
import ExpenseDayGroupV2 from "@/components-v2/subcomponents/expenses/ExpenseDayGroupV2.tsx";
import CreateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/CreateExpenseFormV2.tsx";
import { capitaliseFirstLetter, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseMonthGroupV2Props {
  monthExpenseGroupItem: MonthExpenseGroupEntity;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
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
  }: ExpenseMonthGroupV2Props) => {
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
    return (
      <div className={"flex flex-col items-center w-full pt-8"}>
        <CreateExpenseFormV2
          defaultCalendarDate={new Date()}
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
