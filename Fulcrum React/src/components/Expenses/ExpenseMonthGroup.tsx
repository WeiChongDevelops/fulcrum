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
                                       setMonthPanelShowingIndex}: ExpenseMonthGroupProps) {


    function scrollLeft() {
        setMonthPanelShowingIndex(curr => curr - 1);
    }

    function scrollRight() {
        setMonthPanelShowingIndex(curr => curr + 1);
    }

    return (
        <div className={"flex flex-col items-center"}>
            <div className={"month-navigator flex flex-row justify-around items-center w-[30vw] py-2 bg-[#17423f] rounded-3xl my-8 text-white select-none"}>
                {monthPanelShowingIndex !== -monthsFromY2KToNow && <button onClick={scrollLeft} className={"navigate-left transition-all flex flex-row items-center px-4 h-1/2 rounded-xl font-black text-4xl"}>
                    <img className={"w-[80%]"} src="/src/assets/UI-icons/left-navigation-arrow.svg" alt=""/>
                </button>}
                <p className={"text-4xl"}>{monthStringArray[monthExpenseGroupItem.monthIndex] + " " + monthExpenseGroupItem.year.toString()}</p>
                {monthPanelShowingIndex !== 12 && <button onClick={scrollRight} className={"navigate-right transition-all flex flex-row items-center px-4 h-1/2 rounded-xl font-black text-4xl"}>
                    <img className={"w-[80%]"} src="/src/assets/UI-icons/right-navigation-arrow.svg" alt=""/>
                </button>}
            </div>

            <AddNewExpenseButton setExpenseFormVisibility={setExpenseFormVisibility} isDarkMode={publicUserData.darkModeEnabled}/>

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
            }) : <p className={`text-2xl mt-48 ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>No expenses added this month.</p>}
        </div>
    );
}