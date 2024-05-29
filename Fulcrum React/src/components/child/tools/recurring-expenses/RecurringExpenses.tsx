import { checkForOpenModalOrForm, LocationContext, useLocation } from "../../../../utility/util.ts";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import AddNewRecurringExpenseButton from "./buttons/AddNewRecurringExpenseButton.tsx";
import RecurringExpenseModalsAndForms from "./RecurringExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../../other/ActiveFormClickShield.tsx";
import RecurringExpenseItem from "./RecurringExpenseItem.tsx";
import useInitialRecurringExpenseData from "../../../../hooks/queries/useInitialRecurringExpenseData.ts";
import {
  BudgetItemEntity,
  CategoryToIconAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  OpenToolsSection,
  UserPreferences,
  RecurringExpenseItemEntity,
} from "../../../../utility/types.ts";
import "../../../../css/Expense.css";

interface RecurringExpensesProps {
  setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;
  userPreferences: UserPreferences;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
  categoryToIconAndColourMap: CategoryToIconAndColourMap;
}

/**
 * The root component for the recurring expense page.
 */
export default function RecurringExpenses({
  setOpenToolsSection,
  userPreferences,
  expenseArray,
  budgetArray,
  groupArray,
  categoryToIconAndColourMap,
  recurringExpenseArray,
}: RecurringExpensesProps) {
  const routerLocation = useLocation();
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
    <>
      <div
        className={`justify-start items-center min-h-screen relative ${userPreferences.darkModeEnabled ? "bg-[#252e2e]" : "bg-[#455259]"}`}
      >
        <div>
          <div
            className={`justify-center items-center w-[100vw] elementsBelowPopUpForm
                        ${isRecurringExpenseFormOrModalOpen && "blur"}`}
          >
            <div className="flex justify-between items-center mt-6 w-full">
              <div className="flex-grow flex flex-row justify-start">
                <FulcrumButton
                  displayText={"Go Back"}
                  onClick={() => setOpenToolsSection("home")}
                  backgroundColour={"white"}
                  optionalTailwind={"ml-[2.5vw]"}
                />
              </div>

              <img
                className={"w-12 h-auto"}
                src="/static/assets-v2/UI-icons/tools-recurring-icon-white.svg"
                alt="Cycle icon"
              />
              <h1 className="recurring-expenses-title text-white font-bold mx-8">Recurring Expenses</h1>
              <img
                className={"w-12 h-auto"}
                src="/static/assets-v2/UI-icons/tools-recurring-icon-white.svg"
                alt="Cycle icon"
              />
              <div className="flex-grow flex flex-row justify-end">
                <FulcrumButton
                  displayText={"Go Back"}
                  onClick={() => setOpenToolsSection("home")}
                  backgroundColour={"white"}
                  optionalTailwind={"opacity-0"}
                />
              </div>
            </div>

            <p className={"my-4"}>Add recurring expenses for transactions you expect to arise regularly.</p>

            <AddNewRecurringExpenseButton
              setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
              isDarkMode={true}
            />

            <div className={"mt-6"}>
              {recurringExpenseArray.length > 0 ? (
                recurringExpenseArray.map((recurringExpenseItem, key) => {
                  const groupName = budgetArray.find(
                    (budgetItem) => budgetItem.category === recurringExpenseItem.category,
                  )!.group;
                  return (
                    <RecurringExpenseItem
                      recurringExpenseId={recurringExpenseItem.recurringExpenseId}
                      category={recurringExpenseItem.category}
                      amount={recurringExpenseItem.amount}
                      iconPath={categoryToIconAndColourMap.get(recurringExpenseItem.category)!.iconPath}
                      timestamp={recurringExpenseItem.timestamp}
                      frequency={recurringExpenseItem.frequency}
                      groupName={groupName}
                      groupColour={categoryToIconAndColourMap.get(recurringExpenseItem.category)!.colour}
                      setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                      setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
                      setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
                      setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
                      userPreferences={userPreferences}
                      key={key}
                    />
                  );
                })
              ) : (
                <p className={"text-2xl mt-48"}>Your recurring expenses will appear here.</p>
              )}
            </div>
          </div>

          {isRecurringExpenseFormOrModalOpen && <ActiveFormClickShield />}

          <RecurringExpenseModalsAndForms
            recurringExpenseModalVisibility={recurringExpenseModalVisibility}
            recurringExpenseFormVisibility={recurringExpenseFormVisibility}
            expenseArray={expenseArray}
            groupArray={groupArray}
            setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
            setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
            recurringExpenseIdToDelete={recurringExpenseIdToDelete}
            userPreferences={userPreferences}
            budgetArray={budgetArray}
            oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
          />
        </div>
      </div>
    </>
  );
}
