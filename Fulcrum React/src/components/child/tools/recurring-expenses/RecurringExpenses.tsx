import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  checkForOpenModalOrForm,
  ExpenseItemEntity,
  getRecurringExpenseList,
  GroupItemEntity,
  OpenToolsSection,
  PreviousRecurringExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  RecurringExpenseModalVisibility,
  BlacklistedExpenseItemEntity,
} from "../../../../util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loader from "../../other/Loader.tsx";
import FulcrumButton from "../../other/FulcrumButton.tsx";
import AddNewRecurringExpenseButton from "./buttons/AddNewRecurringExpenseButton.tsx";
import RecurringExpenseModalsAndForms from "./RecurringExpenseModalsAndForms.tsx";
import ActiveFormClickShield from "../../other/ActiveFormClickShield.tsx";
import RecurringExpenseItem from "./RecurringExpenseItem.tsx";

interface RecurringExpensesProps {
  setOpenToolsSection: Dispatch<SetStateAction<OpenToolsSection>>;

  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;

  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;

  error: string;
  setError: Dispatch<SetStateAction<string>>;
}

/**
 * The root component for the recurring expense page.
 */
export default function RecurringExpenses({
  setOpenToolsSection,
  publicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  setExpenseArray,
  setBudgetArray,
  categoryDataMap,
  setBlacklistedExpenseArray,
  error,
  setError,
}: RecurringExpensesProps) {
  const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
  const [recurringExpenseModalVisibility, setRecurringExpenseModalVisibility] = useState<RecurringExpenseModalVisibility>({
    isConfirmRecurringExpenseDeletionModalVisible: false,
    isSelectRecurringExpenseDeletionTypeModalVisible: false,
  });
  const [recurringExpenseFormVisibility, setRecurringExpenseFormVisibility] = useState<RecurringExpenseFormVisibility>({
    isCreateExpenseVisible: false,
    isUpdateRecurringExpenseVisible: false,
  });

  const [isRecurringExpenseFormOrModalOpen, setIsRecurringExpenseFormOrModalOpen] = useState(false);

  const [oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited] = useState<PreviousRecurringExpenseBeingEdited>({
    recurringExpenseId: "",
    oldCategory: "",
    oldAmount: 0,
    oldTimestamp: new Date(),
    oldFrequency: "monthly",
  });
  const [recurringExpenseIdToDelete, setRecurringExpenseIdToDelete] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function retrieveData() {
      const [recurringExpenseArray] = await Promise.all([getRecurringExpenseList()]);
      setRecurringExpenseArray(recurringExpenseArray);

      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    retrieveData()
      .then(() => setIsLoading(false))
      .catch(() => setError("We’re unable to load your data right now. Please try again later."));
  }, []);

  useEffect(() => {
    setIsRecurringExpenseFormOrModalOpen(
      checkForOpenModalOrForm(recurringExpenseFormVisibility, recurringExpenseModalVisibility),
    );
  }, [recurringExpenseFormVisibility, recurringExpenseModalVisibility]);

  return (
    <>
      {!isLoading ? (
        <div className="justify-start items-center bg-[#455259] min-h-screen relative">
          {error === "" ? (
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
                    src="/src/assets/UI-icons/tools-recurring-icon-white.svg"
                    alt="Cycle icon"
                  />
                  <h1 className="recurring-expenses-title text-white font-bold mx-8">Recurring Expenses</h1>
                  <img
                    className={"w-12 h-auto"}
                    src="/src/assets/UI-icons/tools-recurring-icon-white.svg"
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
                      return (
                        <RecurringExpenseItem
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
                          setRecurringExpenseIdToDelete={setRecurringExpenseIdToDelete}
                          publicUserData={publicUserData}
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
                setRecurringExpenseArray={setRecurringExpenseArray}
                setBudgetArray={setBudgetArray}
                setBlacklistedExpenseArray={setBlacklistedExpenseArray}
                expenseArray={expenseArray}
                groupArray={groupArray}
                setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                setRecurringExpenseModalVisibility={setRecurringExpenseModalVisibility}
                recurringExpenseIdToDelete={recurringExpenseIdToDelete}
                publicUserData={publicUserData}
                setExpenseArray={setExpenseArray}
                budgetArray={budgetArray}
                oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
              />
            </div>
          ) : (
            <p className={`error-message "text-white"`}>{error}</p>
          )}
        </div>
      ) : (
        <Loader isLoading={isLoading} isDarkMode={false} />
      )}
    </>
  );
}
