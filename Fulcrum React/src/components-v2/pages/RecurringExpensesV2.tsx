import AddNewRecurringExpenseButton from "@/components/child/tools/recurring-expenses/buttons/AddNewRecurringExpenseButton.tsx";
import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "@/utility/types.ts";
import { useContext, useEffect } from "react";
import { capitaliseFirstLetter, checkForOpenModalOrForm, LocationContext } from "@/utility/util.ts";
import useInitialRecurringExpenseData from "@/hooks/queries/useInitialRecurringExpenseData.ts";
import RecurringExpenseItem from "@/components/child/tools/recurring-expenses/RecurringExpenseItem.tsx";
import ActiveFormClickShield from "@/components/child/other/ActiveFormClickShield.tsx";
import RecurringExpenseModalsAndForms from "@/components/child/tools/recurring-expenses/RecurringExpenseModalsAndForms.tsx";
import RecurringExpensesHeaderV2 from "@/components-v2/subcomponents/recurring/RecurringHeaderV2.tsx";
import { ScrollArea } from "@/components-v2/ui/scroll-area.tsx";
import RecurringItemV2 from "@/components-v2/subcomponents/recurring/RecurringItemV2.tsx";
import CreateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/CreateExpenseFormV2.tsx";

interface RecurringExpensesV2Props {
  publicUserData: PublicUserData;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
  categoryDataMap: CategoryToIconGroupAndColourMap;
  sideBarOpen: boolean;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * The root component for the recurring expense page.
 */
export default function RecurringExpensesV2({
  publicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  categoryDataMap,
  recurringExpenseArray,
  sideBarOpen,
  perCategoryExpenseTotalThisMonth,
}: RecurringExpensesV2Props) {
  const routerLocation = useContext(LocationContext);
  const {
    recurringExpenseModalVisibility,
    setRecurringExpenseModalVisibility,
    recurringExpenseFormVisibility,
    setRecurringExpenseFormVisibility,
    isRecurringExpenseFormOrModalOpen,
    setIsRecurringExpenseFormOrModalOpen,
    oldRecurringExpenseBeingEdited,
    setOldRecurringExpenseBeingEdited,
    recurringExpenseIdToDelete,
    setRecurringExpenseIdToDelete,
  } = useInitialRecurringExpenseData();

  useEffect(() => {
    setIsRecurringExpenseFormOrModalOpen(
      checkForOpenModalOrForm(recurringExpenseFormVisibility, recurringExpenseModalVisibility),
    );
  }, [recurringExpenseFormVisibility, recurringExpenseModalVisibility, routerLocation]);

  const categoryOptions = budgetArray.map((budgetItem) => {
    const dataMapEntry = categoryDataMap.get(budgetItem.category);
    return {
      value: budgetItem.category,
      label: capitaliseFirstLetter(budgetItem.category),
      colour: !!dataMapEntry && !!dataMapEntry.colour ? dataMapEntry.colour : "black",
    };
  });

  return (
    <div className={"flex flex-col justify-start items-center h-screen"}>
      <RecurringExpensesHeaderV2 sideBarOpen={sideBarOpen} publicUserData={publicUserData} />
      <ScrollArea className={"w-full h-[94vh] pt-8"}>
        <CreateExpenseFormV2
          categoryDataMap={categoryDataMap}
          budgetArray={budgetArray}
          defaultCalendarDate={new Date()}
          mustBeRecurring={true}
          publicUserData={publicUserData}
          perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
        />
        <div className={"mt-6 w-full"}>
          {recurringExpenseArray.length > 0 ? (
            recurringExpenseArray.map((recurringExpenseItem, key) => {
              return (
                <RecurringItemV2
                  categoryOptions={categoryOptions}
                  recurringExpenseId={recurringExpenseItem.recurringExpenseId}
                  category={recurringExpenseItem.category}
                  amount={recurringExpenseItem.amount}
                  iconPath={categoryDataMap.get(recurringExpenseItem.category)!.iconPath}
                  timestamp={recurringExpenseItem.timestamp}
                  frequency={recurringExpenseItem.frequency}
                  groupName={categoryDataMap.get(recurringExpenseItem.category)!.group}
                  groupColour={categoryDataMap.get(recurringExpenseItem.category)!.colour}
                  setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                  setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
                  setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
                  oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
                  setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
                  publicUserData={publicUserData}
                  key={key}
                />
              );
            })
          ) : (
            <p className={"text-2xl mt-48"}>Add recurring expenses for transactions you expect to arise regularly.</p>
          )}
        </div>
      </ScrollArea>
      <RecurringExpenseModalsAndForms
        recurringExpenseModalVisibility={recurringExpenseModalVisibility}
        recurringExpenseFormVisibility={recurringExpenseFormVisibility}
        expenseArray={expenseArray}
        groupArray={groupArray}
        setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
        setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
        recurringExpenseIdToDelete={recurringExpenseIdToDelete}
        publicUserData={publicUserData}
        budgetArray={budgetArray}
        oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
      />
    </div>
    // <>
    //   <div
    //     className={`justify-start items-center min-h-screen relative ${publicUserData.darkModeEnabled ? "bg-[#252e2e]" : "bg-[#455259]"}`}
    //   >
    //     <div>
    //       <div
    //         className={`justify-center items-center w-[100vw] elementsBelowPopUpForm
    //                     ${isRecurringExpenseFormOrModalOpen && "blur"}`}
    //       >
    //         {/*<div className="flex justify-between items-center mt-6 w-full">*/}
    //         {/*  <img*/}
    //         {/*    className={"w-12 h-auto"}*/}
    //         {/*    src="/static/assets-v2/UI-icons/tools-recurring-icon-white.svg"*/}
    //         {/*    alt="Cycle icon"*/}
    //         {/*  />*/}
    //         {/*  <h1 className="recurring-expenses-title text-white font-bold mx-8">Recurring Expenses</h1>*/}
    //         {/*  <img*/}
    //         {/*    className={"w-12 h-auto"}*/}
    //         {/*    src="/static/assets-v2/UI-icons/tools-recurring-icon-white.svg"*/}
    //         {/*    alt="Cycle icon"*/}
    //         {/*  />*/}
    //         {/*</div>*/}
    //
    //         {/*<p className={"my-4"}>Add recurring expenses for transactions you expect to arise regularly.</p>*/}
    //
    //         <AddNewRecurringExpenseButton
    //           setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
    //           isDarkMode={true}
    //         />
    //
    //         <div className={"mt-6"}>
    //           {recurringExpenseArray.length > 0 ? (
    //             recurringExpenseArray.map((recurringExpenseItem, key) => {
    //               return (
    //                 <RecurringExpenseItem
    //                   recurringExpenseId={recurringExpenseItem.recurringExpenseId}
    //                   category={recurringExpenseItem.category}
    //                   amount={recurringExpenseItem.amount}
    //                   iconPath={categoryDataMap.get(recurringExpenseItem.category)!.iconPath}
    //                   timestamp={recurringExpenseItem.timestamp}
    //                   frequency={recurringExpenseItem.frequency}
    //                   groupName={categoryDataMap.get(recurringExpenseItem.category)!.group}
    //                   groupColour={categoryDataMap.get(recurringExpenseItem.category)!.colour}
    //                   setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
    //                   setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
    //                   setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
    //                   setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
    //                   publicUserData={publicUserData}
    //                   key={key}
    //                 />
    //               );
    //             })
    //           ) : (
    //             <p className={"text-2xl mt-48"}>Add recurring expenses for transactions you expect to arise regularly.</p>
    //           )}
    //         </div>
    //       </div>
    //
    //       {isRecurringExpenseFormOrModalOpen && <ActiveFormClickShield />}
    //
    //       <RecurringExpenseModalsAndForms
    //         recurringExpenseModalVisibility={recurringExpenseModalVisibility}
    //         recurringExpenseFormVisibility={recurringExpenseFormVisibility}
    //         expenseArray={expenseArray}
    //         groupArray={groupArray}
    //         setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
    //         setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
    //         recurringExpenseIdToDelete={recurringExpenseIdToDelete}
    //         publicUserData={publicUserData}
    //         budgetArray={budgetArray}
    //         oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
    //       />
    //     </div>
    //   </div>
    // </>
  );
}
