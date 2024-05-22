import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
} from "@/utility/types.ts";
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
import CategoryPieChart from "@/components-v2/subcomponents/budget/PieChart.tsx";
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
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import BudgetDataBento from "@/components-v2/subcomponents/budget/BudgetDataBento.tsx";

interface BudgetV2Props {
  publicUserData: PublicUserData;
  budgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  groupArray: GroupItemEntity[];
  navMenuOpen: boolean;
  categoryDataMap: CategoryToIconGroupAndColourMap;
}

export default function BudgetV2({
  publicUserData,
  budgetArray,
  expenseArray,
  groupArray,
  navMenuOpen,
  categoryDataMap,
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
      }, 500);
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
    <ScrollArea className="flex flex-col justify-start gap-8">
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
      <div className={"transition-all mt-[calc(6vh+1.5rem)] min-h-screen "} ref={budgetContainer}>
        <div className={"grid gap-4 pl-3 pr-5 ml-[15px]"}>
          <div className="grid w-full gap-6" style={{ gridTemplateColumns: budgetLayoutIsSideBySide ? "6fr 5fr" : "1fr" }}>
            <div className={"relative z-10 bg-slate-200 rounded-xl"}>
              <FulcrumAnimationV2
                navMenuOpen={navMenuOpen}
                totalIncome={totalIncome!}
                totalBudget={getTotalAmountBudgeted(budgetArray)}
              />
            </div>
            <BudgetDataBento
              budgetArray={budgetArray}
              groupArray={groupArray}
              budgetTotal={budgetTotal}
              categoryDataMap={categoryDataMap}
            />
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
        </div>
      </div>
      <ScrollBar orientation={"horizontal"} />
      <ScrollBar orientation={"vertical"} />
    </ScrollArea>
  );
}
