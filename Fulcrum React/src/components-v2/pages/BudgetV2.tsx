import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import { getCurrencySymbol, getTotalAmountBudgeted, isCurrentMonth, LocationContext } from "@/utility/util.ts";
import { useContext, useEffect, useRef } from "react";
import BudgetModalsAndForms from "@/components/child/budget/BudgetModalsAndForms.tsx";
import { Skeleton } from "@/components-v2/ui/skeleton.tsx";
import GroupV2 from "@/components-v2/subcomponents/budget/GroupV2.tsx";

import AddNewGroupButton from "@/components/child/budget/buttons/AddNewGroupButton.tsx";
import BudgetPieChart from "@/components-v2/subcomponents/budget/PieChart.tsx";

interface BudgetV2Props {
  publicUserData: PublicUserData;
  budgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  groupArray: GroupItemEntity[];
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

export default function BudgetV2({
  publicUserData,
  budgetArray,
  expenseArray,
  groupArray,
  navMenuOpen,
  toggleNavMenu,
}: BudgetV2Props) {
  const routerLocation = useContext(LocationContext);

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
  }, [budgetArray, expenseArray, routerLocation]);

  const budgetContainer = useRef<HTMLDivElement>(null);

  const fadeBudget = () => {
    budgetContainer.current?.classList.add("fadeOut");
    setTimeout(() => {
      budgetContainer.current?.classList.remove("fadeOut");
    }, 450);
  };

  useEffect(fadeBudget, [navMenuOpen]);

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading) {
    return <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} />;
  }

  return (
    <div className="flex flex-col justify-start gap-8">
      <BudgetHeaderV2
        navMenuOpen={navMenuOpen}
        toggleNavMenu={toggleNavMenu}
        publicUserData={publicUserData}
        totalIncome={totalIncome!}
      />
      <div className={"transition-all"} ref={budgetContainer}>
        {/*<div className={"grid pt-[6vh] gap-4 px-5 2xl:px-7"}>*/}
        <div className={"grid pt-[6vh] gap-4 px-6  ml-[15px]"}>
          <div className="budget-v2-upper-content grid w-full gap-6 mt-6 place-items-stretch">
            <FulcrumAnimationV2
              navMenuOpen={navMenuOpen}
              totalIncome={totalIncome!}
              totalBudget={getTotalAmountBudgeted(budgetArray)}
            />
            <div className="flex flex-row justify-center items-center gap-2 bg-violet-100 rounded-xl font-bold h-96 w-full">
              {/*<Skeleton className="size-[200px] rounded-full" />*/}
              <div className={"h-full w-[34rem] md:w-[30rem]"}>
                <BudgetPieChart budgetArray={budgetArray} />
              </div>
              <div className={"flex flex-col justify-center items-start gap-4 mr-[8%] max-[1800px]:mr-[13%]"}>
                <Skeleton className="w-40 h-8" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-32 h-6" />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <AddNewGroupButton
              setBudgetFormVisibility={setBudgetFormVisibility}
              isDarkMode={publicUserData.darkModeEnabled}
            />
            {groupArray.map((group, index) => (
              <div key={index}>
                <GroupV2
                  group={group}
                  setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                  budgetArray={budgetArray}
                  setBudgetFormVisibility={setBudgetFormVisibility}
                  setBudgetModalVisibility={setBudgetModalVisibility}
                  perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                  groupNameOfNewItem={groupNameOfNewItem}
                  setGroupNameOfNewItem={setGroupNameOfNewItem}
                  publicUserData={publicUserData}
                  setCategoryToDelete={setCategoryToDelete}
                />
              </div>
            ))}
          </div>
        </div>
        <BudgetModalsAndForms
          budgetFormVisibility={budgetFormVisibility}
          budgetArray={budgetArray}
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
    </div>
  );
}
