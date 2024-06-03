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
import { ScrollArea } from "@/components-v2/ui/scroll-area.tsx";
import { BudgetItemEntity, CategoryToIconAndColourMap, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import { useQueryClient } from "@tanstack/react-query";

interface BudgetDistributionDrawerProps {
  sortByGroup: boolean;
  groupArraySortedByAmount: GroupItemEntity[];
  budgetArraySortedByAmount: BudgetItemEntity[];
  budgetTotal: number;
}

export default function BudgetDistributionDrawer({
  sortByGroup,
  groupArraySortedByAmount,
  budgetArraySortedByAmount,
  budgetTotal,
}: BudgetDistributionDrawerProps) {
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const categoryToIconAndColourMap: CategoryToIconAndColourMap = useQueryClient().getQueryData([
    "categoryToIconAndColourMap",
    useEmail(),
  ])!;
  return (
    <div className={"absolute top-3 right-3"}>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className={"text-xs px-2.5 mr-0.5"}>
            {`${sortByGroup ? "Group" : "Category"} Details`}
          </Button>
        </DrawerTrigger>
        <DrawerContent className={cn("bg-background text-primary", userPreferences.darkModeEnabled && "dark")}>
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

                  {budgetArray.length > 0 ? (
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
                        <ScrollArea className={"flex flex-col items-center mb-4 h-48"}>
                          <div>
                            {budgetArraySortedByAmount.map((budgetItem, index) => (
                              <div
                                className={"grid text-sm font-medium w-full"}
                                style={{ gridTemplateColumns: "1fr 1fr" }}
                                key={index}
                              >
                                <div className={"flex flex-row justify-start items-center gap-2 text-left"}>
                                  <div
                                    className={"rounded-[50%] size-1.5 saturate-[600%] brightness-[90%] ml-4"}
                                    style={{
                                      backgroundColor:
                                        categoryToIconAndColourMap.get(budgetItem.category)?.colour ?? "black",
                                    }}
                                  ></div>
                                  <p>{budgetItem.category}</p>
                                </div>
                                <div
                                  className={"ml-auto mr-4"}
                                >{`${((budgetItem.amount / budgetTotal) * 100).toFixed(0)}%`}</div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                  ) : (
                    <p className={"font-medium text-sm my-8"}>Create a Budget to View Insights.</p>
                  )}
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
  );
}
