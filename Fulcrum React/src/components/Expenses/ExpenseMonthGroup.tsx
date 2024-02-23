import {
    CategoryToIconGroupAndColourMap,
    ExpenseFormVisibility,
    ExpenseModalVisibility,
    MonthExpenseGroupEntity, monthStringArray,
    PreviousExpenseBeingEdited, PublicUserData
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";

export interface ExpenseMonthGroupProps {
    monthExpenseGroupItem: MonthExpenseGroupEntity;
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;
    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
    categoryDataMap: CategoryToIconGroupAndColourMap;
    publicUserData: PublicUserData;
}

export function ExpenseMonthGroup( { monthExpenseGroupItem,
                                       setExpenseFormVisibility,
                                       setExpenseModalVisibility,
                                       setOldExpenseBeingEdited,
                                       setExpenseIdToDelete,
                                       categoryDataMap,
                                       publicUserData }: ExpenseMonthGroupProps) {
    return (
        <div className={"flex flex-col"}>
            <h1>{monthStringArray[monthExpenseGroupItem.monthIndex] + " " + monthExpenseGroupItem.year.toString()}</h1>
            {monthExpenseGroupItem.monthExpenseArray.map(dayExpenseGroup => {
                return <ExpenseDayGroup
                    dayExpenseGroup={dayExpenseGroup}
                    setExpenseFormVisibility={setExpenseFormVisibility}
                    setExpenseModalVisibility={setExpenseModalVisibility}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                    setExpenseIdToDelete={setExpenseIdToDelete}
                    categoryDataMap={categoryDataMap}
                    publicUserData={publicUserData}/>
            })}
            {/*{expenseArray?.length > 0 ? expenseMatrix.map((filteredExpenseArray, key) => (*/}
            {/*    <ExpenseDayGroup*/}
            {/*        date={new Date(filteredExpenseArray[0].timestamp)}*/}
            {/*        filteredExpenseArray={filteredExpenseArray}*/}
            {/*        setExpenseFormVisibility={setExpenseFormVisibility}*/}
            {/*        setExpenseModalVisibility={setExpenseModalVisibility}*/}
            {/*        setOldExpenseBeingEdited={setOldExpenseBeingEdited}*/}
            {/*        setExpenseIdToDelete={setExpenseIdToDelete}*/}
            {/*        categoryDataMap={categoryDataMap}*/}
            {/*        publicUserData={publicUserData}*/}
            {/*        key={key}/>*/}
            {/*)): <p className={`text-2xl mt-48 ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>No expenses added yet.</p>}*/}
        </div>
    );
}