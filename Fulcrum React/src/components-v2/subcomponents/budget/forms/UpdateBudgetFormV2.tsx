import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  BasicGroupData,
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  BudgetUpdatingFormData,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
} from "@/utility/types.ts";
import {
  capitaliseFirstLetter,
  getHighestGroupSortIndex,
  getRandomGroupColour,
  groupSort,
  useSetBudgetModalVisibility,
} from "@/utility/util.ts";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import useUpdateBudget from "@/hooks/mutations/budget/useUpdateBudget.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components-v2/ui/select.tsx";
import CategoryIconSelector from "@/components/child/selectors/CategoryIconSelector.tsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils.ts";
import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components-v2/ui/dialog";
import useDeleteBudget from "@/hooks/mutations/budget/useDeleteBudget.ts";
import FulcrumDialogTwoOptions from "@/components-v2/subcomponents/other/FulcrumDialogTwoOptions.tsx";

interface UpdateBudgetFormV2Props {
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  groupArray: GroupItemEntity[];
  currencySymbol: string;
  updateOldBudgetBeingEdited: (e: React.MouseEvent) => void;
  categoryToDelete: string;
}

export default function UpdateBudgetFormV2({
  groupArray,
  oldBudgetBeingEdited,
  currencySymbol,
  updateOldBudgetBeingEdited,
  categoryToDelete,
}: UpdateBudgetFormV2Props) {
  const [formData, setFormData] = useState<BudgetUpdatingFormData>({
    category: oldBudgetBeingEdited.oldCategory,
    amount: oldBudgetBeingEdited.oldAmount,
    iconPath: oldBudgetBeingEdited.oldIconPath,
    group: oldBudgetBeingEdited.oldGroup,
  });
  // const formRef = useRef<HTMLDivElement>(null);
  // const routerLocation = useContext(LocationContext);
  const { mutate: updateBudget } = useUpdateBudget();
  const { mutate: deleteBudget } = useDeleteBudget();

  const setBudgetModalVisibility = useSetBudgetModalVisibility()!;

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
    // changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", false);
    setFormIsOpen(false);
  }

  // useEffect(() => {
  //   const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
  //   const removeColourEventListeners = addColourSelectionFunctionality(setFormData);
  //   return () => {
  //     removeFormExitEventListeners();
  //     removeColourEventListeners();
  //   };
  // }, [routerLocation]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((currentFormData) => {
      return { ...currentFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const updatedBudgetItem: BudgetItemEntity = { ...formData, timestamp: new Date() };

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

  const handleGroupSelectChange = (group: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, group: group }));
  };

  const [autoAnimateRef] = useAutoAnimate();
  const [showConfirmDeleteBudgetDialog, setShowConfirmDeleteBudgetDialog] = useState(false);

  return (
    <div className={"update-budget-trigger size-44 absolute"} ref={autoAnimateRef}>
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldBudgetBeingEdited} className={"w-full h-full"}>
          {/*<Button*/}
          {/*  asChild*/}
          {/*  variant={"ghost"}*/}
          {/*  className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%] transition-all"}*/}
          {/*>*/}
          {/*  <div className={"edit-delete-button-icon-container origin-center transition-all"}>*/}
          {/*    <svg*/}
          {/*      xmlns="http://www.w3.org/2000/svg"*/}
          {/*      viewBox="0 0 20 20"*/}
          {/*      fill="currentColor"*/}
          {/*      className="size-4 transition-all duration-200 ease-out"*/}
          {/*    >*/}
          {/*      <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />*/}
          {/*    </svg>*/}
          {/*  </div>*/}
          {/*</Button>*/}
        </SheetTrigger>
        <SheetContent>
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
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-black text-sm">{currencySymbol}</b>
              <Input
                type="text"
                className={"col-span-3 pl-8"}
                onChange={handleInputChange}
                value={formData.amount === 0 ? "" : formData.amount.toFixed(2)}
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
              <Select value={formData.group} onValueChange={handleGroupSelectChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {groupArray.sort(groupSort).map((groupItem, index) => (
                    <SelectItem value={groupItem.group} key={index}>
                      {groupItem.group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="iconPath" className={"text-right"}>
                Icon
              </Label>
              <CategoryIconSelector setFormData={setFormData} className={"col-span-3"} />
            </div>

            <div className={"grid grid-cols-8 items-center gap-5 mt-2"}>
              {/*<Button*/}
              {/*  className={"col-start-3 col-span-3"}*/}
              {/*  variant={"destructive"}*/}
              {/*  onClick={() =>*/}
              {/*    setBudgetModalVisibility((previousVisibility) => ({*/}
              {/*      ...previousVisibility,*/}
              {/*      showConfirmDeleteCategoryModal: true,*/}
              {/*    }))*/}
              {/*  }*/}
              {/*  type={"button"}*/}
              {/*>*/}
              {/*  Delete*/}
              {/*</Button>*/}
              <FulcrumDialogTwoOptions
                dialogOpen={showConfirmDeleteBudgetDialog}
                setDialogOpen={setShowConfirmDeleteBudgetDialog}
                dialogTitle={`Delete the budget category '${categoryToDelete}'?`}
                dialogDescription={"Any expenses under this category will also be permanently deleted."}
                leftButtonFunction={() => setShowConfirmDeleteBudgetDialog(false)}
                rightButtonFunction={() => deleteBudget(categoryToDelete)}
                leftButtonText={"Cancel"}
                rightButtonText={"Delete"}
                buttonTriggerComponent={
                  <Button asChild className={"flex-grow"} variant={"destructive"} type={"button"}>
                    Delete
                  </Button>
                }
              />
              <Button className={"col-start-6 col-span-3"}>Save Changes</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
