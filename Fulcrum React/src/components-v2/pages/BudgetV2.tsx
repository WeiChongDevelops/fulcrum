import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import { formatDollarAmountStatic, getTotalAmountBudgeted, isCurrentMonth, LocationContext } from "@/utility/util.ts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useContext, useEffect } from "react";
import AddNewBudgetToGroupButtonV2 from "@/components-v2/subcomponents/budget/AddNewBudgetToGroupButtonV2.tsx";

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

  if (isLoading || !budgetArray) {
    return <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} />;
  }

  console.log({ perCategoryExpenseTotalThisMonth: perCategoryExpenseTotalThisMonth });

  return (
    <div className="flex flex-col justify-start w-full gap-8">
      {/*<div className="flex flex-row justify-between w-full">*/}
      {/*  <div className="w-96 h-20 bg-red-500"></div>*/}
      {/*  <div className="w-64 h-20 bg-green-500"></div>*/}
      {/*</div>*/}
      <BudgetHeaderV2
        navMenuOpen={navMenuOpen}
        toggleNavMenu={toggleNavMenu}
        publicUserData={publicUserData}
        totalIncome={totalIncome!}
      />
      <div className={"flex flex-col gap-8 pt-[6vh] px-6"}>
        <div className="flex flex-row w-full gap-8 mt-6">
          {/*<div className="w-[65%] h-96 bg-blue-500"></div>*/}
          <FulcrumAnimationV2 totalIncome={totalIncome!} totalBudget={getTotalAmountBudgeted(budgetArray)} />
          <div className="flex-grow bg-yellow-500 flex justify-center items-center font-bold text-2xl">New Graph</div>
        </div>
        <div className="flex flex-col w-full gap-4">
          {groupArray.map((group, index) => (
            <Accordion
              type="single"
              className="rounded-xl"
              style={{ backgroundColor: group.colour }}
              collapsible
              key={index}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className={"px-8"}>
                  <p className={"font-bold text-lg"}>{group.group}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={"flex flex-row justify-start items-center"}>
                    {!!budgetArray &&
                      budgetArray
                        .filter((budgetItem) => budgetItem.group === group.group)
                        .map((filteredBudgetItem) => (
                          <Card className="size-48 px-1 m-6">
                            <CardHeader className={"py-4"}>
                              <CardTitle className={"text-base font-bold"}>{filteredBudgetItem.category}</CardTitle>
                              {/*<CardDescription>Deploy your new project in one-click.</CardDescription>*/}
                            </CardHeader>
                            <CardContent className={"flex flex-col gap-4 pb-2 justify-center items-center"}>
                              {/*<p className={"truncate"}>Left: {formatDollarAmountStatic(amount - spent, currency)}</p>*/}
                              <div className={"bg-black rounded-xl size-16 p-3"}>
                                <img
                                  src={`/static/assets-v2/category-icons/${filteredBudgetItem.iconPath}`}
                                  alt="Category icon"
                                />
                              </div>
                              <div>
                                <p className={"truncate"}>
                                  Budget: {formatDollarAmountStatic(filteredBudgetItem.amount, publicUserData.currency)}
                                </p>
                                <p className={"truncate"}>
                                  Left: $
                                  {filteredBudgetItem.amount -
                                    perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category)!}
                                </p>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-center items-center pb-2">
                              <Button variant={"ghost"}>
                                {/*<button className="circle-button" onClick={handleDeleteClick}>*/}
                                <img
                                  src="/static/assets-v2/UI-icons/delete-trash-black-icon.svg"
                                  alt="Budget delete icon"
                                  className="size-6"
                                />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    <AddNewBudgetToGroupButtonV2
                      setGroupNameOfNewItem={setGroupNameOfNewItem}
                      groupNameOfNewItem={groupNameOfNewItem}
                      setBudgetFormVisibility={setBudgetFormVisibility}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          <div className="h-28 w-full bg-indigo-500"></div>
          <div className="h-28 w-full bg-purple-500"></div>
          <div className="h-28 w-full bg-pink-500"></div>
        </div>
      </div>
    </div>
  );
}
