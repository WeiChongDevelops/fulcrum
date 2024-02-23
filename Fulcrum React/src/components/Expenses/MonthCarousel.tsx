import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    CategoryToIconGroupAndColourMap, ExpenseFormVisibility, ExpenseModalVisibility,
    getMonthsFromToday,
    MonthExpenseGroupEntity, PreviousExpenseBeingEdited,
    PublicUserData
} from "../../util.ts";
import {ExpenseMonthGroup} from "./ExpenseMonthGroup.tsx";
import {Idk} from "../../remotion/Idk.tsx";


interface MonthCarouselProps {
    structuredExpenseData: MonthExpenseGroupEntity[];
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;
    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
    categoryDataMap: CategoryToIconGroupAndColourMap;
    publicUserData: PublicUserData;
}


export default function MonthCarousel({structuredExpenseData,
                                          setExpenseFormVisibility,
                                          setExpenseModalVisibility,
                                          setOldExpenseBeingEdited,
                                          setExpenseIdToDelete,
                                          categoryDataMap,
                                          publicUserData,
                                      }: MonthCarouselProps)  {

    const y2K = new Date('2000-01-01T00:00:00Z');
    const y2KMonth = y2K.getMonth();
    const y2KYear = y2K.getFullYear();

    const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);

    const [monthPanelShowingIndex, setMonthPanelShowingIndex] = useState(0);

    useEffect(() => {
        console.log(`Index is ${monthPanelShowingIndex}`)
    }, [monthPanelShowingIndex]);

    return (
        <div className={"relative"}>
            <Idk/>
            {/*<div className={"expense-carousel absolute overflow-x-auto left-1/2"} style={{transform: `translateX(calc(-(100vw * ${monthsFromY2KToNow} - (100vw * ${monthPanelShowingIndex})))`}}>*/}
            {/*<div className={"expense-carousel absolute overflow-x-auto left-1/2"} style={{transform: `translateX(calc(-100% -(100vw * ${monthPanelShowingIndex})))`}}>*/}
            <div className={"expense-carousel absolute overflow-x-auto left-[-50vw]"} style={{transform: `translateX(calc(-100vw * (${monthsFromY2KToNow} + ${monthPanelShowingIndex})))`}}>
                <div className={"flex flex-row"}>
                    {structuredExpenseData.map((monthExpenseGroupItem, key) => {
                        return (
                            <div className={"flex flex-col items-center w-screen min-h-screen"} key={key}>
                                <ExpenseMonthGroup monthExpenseGroupItem={monthExpenseGroupItem}
                                                   setExpenseFormVisibility={setExpenseFormVisibility}
                                                   setExpenseModalVisibility={setExpenseModalVisibility}
                                                   setOldExpenseBeingEdited={setOldExpenseBeingEdited}
                                                   setExpenseIdToDelete={setExpenseIdToDelete}
                                                   categoryDataMap={categoryDataMap}
                                                   publicUserData={publicUserData}
                                                   monthsFromY2KToNow={monthsFromY2KToNow}
                                                   monthPanelShowingIndex={monthPanelShowingIndex}
                                                   setMonthPanelShowingIndex={setMonthPanelShowingIndex}/>
                            </div>);
                    })}
                </div>
            </div>
        </div>
    );
}