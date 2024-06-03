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
import { cn, getGroupBudgetTotal, useEmail } from "@/utility/util.ts";
import { BudgetItemEntity, CategoryToIconAndColourMap, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components-v2/ui/select";
import GroupPieChart from "@/components-v2/subcomponents/budget/graphs/GroupPieChart.tsx";
import CategoryPieChart from "@/components-v2/subcomponents/budget/graphs/CategoryPieChart.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components-v2/ui/scroll-area.tsx";
import BudgetDistributionDrawer from "@/components-v2/subcomponents/budget/BudgetDistributionDrawer.tsx";

interface BudgetDataBentoProps {
  budgetTotal: number;
}

export default function BudgetDataBento({ budgetTotal }: BudgetDataBentoProps) {
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const budgetSizeSort = (budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity) => {
    return budgetItemA.amount > budgetItemB.amount ? -1 : 1;
  };

  const groupSizeSort = (groupItemA: GroupItemEntity, groupItemB: GroupItemEntity) =>
    getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === groupItemA.group)) <=
    getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group === groupItemB.group))
      ? 1
      : -1;

  const [sortByGroup, setSortByGroup] = useState(false);
  const [groupArraySortedByAmount, setGroupArraySortedByAmount] = useState(groupArray.sort(groupSizeSort));
  const [budgetArraySortedByAmount, setBudgetArraySortedByAmount] = useState(budgetArray.sort(budgetSizeSort));
  useEffect(() => {
    setGroupArraySortedByAmount(groupArray.sort(groupSizeSort));
  }, [groupArray]);

  useEffect(() => {
    setBudgetArraySortedByAmount(budgetArray.sort(budgetSizeSort));
  }, [budgetArray]);
  const [rerenderKey, setRerenderKey] = useState(0);

  const handleValueChange = (value: string) => {
    setSortByGroup(value === "group");
    setRerenderKey(rerenderKey + 1);
  };

  return (
    <div
      className={cn(
        "flex flex-row justify-center items-center relative gap-2 border-[3px] bg-primary-foreground border-border rounded-xl font-bold w-full h-[26rem] pt-2",
      )}
    >
      {!!groupArray && !!budgetArray && (
        <>
          <Select onValueChange={handleValueChange} defaultValue={"category"}>
            <SelectTrigger className="w-[32ch] absolute top-3 left-4 z-30 bg-background text-xs font-medium">
              <SelectValue placeholder={`Budget Distribution by ${sortByGroup ? "Group" : "Category"}`} />
            </SelectTrigger>
            <SelectContent className={cn("bg-background", userPreferences.darkModeEnabled && "dark")}>
              <SelectGroup>
                <SelectItem value="category" className={"text-xs font-medium"}>
                  Budget Distribution by Category
                </SelectItem>
                <SelectItem value="group" className={"text-xs font-medium"}>
                  Budget Distribution by Group
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {budgetArray.length > 0 ? (
            <div className={"relative h-full w-[34rem] md:w-[30rem] pt-4"}>
              {sortByGroup ? (
                <GroupPieChart
                  sortedGroupDataArray={groupArraySortedByAmount.map((groupItem) => ({
                    group: groupItem.group,
                    amount: getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group == groupItem.group)),
                    colour: groupItem.colour,
                  }))}
                  currency={userPreferences.currency}
                  key={rerenderKey}
                />
              ) : (
                <CategoryPieChart
                  sortedBudgetArray={budgetArraySortedByAmount}
                  currency={userPreferences.currency}
                  key={rerenderKey}
                />
              )}
            </div>
          ) : (
            <p className={"font-medium text-sm"}>Create a Budget to View Insights.</p>
          )}
          <BudgetDistributionDrawer
            sortByGroup={sortByGroup}
            groupArraySortedByAmount={groupArraySortedByAmount}
            budgetArraySortedByAmount={budgetArraySortedByAmount}
            budgetTotal={budgetTotal}
          />
        </>
      )}
    </div>
  );
}
