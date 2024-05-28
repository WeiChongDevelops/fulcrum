import {
  BudgetItemEntity,
  BudgetModalVisibility,
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
  SetBudgetModalVisibilityContext,
  useLocation,
} from "@/utility/util.ts";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import GroupV2 from "@/components-v2/subcomponents/budget/GroupV2.tsx";
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
import CreateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/CreateGroupFormV2.tsx";
import Playground from "@/components-v2/subcomponents/budget/Playground.tsx";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import BudgetDataBento from "@/components-v2/subcomponents/budget/BudgetDataBento.tsx";
import { debounce } from "lodash";

interface BudgetV2Props {
  publicUserData: PublicUserData;
  budgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  groupArray: GroupItemEntity[];
  sideBarOpen: boolean;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  setPerCategoryExpenseTotalThisMonth: Dispatch<SetStateAction<Map<string, number>>>;
}

export default function BudgetV2({
  publicUserData,
  budgetArray,
  expenseArray,
  groupArray,
  sideBarOpen,
  categoryDataMap,
  perCategoryExpenseTotalThisMonth,
  setPerCategoryExpenseTotalThisMonth,
}: BudgetV2Props) {
  const routerLocation = useLocation();

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
    isLoading,
    isError,
    isSuccess,
    error,
  } = useInitialBudgetData();

  // const [totalBudget, setTotalBudget] = useState(() => getTotalAmountBudgeted(budgetArray));
  //
  // useEffect(() => {
  //   setTotalBudget(getTotalAmountBudgeted(budgetArray));
  // }, [budgetArray]);

  const [totalBudget, setTotalBudget] = useState(() => getTotalAmountBudgeted(budgetArray));

  useEffect(() => {
    setTotalBudget(getTotalAmountBudgeted(budgetArray));
  }, [budgetArray]);

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

  // const fadeBudget = () => {
  //   budgetContainer.current?.classList.add("fadeOut");
  //   setTimeout(() => {
  //     budgetContainer.current?.classList.remove("fadeOut");
  //   }, 350);
  // };
  //
  // useEffect(fadeBudget, [sideBarOpen]);

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
  }, [localisedGroupArray]);

  const [budgetLayoutIsSideBySide, setBudgetLayoutIsSideBySide] = useState(false);

  const updateBentoLayout = () => {
    if (!!budgetContainer.current) {
      const containerWidth = budgetContainer.current.getBoundingClientRect().width;
      setBudgetLayoutIsSideBySide(containerWidth > 850);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateBentoLayout);
    window.addEventListener("resize", () => debounce(updateBentoLayout, 150));
    return () => {
      window.removeEventListener("resize", updateBentoLayout);
      window.removeEventListener("resize", () => debounce(updateBentoLayout, 150));
    };
  }, []);

  useEffect(() => {
    debounce(updateBentoLayout, 1500);
  }, [sideBarOpen]);

  useEffect(() => {
    setTimeout(updateBentoLayout, 300);
  }, []);

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading) {
    return <Loader isLoading={!isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} size={10} />;
  }

  return (
    <SetBudgetModalVisibilityContext.Provider value={setBudgetModalVisibility}>
      <div className="flex flex-col justify-start">
        <BudgetHeaderV2 publicUserData={publicUserData} totalIncome={totalIncome!} sideBarOpen={sideBarOpen} />
        {/*<BudgetModalsAndForms*/}
        {/*  budgetFormVisibility={budgetFormVisibility}*/}
        {/*  // budgetArray={budgetArray}*/}
        {/*  groupArray={groupArray}*/}
        {/*  groupNameOfNewItem={groupNameOfNewItem}*/}
        {/*  setBudgetFormVisibility={setBudgetFormVisibility}*/}
        {/*  oldBudgetBeingEdited={oldBudgetBeingEdited}*/}
        {/*  oldGroupBeingEdited={oldGroupBeingEdited}*/}
        {/*  groupToDelete={groupToDelete}*/}
        {/*  categoryToDelete={categoryToDelete}*/}
        {/*  budgetModalVisibility={budgetModalVisibility}*/}
        {/*  setLocalisedGroupArray={setLocalisedGroupArray}*/}
        {/*  currencySymbol={getCurrencySymbol(publicUserData.currency)}*/}
        {/*/>*/}
        <ScrollArea className={"transition-all ease-[cubic-bezier(0.9, 0, 0.4, 1)] mt-[6vh] h-[94vh]"} ref={budgetContainer}>
          <div className={"grid gap-4 px-4 pt-4 pb-6"}>
            <div className="grid w-full gap-4" style={{ gridTemplateColumns: budgetLayoutIsSideBySide ? "6fr 5fr" : "1fr" }}>
              <FulcrumAnimationV2
                budgetLayoutIsSideBySide={budgetLayoutIsSideBySide}
                currency={publicUserData.currency}
                sideBarOpen={sideBarOpen}
                totalIncome={totalIncome!}
                totalBudget={totalBudget}
              />
              <BudgetDataBento
                budgetArray={budgetArray}
                groupArray={groupArray}
                budgetTotal={totalBudget}
                categoryDataMap={categoryDataMap}
                currency={publicUserData.currency}
              />
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <div className="flex flex-col w-full gap-3">
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
                        oldBudgetBeingEdited={oldBudgetBeingEdited}
                        setLocalisedGroupArray={setLocalisedGroupArray}
                        oldGroupBeingEdited={oldGroupBeingEdited}
                        key={group.id}
                      />
                    ))}
                </SortableContext>
                <CreateGroupFormV2
                  publicUserData={publicUserData}
                  highestSortIndex={getHighestGroupSortIndex(groupArray)}
                  setLocalisedGroupArray={setLocalisedGroupArray}
                  className={"mt-1"}
                />
              </div>
            </DndContext>
          </div>
        </ScrollArea>
      </div>
    </SetBudgetModalVisibilityContext.Provider>
  );
}
