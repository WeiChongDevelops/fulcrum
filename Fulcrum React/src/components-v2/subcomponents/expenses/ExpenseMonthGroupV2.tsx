import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../utility/types.ts";
import { Dispatch, memo, SetStateAction } from "react";
import AddNewExpenseButton from "../../../components/child/expenses/buttons/AddNewExpenseButton.tsx";
import ExpenseDayGroupV2 from "@/components-v2/subcomponents/expenses/ExpenseDayGroupV2.tsx";
import CreateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/CreateExpenseFormV2.tsx";
import { capitaliseFirstLetter } from "@/utility/util.ts";

interface ExpenseMonthGroupV2Props {
  budgetArray: BudgetItemEntity[];
  monthExpenseGroupItem: MonthExpenseGroupEntity;
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  publicUserData: PublicUserData;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * Renders the expense logs for a given month.
 */
export const ExpenseMonthGroupV2 = memo(
  ({
    budgetArray,
    monthExpenseGroupItem,
    setExpenseFormVisibility,
    setExpenseModalVisibility,
    setOldExpenseBeingEdited,
    setExpenseItemToDelete,
    categoryDataMap,
    publicUserData,
    oldExpenseBeingEdited,
    setDefaultCalendarDate,
    perCategoryExpenseTotalThisMonth,
  }: ExpenseMonthGroupV2Props) => {
    const categoryOptions = budgetArray.map((budgetItem) => {
      const dataMapEntry = categoryDataMap.get(budgetItem.category);
      return {
        value: budgetItem.category,
        label: capitaliseFirstLetter(budgetItem.category),
        colour: !!dataMapEntry && !!dataMapEntry.colour ? dataMapEntry.colour : "black",
      };
    });
    return (
      <div className={"flex flex-col items-center w-full pt-8"}>
        <CreateExpenseFormV2
          categoryDataMap={categoryDataMap}
          budgetArray={budgetArray}
          defaultCalendarDate={new Date()}
          mustBeRecurring={false}
          publicUserData={publicUserData}
          perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
        />

        {monthExpenseGroupItem.monthExpenseArray.length > 0 ? (
          monthExpenseGroupItem.monthExpenseArray.map((dayExpenseGroup, key) => {
            return (
              <ExpenseDayGroupV2
                categoryOptions={categoryOptions}
                dayExpenseGroup={dayExpenseGroup}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseItemToDelete={setExpenseItemToDelete}
                categoryDataMap={categoryDataMap}
                publicUserData={publicUserData}
                oldExpenseBeingEdited={oldExpenseBeingEdited}
                key={key}
              />
            );
          })
        ) : (
          <p className={`text-lg mt-48 select-none ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
            No expenses added this month.
          </p>
        )}
      </div>
    );
  },
);
