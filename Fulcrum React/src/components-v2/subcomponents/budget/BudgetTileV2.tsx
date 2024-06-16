import { BudgetItemEntity, PreviousBudgetBeingEdited, UserPreferences } from "@/utility/types.ts";
import { cn, formatDollarAmountStatic, getCurrencySymbol, useEmail } from "@/utility/util.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components-v2/ui/card.tsx";
import { Dispatch, SetStateAction } from "react";
import DynamicIconComponent from "@/components-v2/subcomponents/other/DynamicIconComponent.tsx";
import UpdateBudgetFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateBudgetFormV2.tsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components-v2/ui/tooltip.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface BudgetTileV2Props {
  filteredBudgetItem: BudgetItemEntity;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

export default function BudgetTileV2({
  filteredBudgetItem,
  oldBudgetBeingEdited,
  setOldBudgetBeingEdited,
  perCategoryExpenseTotalThisMonth,
}: BudgetTileV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const updateOldBudgetBeingEdited = () => {
    setOldBudgetBeingEdited({
      oldAmount: filteredBudgetItem.amount,
      oldCategory: filteredBudgetItem.category,
      oldGroup: filteredBudgetItem.group,
      oldIconPath: filteredBudgetItem.iconPath,
      id: filteredBudgetItem.id,
    });
  };

  const [autoAnimateRef] = useAutoAnimate();

  const spent = perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category) ?? 0;

  return (
    <div className={"size-36 relative"}>
      <TooltipProvider delayDuration={200} disableHoverableContent={false}>
        {filteredBudgetItem.category === "Other (Default)" ? (
          <Tooltip>
            <TooltipTrigger className={"w-full h-full hover:cursor-not-allowed absolute left-4"}></TooltipTrigger>
            <TooltipContent side={"top"}>
              <span>Default category cannot be deleted.</span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <UpdateBudgetFormV2
            oldBudgetBeingEdited={oldBudgetBeingEdited}
            currencySymbol={getCurrencySymbol(userPreferences.currency)}
            updateOldBudgetBeingEdited={updateOldBudgetBeingEdited}
          />
        )}
        <Card className="size-36 bg-white dark:bg-zinc-900 outline outline-2 lg:outline-[3px] outline-zinc-800 dark:outline-zinc-400 relative transition-all duration-150 ease -z-10 flex flex-col justify-center">
          <CardHeader className={"py-2 px-0"}>
            <CardTitle className={"text-xs font-bold"}>{filteredBudgetItem.category}</CardTitle>
          </CardHeader>
          <CardContent className={"flex flex-col gap-4 pb-2 justify-center items-center"}>
            <div ref={autoAnimateRef}>
              <DynamicIconComponent
                componentName={filteredBudgetItem.iconPath}
                props={{ size: "2.5rem" }}
                className={"mt-1"}
              />
            </div>
            <div className={"text-xs"}>
              <p className={"truncate font-light"}>
                <span>{"Budget: "}</span>
                <span className={"font-bold"}>
                  {formatDollarAmountStatic(filteredBudgetItem.amount, userPreferences.currency)}
                </span>
              </p>
              <p className={`truncate font-light`}>
                <span>{"Left: "}</span>
                <span className={cn("font-bold", spent > filteredBudgetItem.amount ? "text-[#FF3F3F]" : "text-primary")}>
                  {formatDollarAmountStatic(
                    filteredBudgetItem.amount - perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category)!,
                    userPreferences.currency,
                  )}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
