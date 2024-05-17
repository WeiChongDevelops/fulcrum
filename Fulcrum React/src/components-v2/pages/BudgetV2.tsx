import {
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PublicUserData,
} from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import {
  changeFormOrModalVisibility,
  formatDollarAmountStatic,
  getCurrencySymbol,
  getTotalAmountBudgeted,
  isCurrentMonth,
  LocationContext,
} from "@/utility/util.ts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useContext, useEffect } from "react";
import BudgetModalsAndForms from "@/components/child/budget/BudgetModalsAndForms.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import GroupV2 from "@/components-v2/subcomponents/budget/GroupV2.tsx";

import AddNewGroupButton from "@/components/child/budget/buttons/AddNewGroupButton.tsx";

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
      <div className={"grid pt-[6vh] gap-4 px-6  ml-[15px]"}>
        <div className="budget-v2-upper-content grid w-full gap-6 mt-6 place-items-stretch">
          <FulcrumAnimationV2 totalIncome={totalIncome!} totalBudget={getTotalAmountBudgeted(budgetArray)} />
          <div className="flex row justify-center items-center gap-8 bg-violet-300 rounded-xl font-bold text-2xl min-h-96">
            <Skeleton className="size-[200px] rounded-full" />
            <div className={"flex flex-col justify-center items-start gap-4"}>
              <Skeleton className="w-44 h-12" />
              <Skeleton className="w-36 h-8" />
              <Skeleton className="w-36 h-8" />
              <Skeleton className="w-36 h-8" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility} isDarkMode={publicUserData.darkModeEnabled} />
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
  );
}
