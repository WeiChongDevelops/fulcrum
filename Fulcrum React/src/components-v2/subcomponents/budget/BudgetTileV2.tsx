import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  PreviousBudgetBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { changeFormOrModalVisibility, formatDollarAmountStatic } from "@/utility/util.ts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dispatch, SetStateAction } from "react";

interface BudgetTileV2Props {
  filteredBudgetItem: BudgetItemEntity;
  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  publicUserData: PublicUserData;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

export default function BudgetTileV2({
  filteredBudgetItem,
  setOldBudgetBeingEdited,
  setCategoryToDelete,
  setBudgetModalVisibility,
  setBudgetFormVisibility,
  publicUserData,
  perCategoryExpenseTotalThisMonth,
}: BudgetTileV2Props) {
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCategoryToDelete(filteredBudgetItem.category);
    changeFormOrModalVisibility(setBudgetModalVisibility, "isDeleteOptionsModalVisible", true);
  };

  return (
    <Card
      className="size-44 outline"
      onClick={() => {
        const oldBudgetBeingEdited: PreviousBudgetBeingEdited = {
          oldAmount: filteredBudgetItem.amount,
          oldCategory: filteredBudgetItem.category,
          oldGroup: filteredBudgetItem.group,
          oldIconPath: filteredBudgetItem.iconPath,
        };
        setOldBudgetBeingEdited(oldBudgetBeingEdited);
        changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateBudgetVisible", true);
      }}
    >
      <CardHeader className={"py-3"}>
        <CardTitle className={"text-sm font-bold"}>{filteredBudgetItem.category}</CardTitle>
        {/*<CardDescription>Deploy your new project in one-click.</CardDescription>*/}
      </CardHeader>
      <CardContent className={"flex flex-col gap-4 pb-2 justify-center items-center"}>
        {/*<p className={"truncate"}>Left: {formatDollarAmountStatic(amount - spent, currency)}</p>*/}
        <div className={"bg-black rounded-xl size-16 p-3"}>
          <img src={`/static/assets-v2/category-icons/${filteredBudgetItem.iconPath}`} alt="Category icon" />
        </div>
        <div>
          <p className={"truncate"}>
            Budget: {formatDollarAmountStatic(filteredBudgetItem.amount, publicUserData.currency)}
          </p>
          <p className={"truncate"}>
            Left: ${filteredBudgetItem.amount - perCategoryExpenseTotalThisMonth.get(filteredBudgetItem.category)!}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center pb-2">
        <Button variant={"ghost"} onClick={handleDeleteClick}>
          {/*<button className="circle-button" onClick={handleDeleteClick}>*/}
          <img src="/static/assets-v2/UI-icons/delete-trash-black-icon.svg" alt="Budget delete icon" className="size-6" />
        </Button>
      </CardFooter>
    </Card>
  );
}
