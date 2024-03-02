import {
    CategoryToIconGroupAndColourMap,
    ExpenseFormVisibility,
    ExpenseModalVisibility,
    MonthExpenseGroupEntity, monthStringArray,
    PreviousExpenseBeingEdited, PublicUserData
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import ExpenseDayGroup from "./ExpenseDayGroup.tsx";
import AddNewExpenseButton from "./AddNewExpenseButton.tsx";

interface ExpenseMonthGroupProps {
    monthExpenseGroupItem: MonthExpenseGroupEntity;
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;
    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
    categoryDataMap: CategoryToIconGroupAndColourMap;
    publicUserData: PublicUserData;
    monthsFromY2KToNow: number;
    monthPanelShowingIndex: number;
    setMonthPanelShowingIndex: Dispatch<SetStateAction<number>>;
    setDefaultCalendarDate: Dispatch<SetStateAction<Date>>;
}

export function ExpenseMonthGroup( { monthExpenseGroupItem,
                                       setExpenseFormVisibility,
                                       setExpenseModalVisibility,
                                       setOldExpenseBeingEdited,
                                       setExpenseIdToDelete,
                                       categoryDataMap,
                                       publicUserData,
                                       monthsFromY2KToNow,
                                       monthPanelShowingIndex,
                                       setMonthPanelShowingIndex,
                                       setDefaultCalendarDate}: ExpenseMonthGroupProps) {


    function scrollLeft() {
        setMonthPanelShowingIndex(curr => curr - 1);
    }

    function scrollRight() {
        setMonthPanelShowingIndex(curr => curr + 1);
    }

    return (
        <div className={"flex flex-col items-center"}>
            <div className={"month-navigator flex flex-row justify-around items-center min-w-[25vw] py-2 my-4 bg-[#17423f] rounded-3xl text-white select-none"}>
                <button onClick={scrollLeft} className={`navigate-left transition-all flex flex-row items-center px-4 h-1/2 ${monthPanelShowingIndex === -monthsFromY2KToNow && "opacity-0 pointer-events-none"}`}>
                    <img className={"w-[2rem] select-none"} src="/src/assets/UI-icons/left-navigation-arrow.svg" alt=""/>
                </button>
                <p className={"text-4xl"}>{monthStringArray[monthExpenseGroupItem.monthIndex] + " " + monthExpenseGroupItem.year.toString()}</p>
                <button onClick={scrollRight} className={`navigate-right transition-all flex flex-row items-center px-4 h-1/2 ${monthPanelShowingIndex === 12 && "opacity-0 pointer-events-none"}`}>
                    <img className={"w-[2rem] select-none"} src="/src/assets/UI-icons/right-navigation-arrow.svg" alt=""/>
                </button>
            </div>

            <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility}
                                 isDarkMode={publicUserData.darkModeEnabled}
                                 setDefaultCalendarDate={setDefaultCalendarDate}
                                 monthExpenseGroupItem={monthExpenseGroupItem}/>

            {monthExpenseGroupItem.monthExpenseArray.length > 0 ? monthExpenseGroupItem.monthExpenseArray.map((dayExpenseGroup, key) => {
                return <ExpenseDayGroup
                    dayExpenseGroup={dayExpenseGroup}
                    setExpenseFormVisibility={setExpenseFormVisibility}
                    setExpenseModalVisibility={setExpenseModalVisibility}
                    setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                    setExpenseIdToDelete={setExpenseIdToDelete}
                    categoryDataMap={categoryDataMap}
                    publicUserData={publicUserData}
                    key={key}/>
            }) : <p className={`text-2xl mt-48 select-none ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>No expenses added this month.</p>}
        </div>
    );
}