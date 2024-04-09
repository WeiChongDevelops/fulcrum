import {
  BudgetItemEntity,
  checkForOpenModalOrForm,
  ExpenseItemEntity,
  getTotalAmountBudgeted,
  getLineAngle,
  GroupItemEntity,
  PublicUserData,
  getCurrencySymbol,
} from "../../../util.ts";
import { useEffect } from "react";
import IncomeDisplay from "./IncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./main-data-hierarchy/GroupList.tsx";
import AddNewGroupButton from "./buttons/AddNewGroupButton.tsx";
import BudgetModalsAndForms from "./BudgetModalsAndForms.tsx";
import Loader from "../other/Loader.tsx";
import "../../../css/App.css";
import "../../../css/Budget.css";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialBudgetData from "../../../hooks/useInitialBudgetData.ts";
import FulcrumErrorPage from "../other/FulcrumErrorPage.tsx";

interface BudgetProps {
  publicUserData: PublicUserData;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
}

/**
 * The root component for the budget page. It contains the income display, the Fulcrum animation and the user's budget.
 */
export default function Budget({ publicUserData, expenseArray, budgetArray, groupArray }: BudgetProps) {
  const {
    data: totalIncome,
    budgetFormVisibility,
    setBudgetFormVisibility,
    budgetModalVisibility,
    setBudgetModalVisibility,
    groupToDelete,
    setGroupToDelete,
    categoryToDelete,
    setCategoryToDelete,
    oldBudgetBeingEdited,
    setOldBudgetBeingEdited,
    oldGroupBeingEdited,
    setOldGroupBeingEdited,
    amountLeftToBudget,
    setAmountLeftToBudget,
    groupNameOfNewItem,
    setGroupNameOfNewItem,
    isBudgetFormOrModalOpen,
    setIsBudgetFormOrModalOpen,
    lineAngle,
    setLineAngle,
    perCategoryExpenditureMap,
    setPerCategoryExpenditureMap,
    isLoading,
    isError,
    error,
  } = useInitialBudgetData();

  useEffect(() => {
    // Map construction for each category's total expenditure
    const categoryArray = budgetArray.map((budgetItem) => budgetItem.category);
    categoryArray.forEach((category) => {
      const thisCategoryExpenseArray = expenseArray.filter((expenseItem) => expenseItem.category === category);
      const totalExpenses = thisCategoryExpenseArray.reduce((acc, expenseItem) => acc + expenseItem.amount, 0);

      setPerCategoryExpenditureMap((currentMap) => {
        const updatedMap = new Map(currentMap);
        updatedMap.set(category, totalExpenses);
        return updatedMap;
      });
    });
  }, [budgetArray, expenseArray]);

  useEffect(() => {
    totalIncome && setAmountLeftToBudget(totalIncome - getTotalAmountBudgeted(budgetArray));
  }, [budgetArray, totalIncome]);

  useEffect(() => {
    totalIncome && setLineAngle(getLineAngle((amountLeftToBudget / totalIncome) * 100));
  }, [amountLeftToBudget, totalIncome]);

  useEffect(() => {
    setIsBudgetFormOrModalOpen(checkForOpenModalOrForm(budgetFormVisibility, budgetModalVisibility));
  }, [budgetFormVisibility, budgetModalVisibility]);

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={false} />;
  }

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-row justify-center items-center relative">
          <div>
            <div
              className={`justify-center items-center elementsBelowPopUpForm
                        ${isBudgetFormOrModalOpen && "blur"}`}
            >
              <IncomeDisplay
                totalIncome={totalIncome!}
                amountLeftToBudget={amountLeftToBudget}
                publicUserData={publicUserData}
              />

              <FulcrumAnimation lineAngle={lineAngle} isDarkMode={publicUserData.darkModeEnabled} />

              {groupArray?.length > 0 && (
                <GroupList
                  budgetArray={budgetArray}
                  expenseArray={expenseArray}
                  setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                  setOldGroupBeingEdited={setOldGroupBeingEdited}
                  groupArray={groupArray}
                  setGroupNameOfNewItem={setGroupNameOfNewItem}
                  setBudgetFormVisibility={setBudgetFormVisibility}
                  setGroupToDelete={setGroupToDelete}
                  setCategoryToDelete={setCategoryToDelete}
                  setModalFormVisibility={setBudgetModalVisibility}
                  perCategoryTotalExpenseArray={perCategoryExpenditureMap}
                  publicUserData={publicUserData}
                />
              )}

              <AddNewGroupButton
                setBudgetFormVisibility={setBudgetFormVisibility}
                isDarkMode={publicUserData.darkModeEnabled}
              />
            </div>

            {isBudgetFormOrModalOpen && <ActiveFormClickShield />}

            <BudgetModalsAndForms
              budgetFormVisibility={budgetFormVisibility}
              groupArray={groupArray}
              groupNameOfNewItem={groupNameOfNewItem}
              setBudgetFormVisibility={setBudgetFormVisibility}
              oldBudgetBeingEdited={oldBudgetBeingEdited}
              oldGroupBeingEdited={oldGroupBeingEdited}
              groupToDelete={groupToDelete}
              categoryToDelete={categoryToDelete}
              budgetModalVisibility={budgetModalVisibility}
              setBudgetModalVisibility={setBudgetModalVisibility}
              currencySymbol={getCurrencySymbol(publicUserData.currency)}
            />
          </div>
          )
        </div>
      ) : (
        <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled} />
      )}
    </>
  );
}
