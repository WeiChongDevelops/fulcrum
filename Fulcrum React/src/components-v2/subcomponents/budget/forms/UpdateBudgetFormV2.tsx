import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  BudgetItemEntity,
  BudgetUpdatingFormData,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  UserPreferences,
} from "@/utility/types.ts";
import {
  capitaliseFirstLetter,
  cn,
  getHighestGroupSortIndex,
  getRandomGroupColour,
  handleInputChangeOnFormWithAmount,
  useEmail,
} from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import useUpdateBudget from "@/hooks/mutations/budget/useUpdateBudget.ts";
import CategoryIconSelector from "@/components-v2/subcomponents/selectors/CategoryIconSelector.tsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as React from "react";
import useDeleteBudget from "@/hooks/mutations/budget/useDeleteBudget.ts";
import TwoOptionModal from "@/components-v2/subcomponents/other/modal/TwoOptionModal.tsx";
import { useQueryClient } from "@tanstack/react-query";
import GroupSelector from "@/components-v2/subcomponents/budget/GroupSelector.tsx";

interface UpdateBudgetFormV2Props {
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  currencySymbol: string;
  updateOldBudgetBeingEdited: (e: React.MouseEvent) => void;
}

export default function UpdateBudgetFormV2({
  oldBudgetBeingEdited,
  currencySymbol,
  updateOldBudgetBeingEdited,
}: UpdateBudgetFormV2Props) {
  const [formData, setFormData] = useState<BudgetUpdatingFormData>({
    category: oldBudgetBeingEdited.oldCategory,
    amount: oldBudgetBeingEdited.oldAmount,
    iconPath: oldBudgetBeingEdited.oldIconPath,
    group: oldBudgetBeingEdited.oldGroup,
  });
  const { mutate: updateBudget } = useUpdateBudget();
  const { mutate: deleteBudget } = useDeleteBudget();
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [formIsOpen, setFormIsOpen] = useState(false);

  useEffect(() => {
    setFormData({
      category: oldBudgetBeingEdited.oldCategory,
      amount: oldBudgetBeingEdited.oldAmount,
      iconPath: oldBudgetBeingEdited.oldIconPath,
      group: oldBudgetBeingEdited.oldGroup,
    });
  }, [oldBudgetBeingEdited, formIsOpen]);

  function hideForm() {
    setFormIsOpen(false);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const updatedBudgetItem: BudgetItemEntity = {
      ...formData,
      amount: typeof formData.amount === "string" ? parseFloat(formData.amount) : formData.amount,
      timestamp: new Date(),
      id: oldBudgetBeingEdited.id, // Used only for optimistic update
    };

    if (!groupArray.map((groupItem) => groupItem.group).includes(updatedBudgetItem.group)) {
      defaultGroupItem = {
        group: updatedBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
        id: getHighestGroupSortIndex(groupArray) + 1,
      };
    }

    updateBudget({
      originalCategory: oldBudgetBeingEdited.oldCategory,
      updatedBudgetItem: updatedBudgetItem,
      newGroupItem: defaultGroupItem,
    });

    setFormData({
      category: oldBudgetBeingEdited.oldCategory,
      amount: oldBudgetBeingEdited.oldAmount,
      iconPath: "",
      group: oldBudgetBeingEdited.oldGroup,
    });
  }

  const [autoAnimateRef] = useAutoAnimate();
  const [showConfirmDeleteBudgetDialog, setShowConfirmDeleteBudgetDialog] = useState(false);

  return (
    <div className={"update-budget-trigger size-36 absolute"} ref={autoAnimateRef}>
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldBudgetBeingEdited} className={"size-36 "}></SheetTrigger>
        <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
          <SheetHeader>
            <SheetTitle>Updating Budget Category</SheetTitle>
            <SheetDescription>{`Making changes to the budget for '${oldBudgetBeingEdited.oldCategory}'.`}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="category" className={"text-right"}>
                Category
              </Label>
              <Input
                type="text"
                className={"col-span-3"}
                onChange={handleInputChange}
                value={capitaliseFirstLetter(formData.category)}
                name="category"
                id="category"
                maxLength={18}
                autoComplete={"off"}
                required
              />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5 relative"}>
              <Label htmlFor="amount" className={"text-right"}>
                Amount
              </Label>
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-primary text-sm">{currencySymbol}</b>
              <Input
                type="text"
                className={"col-span-3 pl-8"}
                onChange={handleInputChange}
                value={formData.amount}
                name="amount"
                id="amount"
                autoComplete={"off"}
                required
              />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="group" className={"text-right"}>
                Group
              </Label>
              <GroupSelector formData={formData} setFormData={setFormData} />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="iconPath" className={"text-right"}>
                Icon
              </Label>
              <CategoryIconSelector formData={formData} setFormData={setFormData} className={"col-span-3"} />
            </div>

            <div className={"grid grid-cols-8 items-center gap-5 mt-2"}>
              <TwoOptionModal
                dialogOpen={showConfirmDeleteBudgetDialog}
                setDialogOpen={setShowConfirmDeleteBudgetDialog}
                dialogTitle={`Delete the budget category '${oldBudgetBeingEdited.oldCategory}'?`}
                dialogDescription={"Any expenses under this category will also be permanently deleted."}
                leftButtonFunction={() => setShowConfirmDeleteBudgetDialog(false)}
                rightButtonFunction={() => {
                  setShowConfirmDeleteBudgetDialog(false);
                  hideForm();
                  deleteBudget(oldBudgetBeingEdited.oldCategory);
                }}
                leftButtonText={"Cancel"}
                rightButtonText={"Delete"}
                buttonTriggerComponent={
                  <Button className={"flex-grow"} variant={"destructive"} type={"button"}>
                    Delete
                  </Button>
                }
              />
              <Button
                className={"col-start-6 col-span-3"}
                variant={userPreferences.darkModeEnabled ? "secondary" : "default"}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
