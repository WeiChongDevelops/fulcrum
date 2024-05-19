import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import {
  getCurrencySymbol,
  getGroupBudgetTotal,
  getTotalAmountBudgeted,
  isCurrentMonth,
  LocationContext,
} from "@/utility/util.ts";
import { useContext, useEffect, useRef, useState } from "react";
import BudgetModalsAndForms from "@/components/child/budget/BudgetModalsAndForms.tsx";
import { Skeleton } from "@/components-v2/ui/skeleton.tsx";
import GroupV2 from "@/components-v2/subcomponents/budget/GroupV2.tsx";

import AddNewGroupButton from "@/components/child/budget/buttons/AddNewGroupButton.tsx";
import BudgetPieChart from "@/components-v2/subcomponents/budget/PieChart.tsx";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { handleGroupReorder } from "@/utility/api.ts";
import Playground, { PlaygroundGroup } from "@/components-v2/subcomponents/budget/Playground.tsx";
import useReorderGroups from "@/hooks/mutations/budget/useReorderGroups.ts";

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
  const budgetTotal = budgetArray.reduce((acc, budgetItem) => acc + budgetItem.amount, 0);

  const fadeBudget = () => {
    budgetContainer.current?.classList.add("fadeOut");
    setTimeout(() => {
      budgetContainer.current?.classList.remove("fadeOut");
    }, 450);
  };

  useEffect(fadeBudget, [navMenuOpen]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  const [localisedGroupArray, setLocalisedGroupArray] = useState([...groupArray]);

  const getIndexOf = (id: UniqueIdentifier | number) => {
    return localisedGroupArray.findIndex((groupItem) => groupItem.id === (id as number));
  };

  const { mutate: reorderGroups } = useReorderGroups();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    setLocalisedGroupArray((prevLocalisedGroupArray) => {
      const reorderedArray = arrayMove(prevLocalisedGroupArray, getIndexOf(active.id), getIndexOf(over!.id));

      return reorderedArray.map((groupItem, index) => ({ ...groupItem, id: index + 1 }));
    });
  };

  useEffect(() => {
    reorderGroups(localisedGroupArray);
  }, [localisedGroupArray]);

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading) {
    return <Loader isLoading={!isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} size={10} />;
  }

  return (
    <div className="flex flex-col justify-start gap-8">
      <BudgetHeaderV2
        navMenuOpen={navMenuOpen}
        toggleNavMenu={toggleNavMenu}
        publicUserData={publicUserData}
        totalIncome={totalIncome!}
      />
      <div ref={budgetContainer}>
        {/*<div className={"grid pt-[6vh] gap-4 px-5 2xl:px-7"}>*/}
        <div className={"grid pt-[6vh] gap-4 px-6  ml-[15px]"}>
          <div className="budget-v2-upper-content grid w-full gap-6 mt-6">
            <div className={"relative z-10 bg-slate-200 rounded-xl"}>
              <FulcrumAnimationV2
                navMenuOpen={navMenuOpen}
                totalIncome={totalIncome!}
                totalBudget={getTotalAmountBudgeted(budgetArray)}
              />
            </div>
            <div className="flex flex-row justify-center items-center gap-2 bg-violet-100 rounded-xl font-bold h-96 w-full">
              {/*<Skeleton className="size-[200px] rounded-full" />*/}
              <div className={"h-full w-[34rem] md:w-[30rem]"}>
                <BudgetPieChart budgetArray={budgetArray} />
              </div>
              <div className={"flex flex-col justify-center items-start gap-4 mr-[8%] max-[1800px]:mr-[13%]"}>
                {/*<Skeleton className="w-40 h-8" />*/}
                {/*<Skeleton className="w-32 h-6" />*/}
                {/*<Skeleton className="w-32 h-6" />*/}
                {/*<Skeleton className="w-32 h-6" />*/}
                {/*<Skeleton className="w-32 h-6" />*/}
                {/*<Skeleton className="w-32 h-6" />*/}
                <p className={"text-xl font-medium mb-1"}>Category Groups</p>
                <div>
                  {groupArray.map((groupItem, index) => (
                    <div className={"grid"} style={{ gridTemplateColumns: "1fr 1fr" }} key={index}>
                      <div className={"flex flex-row justify-start items-center gap-2"} key={index}>
                        <div
                          className={"rounded-[50%] size-2 brightness-90"}
                          style={{ backgroundColor: groupItem.colour }}
                        ></div>
                        <p>{groupItem.group}</p>
                      </div>
                      <div
                        className={"text-right"}
                      >{`${((getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === groupItem.group)) / budgetTotal) * 100).toFixed(0)}%`}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col w-full gap-4">
              <AddNewGroupButton
                setBudgetFormVisibility={setBudgetFormVisibility}
                isDarkMode={publicUserData.darkModeEnabled}
              />
              <SortableContext items={localisedGroupArray} strategy={verticalListSortingStrategy}>
                {localisedGroupArray.map(
                  (group, index) =>
                    index >= 0 && (
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
                        key={index}
                      />
                    ),
                )}
              </SortableContext>
            </div>
          </DndContext>
          {/*<DndContext collisionDetection={closestCenter}>*/}
          {/*  <SortableContext items={localisedGroupArray} strategy={verticalListSortingStrategy}>*/}
          {/*    {localisedGroupArray.map((groupItem, index) => (*/}
          {/*      <PlaygroundGroup groupItem={groupItem} key={index} />*/}
          {/*    ))}*/}
          {/*  </SortableContext>*/}
          {/*</DndContext>*/}
          {/*<Playground />*/}
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
