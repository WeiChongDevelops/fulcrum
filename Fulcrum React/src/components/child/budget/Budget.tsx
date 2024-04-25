import { getTotalAmountBudgeted, getCurrencySymbol, isCurrentMonth } from "../../../utility/util.ts";
import { useEffect, useMemo } from "react";
import IncomeDisplay from "./IncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./main-data-hierarchy/GroupList.tsx";
import AddNewGroupButton from "./buttons/AddNewGroupButton.tsx";
import BudgetModalsAndForms from "./BudgetModalsAndForms.tsx";
import Loader from "../other/Loader.tsx";
import "../../../css/App.css";
import "../../../css/Budget.css";
import ActiveFormClickShield from "../other/ActiveFormClickShield.tsx";
import useInitialBudgetData from "../../../hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "../other/FulcrumErrorPage.tsx";
import useAnimationData from "../../../hooks/queries/useAnimationData.ts";
import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "../../../utility/types.ts";

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
    totalIncome,
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
    lineAngle,
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useInitialBudgetData();

  const { animationDataIsLoading, activeTriangleFulcrum, bowlShadowDimensions } = useAnimationData(lineAngle);

  const totalBudget = useMemo(() => {
    return !!budgetArray ? getTotalAmountBudgeted(budgetArray) : 0;
  }, [budgetArray]);

  useEffect(() => {
    !!totalIncome && setAmountLeftToBudget(totalIncome - totalBudget);
  }, [budgetArray, totalIncome]);

  useEffect(() => {
    if (!!budgetArray) {
      const categoryArray = budgetArray.map((budgetItem) => budgetItem.category);
      categoryArray.forEach((category) => {
        const thisCategoryExpenseArray = expenseArray.filter((expenseItem) => expenseItem.category === category);
        const categoryExpenditure = thisCategoryExpenseArray.reduce(
          (acc, expenseItem) => acc + (isCurrentMonth(expenseItem.timestamp) ? expenseItem.amount : 0),
          0,
        );
        setPerCategoryExpenseTotalThisMonth((previousMap) => new Map([...previousMap, [category, categoryExpenditure]]));
      });
    }
  }, [budgetArray, expenseArray]);

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading || animationDataIsLoading) {
    return <Loader isLoading={isLoading || animationDataIsLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} />;
  }

  if (isSuccess)
    return (
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

            <FulcrumAnimation
              lineAngle={lineAngle}
              isDarkMode={publicUserData.darkModeEnabled}
              activeTriangleFulcrum={activeTriangleFulcrum}
              bowlShadowDimensions={bowlShadowDimensions}
            />

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
                perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
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
    );
}
