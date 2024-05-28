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
import { getGroupBudgetTotal } from "@/utility/util.ts";
import { BudgetItemEntity, CategoryToIconGroupAndColourMap, GroupItemEntity } from "@/utility/types.ts";
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

interface BudgetDataBentoProps {
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  budgetTotal: number;
  categoryDataMap: CategoryToIconGroupAndColourMap;
  currency: string;
}

export default function BudgetDataBento({
  budgetArray,
  groupArray,
  budgetTotal,
  categoryDataMap,
  currency,
}: BudgetDataBentoProps) {
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
  const [rerenderKey, setRerenderKey] = useState(0);

  useEffect(() => {
    setGroupArraySortedByAmount(groupArray.sort(groupSizeSort));
  }, [groupArray]);

  useEffect(() => {
    setBudgetArraySortedByAmount(budgetArray.sort(budgetSizeSort));
  }, [budgetArray]);

  const handleValueChange = (value: string) => {
    setSortByGroup(value === "group");
    setRerenderKey(rerenderKey + 1);
  };

  return (
    <div className="flex flex-row justify-center items-center relative gap-2 border-[3px] border-gray-300 rounded-xl font-bold w-full h-[26rem] pt-2">
      {/*<p className={"absolute top-5 left-7"}>{`Budget Distribution by ${sortByGroup ? "Group" : "Category"}`}</p>*/}
      <Select onValueChange={handleValueChange} defaultValue={"category"}>
        <SelectTrigger className="w-[32ch] absolute top-3 left-4 z-30 bg-primary-foreground text-xs font-medium">
          <SelectValue placeholder={`Budget Distribution by ${sortByGroup ? "Group" : "Category"}`} />
        </SelectTrigger>
        <SelectContent>
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
      <div className={"relative h-full w-[34rem] md:w-[30rem] pt-4"}>
        {sortByGroup ? (
          <GroupPieChart
            sortedGroupDataArray={groupArraySortedByAmount.map((groupItem) => ({
              group: groupItem.group,
              amount: getGroupBudgetTotal(budgetArray.filter((budgetItem) => budgetItem.group == groupItem.group)),
              colour: groupItem.colour,
            }))}
            currency={currency}
            key={rerenderKey}
          />
        ) : (
          <CategoryPieChart sortedBudgetArray={budgetArraySortedByAmount} currency={currency} key={rerenderKey} />
        )}
      </div>
      <div className={"absolute top-3 right-3"}>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className={"text-xs px-2.5 mr-0.5"}>
              {`${sortByGroup ? "Group" : "Category"} Details`}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{`Budget Distribution by ${sortByGroup ? "Group" : "Category"}`}</DrawerTitle>
                <DrawerDescription>{`View the breakdown of your budget by ${sortByGroup ? "group" : "category"}.`}</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex-1 text-center">
                    {/*<div className="text-7xl font-bold tracking-tighter">Goal</div>*/}
                    {/*<div className="text-[0.70rem] uppercase text-muted-foreground">Calories/day</div>*/}
                    <div>
                      {sortByGroup ? (
                        <div className={"flex flex-col items-center mb-4"}>
                          {groupArraySortedByAmount.map((groupItem, index) => (
                            <div
                              className={"grid text-sm font-medium w-3/4"}
                              style={{ gridTemplateColumns: "2fr 1fr" }}
                              key={index}
                            >
                              <div className={"flex flex-row justify-start items-center gap-2 text-left"}>
                                <div
                                  className={"rounded-[50%] size-2 saturate-[650%] brightness-[90%]"}
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
                      ) : (
                        <div className={"flex flex-col items-center mb-4 max-h-48 overflow-y-scroll"}>
                          <div>
                            {budgetArraySortedByAmount.map((budgetItem, index) => (
                              <div
                                className={"grid text-sm font-medium w-full"}
                                style={{ gridTemplateColumns: "1fr 1fr" }}
                                key={index}
                              >
                                <div className={"flex flex-row justify-start items-center gap-2 text-left"}>
                                  <div
                                    className={"rounded-[50%] size-1.5 saturate-[600%] brightness-[90%]"}
                                    style={{
                                      backgroundColor: categoryDataMap.get(budgetItem.category)?.colour ?? "black",
                                    }}
                                  ></div>
                                  <p>{budgetItem.category}</p>
                                </div>
                                <div
                                  className={"text-right"}
                                >{`${((budgetItem.amount / budgetTotal) * 100).toFixed(0)}%`}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
  );
}
