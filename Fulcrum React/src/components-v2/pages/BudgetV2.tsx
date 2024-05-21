import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import {
  getCurrencySymbol,
  getGroupBudgetTotal,
  getHighestGroupSortIndex,
  getTotalAmountBudgeted,
  isCurrentMonth,
  LocationContext,
} from "@/utility/util.ts";
import { useContext, useEffect, useRef, useState } from "react";
import BudgetModalsAndForms from "@/components/child/budget/BudgetModalsAndForms.tsx";
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
import useReorderGroups from "@/hooks/mutations/budget/useReorderGroups.ts";
import { Separator } from "@/components-v2/ui/separator.tsx";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components-v2/ui/drawer.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import UpdateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateGroupFormV2.tsx";
import CreateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/CreateGroupFormV2.tsx";
import Playground from "@/components-v2/subcomponents/budget/Playground.tsx";

interface BudgetV2Props {
  publicUserData: PublicUserData;
  budgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  groupArray: GroupItemEntity[];
  navMenuOpen: boolean;
}

export default function BudgetV2({ publicUserData, budgetArray, expenseArray, groupArray, navMenuOpen }: BudgetV2Props) {
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
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isLoading,
    isError,
    // isSuccess,
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

    // setLocalisedGroupArray((prevLocalisedGroupArray) => {
    //   const reorderedArray = arrayMove(prevLocalisedGroupArray, getIndexOf(active.id), getIndexOf(over!.id));
    //
    //   return reorderedArray.map((groupItem, index) => ({ ...groupItem, id: index + 1 }));
    // });
    // setTimeout(() => {
    //   setLocalisedGroupArray((prevLocalisedGroupArray) => {
    //     const oldIndex = getIndexOf(active.id);
    //     const newIndex = getIndexOf(over!.id);
    //     return arrayMove(prevLocalisedGroupArray, oldIndex, newIndex);
    //   });
    // }, 100);

    setLocalisedGroupArray((prevLocalisedGroupArray) => {
      const oldIndex = getIndexOf(active.id);
      const newIndex = getIndexOf(over!.id);
      return arrayMove(prevLocalisedGroupArray, oldIndex, newIndex);
    });
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      reorderGroups(localisedGroupArray);
    }
    console.log(localisedGroupArray);
  }, [localisedGroupArray]);

  const [budgetLayoutIsSideBySide, setBudgetLayoutIsSideBySide] = useState(false);

  useEffect(() => {
    const updateBudgetLayout = () => {
      setTimeout(() => {
        if (!!budgetContainer.current) {
          const containerWidth = budgetContainer.current.getBoundingClientRect().width;
          setBudgetLayoutIsSideBySide(containerWidth > 700);
        }
      }, 300);
    };
    updateBudgetLayout();
    window.addEventListener("resize", updateBudgetLayout);
    return () => window.removeEventListener("resize", updateBudgetLayout);
  }, [navMenuOpen]);

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading) {
    return <Loader isLoading={!isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} size={10} />;
  }

  return (
    <div className="flex flex-col justify-start gap-8">
      <BudgetHeaderV2 publicUserData={publicUserData} totalIncome={totalIncome!} navMenuOpen={navMenuOpen} />
      <BudgetModalsAndForms
        budgetFormVisibility={budgetFormVisibility}
        // budgetArray={budgetArray}
        groupArray={groupArray}
        groupNameOfNewItem={groupNameOfNewItem}
        setBudgetFormVisibility={setBudgetFormVisibility}
        oldBudgetBeingEdited={oldBudgetBeingEdited}
        oldGroupBeingEdited={oldGroupBeingEdited}
        groupToDelete={groupToDelete}
        categoryToDelete={categoryToDelete}
        budgetModalVisibility={budgetModalVisibility}
        setBudgetModalVisibility={setBudgetModalVisibility}
        setLocalisedGroupArray={setLocalisedGroupArray}
        currencySymbol={getCurrencySymbol(publicUserData.currency)}
      />
      <div className={"transition-all mt-[5.5vh] min-h-screen "} ref={budgetContainer}>
        <div className={"grid gap-4 pl-3 pr-5 ml-[15px]"}>
          <div className="grid w-full gap-6" style={{ gridTemplateColumns: budgetLayoutIsSideBySide ? "6fr 5fr" : "1fr" }}>
            <div className={"relative z-10 bg-slate-200 rounded-xl"}>
              <FulcrumAnimationV2
                navMenuOpen={navMenuOpen}
                totalIncome={totalIncome!}
                totalBudget={getTotalAmountBudgeted(budgetArray)}
              />
            </div>
            <div className="flex flex-row justify-center items-center relative gap-2 bg-violet-100 rounded-xl font-bold h-96 w-full">
              {/*<Skeleton className="size-[200px] rounded-full" />*/}
              <p className={"absolute top-5 left-7"}>Budget Distribution by Category</p>
              <div className={"relative h-full w-[34rem] md:w-[30rem] pt-4"}>
                <BudgetPieChart budgetArray={budgetArray} />
              </div>
              <div className={"absolute top-3 right-3"}>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="default" className={"text-xs px-2.5"}>
                      Details
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Budget Distribution by Group</DrawerTitle>
                        <DrawerDescription>See your budget distribution by category groups.</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex-1 text-center">
                            {/*<div className="text-7xl font-bold tracking-tighter">Goal</div>*/}
                            {/*<div className="text-[0.70rem] uppercase text-muted-foreground">Calories/day</div>*/}
                            <div className={"flex flex-row justify-center items-center mb-6"}>
                              <div
                                className={"flex flex-col justify-center items-start gap-4 mr-[8%] max-[1800px]:mr-[12%]"}
                              >
                                {/*<Skeleton className="w-40 h-8" />*/}
                                {/*<Skeleton className="w-32 h-6" />*/}
                                {/*<Skeleton className="w-32 h-6" />*/}
                                {/*<Skeleton className="w-32 h-6" />*/}
                                {/*<Skeleton className="w-32 h-6" />*/}
                                {/*<Skeleton className="w-32 h-6" />*/}
                                <div>
                                  {groupArray
                                    .sort((a, b) =>
                                      getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === a.group)) <
                                      getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === b.group))
                                        ? 1
                                        : -1,
                                    )
                                    .map((groupItem, index) => (
                                      // {groupArray.sort((a,b) => ((getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === a.group))) > (getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === b.group))) ? 1 : -1)).map((groupItem, index) => (
                                      <div
                                        className={"grid text-sm font-bold"}
                                        style={{ gridTemplateColumns: "1fr 1fr" }}
                                        key={index}
                                      >
                                        <div className={"flex flex-row justify-start items-center gap-2 text-left"}>
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
                        </div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button>Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
          <Separator />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="flex flex-col w-full gap-4">
              <CreateGroupFormV2
                publicUserData={publicUserData}
                highestSortIndex={getHighestGroupSortIndex(groupArray)}
                setLocalisedGroupArray={setLocalisedGroupArray}
              />

              <SortableContext items={localisedGroupArray} strategy={verticalListSortingStrategy}>
                {!!localisedGroupArray &&
                  localisedGroupArray.map((group) => (
                    <GroupV2
                      group={group}
                      groupArray={groupArray}
                      setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                      budgetArray={budgetArray}
                      setBudgetFormVisibility={setBudgetFormVisibility}
                      setBudgetModalVisibility={setBudgetModalVisibility}
                      perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                      groupNameOfNewItem={groupNameOfNewItem}
                      setGroupNameOfNewItem={setGroupNameOfNewItem}
                      publicUserData={publicUserData}
                      setCategoryToDelete={setCategoryToDelete}
                      setGroupToDelete={setGroupToDelete}
                      setOldGroupBeingEdited={setOldGroupBeingEdited}
                      setLocalisedGroupArray={setLocalisedGroupArray}
                      oldGroupBeingEdited={oldGroupBeingEdited}
                      key={group.id}
                    />
                  ))}
              </SortableContext>
            </div>
          </DndContext>

          {/*<Playground />*/}
        </div>
      </div>
    </div>
  );
}
