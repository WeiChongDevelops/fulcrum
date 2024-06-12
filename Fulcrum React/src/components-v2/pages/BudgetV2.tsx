import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components-v2/subcomponents/other/FulcrumErrorPage.tsx";
import Loader from "@/components-v2/subcomponents/other/Loader.tsx";
import { getTotalAmountBudgeted, isCurrentMonth, useEmail, useLocation, useSideBarIsOpen } from "@/utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import CreateGroupFormV2 from "@/components-v2/subcomponents/budget/forms/CreateGroupFormV2.tsx";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import BudgetDataBento from "@/components-v2/subcomponents/budget/BudgetDataBento.tsx";
import { debounce } from "lodash";
import { useQueryClient } from "@tanstack/react-query";

interface BudgetV2Props {
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  setPerCategoryExpenseTotalThisMonth: Dispatch<SetStateAction<Map<string, number>>>;
}

export default function BudgetV2({ perCategoryExpenseTotalThisMonth, setPerCategoryExpenseTotalThisMonth }: BudgetV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const expenseArray: ExpenseItemEntity[] = useQueryClient().getQueryData(["expenseArray", useEmail()])!;
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;
  const sideBarOpen = useSideBarIsOpen();

  const routerLocation = useLocation();

  const {
    totalIncome,
    oldBudgetBeingEdited,
    setOldBudgetBeingEdited,
    oldGroupBeingEdited,
    setOldGroupBeingEdited,
    groupNameOfNewItem,
    setGroupNameOfNewItem,
    isLoading,
    isError,
    error,
  } = useInitialBudgetData();

  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    !!budgetArray && setTotalBudget(getTotalAmountBudgeted(budgetArray));
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

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  const [localisedGroupArray, setLocalisedGroupArray] = useState(!!groupArray ? [...groupArray] : []);

  const getIndexOf = (id: UniqueIdentifier | number) => {
    return localisedGroupArray.findIndex((groupItem) => groupItem.id === (id as number));
  };

  const { mutate: reorderGroups } = useReorderGroups();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

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
    setTimeout(updateBentoLayout, 600);
  }, []);

  useEffect(() => {
    setTimeout(updateBentoLayout, 200);
  }, [routerLocation]);

  if (isLoading) {
    return <Loader isLoading={!isLoading} isDarkMode={userPreferences.darkModeEnabled ?? false} size={10} />;
  }

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  return (
    <div className="flex flex-col justify-start bg-transparent">
      <BudgetHeaderV2 totalIncome={totalIncome!} />
      <ScrollArea className={"transition-all ease-[cubic-bezier(0.9, 0, 0.4, 1)] mt-[6vh] h-[94vh]"} ref={budgetContainer}>
        <div className={"grid gap-4 px-4 pt-4 pb-6"}>
          <div className="grid w-full gap-4" style={{ gridTemplateColumns: budgetLayoutIsSideBySide ? "6fr 5fr" : "1fr" }}>
            <FulcrumAnimationV2
              budgetLayoutIsSideBySide={budgetLayoutIsSideBySide}
              currency={userPreferences.currency}
              totalIncome={totalIncome!}
              totalBudget={totalBudget}
            />
            <BudgetDataBento budgetTotal={totalBudget} />
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
                      setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                      perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
                      groupNameOfNewItem={groupNameOfNewItem}
                      setGroupNameOfNewItem={setGroupNameOfNewItem}
                      setOldGroupBeingEdited={setOldGroupBeingEdited}
                      oldBudgetBeingEdited={oldBudgetBeingEdited}
                      setLocalisedGroupArray={setLocalisedGroupArray}
                      oldGroupBeingEdited={oldGroupBeingEdited}
                      key={group.id}
                    />
                  ))}
              </SortableContext>
              <CreateGroupFormV2 setLocalisedGroupArray={setLocalisedGroupArray} className={"mt-1"} />
            </div>
          </DndContext>
        </div>
        <ScrollBar forceMount orientation={"vertical"} />
      </ScrollArea>
    </div>
  );
}
