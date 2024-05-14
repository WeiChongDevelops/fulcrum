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
import { checkForOpenModalOrForm, LocationContext } from "@/utility/util.ts";
import useInitialRecurringExpenseData from "@/hooks/queries/useInitialRecurringExpenseData.ts";
import RecurringExpenseItem from "@/components/child/tools/recurring-expenses/RecurringExpenseItem.tsx";
import ActiveFormClickShield from "@/components/child/other/ActiveFormClickShield.tsx";
import RecurringExpenseModalsAndForms from "@/components/child/tools/recurring-expenses/RecurringExpenseModalsAndForms.tsx";
import RecurringExpensesHeaderV2 from "@/components-v2/child/recurring/RecurringExpensesHeaderV2.tsx";

interface RecurringExpensesV2Props {
  publicUserData: PublicUserData;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
  categoryDataMap: CategoryToIconGroupAndColourMap;
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
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
  navMenuOpen,
  toggleNavMenu,
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

  return (
    <div className={"flex flex-col h-screen w-full"}>
      <RecurringExpensesHeaderV2 navMenuOpen={navMenuOpen} toggleNavMenu={toggleNavMenu} publicUserData={publicUserData} />
      <div className={"bg-cyan-400 w-full h-[94%]"}>
        <AddNewRecurringExpenseButton
          setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
          isDarkMode={true}
        />
      </div>
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
