import {
  CategoryToIconGroupAndColourMap,
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

interface ExpenseMonthGroupV2Props {
  monthExpenseGroupItem: MonthExpenseGroupEntity;
  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  publicUserData: PublicUserData;
  setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
}

/**
 * Renders the expense logs for a given month.
 */
export const ExpenseMonthGroupV2 = memo(
  ({
    monthExpenseGroupItem,
    setExpenseFormVisibility,
    setExpenseModalVisibility,
    setOldExpenseBeingEdited,
    setExpenseItemToDelete,
    categoryDataMap,
    publicUserData,
    setDefaultCalendarDate,
  }: ExpenseMonthGroupV2Props) => {
    return (
      <div className={"flex flex-col items-center w-full"}>
        <AddNewExpenseButton
          setExpenseFormVisibility={setExpenseFormVisibility}
          isDarkMode={publicUserData.darkModeEnabled}
          setDefaultCalendarDate={setDefaultCalendarDate}
          monthExpenseGroupItem={monthExpenseGroupItem}
        />

        {monthExpenseGroupItem.monthExpenseArray.length > 0 ? (
          monthExpenseGroupItem.monthExpenseArray.map((dayExpenseGroup, key) => {
            return (
              <ExpenseDayGroupV2
                dayExpenseGroup={dayExpenseGroup}
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseModalVisibility={setExpenseModalVisibility}
                setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                setExpenseItemToDelete={setExpenseItemToDelete}
                categoryDataMap={categoryDataMap}
                publicUserData={publicUserData}
                key={key}
              />
            );
          })
        ) : (
          <p className={`text-2xl mt-48 select-none ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
            No expenses added this month.
          </p>
        )}
      </div>
    );
  },
);
