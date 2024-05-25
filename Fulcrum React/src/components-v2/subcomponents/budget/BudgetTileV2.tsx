import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { changeFormOrModalVisibility, formatDollarAmountStatic, getCurrencySymbol } from "@/utility/util.ts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components-v2/ui/card.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import DynamicIconComponent from "@/components-v2/subcomponents/other/DynamicIconComponent.tsx";
import UpdateBudgetFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateBudgetFormV2.tsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils.ts";

interface BudgetTileV2Props {
  filteredBudgetItem: BudgetItemEntity;
  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  publicUserData: PublicUserData;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  groupArray: GroupItemEntity[];
}

export default function BudgetTileV2({
  filteredBudgetItem,
  setOldBudgetBeingEdited,
  setCategoryToDelete,
  setBudgetModalVisibility,
  setBudgetFormVisibility,
  publicUserData,
  perCategoryExpenseTotalThisMonth,
  oldBudgetBeingEdited,
  groupArray,
}: BudgetTileV2Props) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCategoryToDelete(filteredBudgetItem.category);
    changeFormOrModalVisibility(setBudgetModalVisibility, "isDeleteOptionsModalVisible", true);
  };

  const updateOldBudgetBeingEdited = () => {
    setOldBudgetBeingEdited({
      oldAmount: filteredBudgetItem.amount,
      oldCategory: filteredBudgetItem.category,
      oldGroup: filteredBudgetItem.group,
      oldIconPath: filteredBudgetItem.iconPath,
    });
  };

  const [autoAnimateRef] = useAutoAnimate();

  const spent = perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category) ?? 0;

  return (
    <div className={"size-44 relative"}>
      <UpdateBudgetFormV2
        oldBudgetBeingEdited={oldBudgetBeingEdited}
        groupArray={groupArray}
        currencySymbol={getCurrencySymbol(publicUserData.currency)}
        updateOldBudgetBeingEdited={updateOldBudgetBeingEdited}
      />
      <Card className="size-44 outline relative transition-all duration-150 ease -z-10">
        <CardHeader className={"py-4"}>
          <CardTitle className={"text-xs lg:text-sm font-bold"}>{filteredBudgetItem.category}</CardTitle>
        </CardHeader>
        <CardContent className={"flex flex-col gap-3 pb-2 justify-center items-center"}>
          <div ref={autoAnimateRef}>
            <DynamicIconComponent componentName={filteredBudgetItem.iconPath} props={{ size: "3rem" }} className={"mt-1"} />
          </div>
          <div>
            <p className={"truncate"}>
              Budget: <b>{formatDollarAmountStatic(filteredBudgetItem.amount, publicUserData.currency)}</b>
            </p>
            <p className={`truncate`}>
              <span>{"Left: "}</span>
              <b className={cn(spent > filteredBudgetItem.amount ? "text-red-500" : "text-black")}>
                {formatDollarAmountStatic(
                  filteredBudgetItem.amount - perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category)!,
                  publicUserData.currency,
                )}
              </b>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
