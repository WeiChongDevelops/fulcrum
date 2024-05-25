import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import {
  DropdownSelectorOption,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  PreviousRecurringExpenseBeingEdited,
  RecurringExpenseFormVisibility,
  RecurringExpenseFrequency,
  RecurringExpenseItemEntity,
  RecurringExpenseUpdatingFormData,
  SelectorOptionsFormattedData,
  SetFormVisibility,
} from "@/utility/types.ts";
import useUpdateExpense from "@/hooks/mutations/expense/useUpdateExpense.ts";
import { handleInputChangeOnFormWithAmount, useEmail, useSideBarIsOpen } from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import CategorySelector from "@/components/child/selectors/CategorySelector.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import ExpenseDatePicker from "@/components/child/selectors/ExpenseDatePicker.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import useUpdateRecurringExpense from "@/hooks/mutations/recurring-expense/useUpdateRecurringExpense.ts";
import FrequencySelector from "@/components/child/selectors/FrequencySelector.tsx";
import { toast } from "sonner";
import * as React from "react";
import useDeleteRecurringExpense from "@/hooks/mutations/recurring-expense/useDeleteRecurringExpense.ts";
import FulcrumDialogTwoOptions from "@/components-v2/subcomponents/other/FulcrumDialogTwoOptions.tsx";
import FulcrumDialogThreeOptions from "@/components-v2/subcomponents/other/FulcrumDialogThreeOptions.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateRecurringFormV2Props {
  categoryOptions: DropdownSelectorOption[];
  oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
  currencySymbol: string;
  setOldRecurringExpenseBeingEdited: Dispatch<SetStateAction<PreviousRecurringExpenseBeingEdited>>;
  recurringExpenseId: string;
  category: string;
  amount: number;
  timestamp: Date;
  frequency: RecurringExpenseFrequency;
}

export default function UpdateRecurringFormV2({
  categoryOptions,
  oldRecurringExpenseBeingEdited,
  currencySymbol,
  setOldRecurringExpenseBeingEdited,
  recurringExpenseId,
  category,
  amount,
  timestamp,
  frequency,
}: UpdateRecurringFormV2Props) {
  const { mutate: deleteRecurringExpense } = useDeleteRecurringExpense();
  const [formIsOpen, setFormIsOpen] = useState(false);

  const [formData, setFormData] = useState<RecurringExpenseUpdatingFormData>({
    category: oldRecurringExpenseBeingEdited.oldCategory,
    amount: oldRecurringExpenseBeingEdited.oldAmount,
    timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
    frequency: oldRecurringExpenseBeingEdited.oldFrequency,
  });
  const { mutate: updateRecurringExpense } = useUpdateRecurringExpense();

  useEffect(() => {
    setFormData({
      category: oldRecurringExpenseBeingEdited.oldCategory,
      amount: oldRecurringExpenseBeingEdited.oldAmount,
      timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
      frequency: oldRecurringExpenseBeingEdited.oldFrequency,
    });
  }, [oldRecurringExpenseBeingEdited, formIsOpen]);

  const hideForm = () => {
    setFormIsOpen(false);
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    const updatedRecurringExpenseItem: RecurringExpenseItemEntity = {
      ...formData,
      recurringExpenseId: oldRecurringExpenseBeingEdited.recurringExpenseId,
      timestamp: formData.timestamp as Date,
    };
    updateRecurringExpense(updatedRecurringExpenseItem);

    setFormData({
      category: oldRecurringExpenseBeingEdited.oldCategory,
      amount: oldRecurringExpenseBeingEdited.oldAmount,
      timestamp: oldRecurringExpenseBeingEdited.oldTimestamp,
      frequency: oldRecurringExpenseBeingEdited.oldFrequency,
    });
  }

  const updateOldRecurringBeingEdited = () => {
    setOldRecurringExpenseBeingEdited({
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
      oldFrequency: frequency,
    });
  };

  const navMenuIsOpen = useSideBarIsOpen();

  const queryClient = useQueryClient();
  const expenseArray: ExpenseItemEntity[] = queryClient.getQueryData(["expenseArray", useEmail()])!;

  const [showDeleteRecurringOptionsDialog, setShowDeleteRecurringOptionsDialog] = useState(false);
  const [showConfirmDeleteRecurringDialog, setShowConfirmDeleteRecurringDialog] = useState(false);

  return (
    <div
      className={"h-20 inset-0 absolute update-expense-trigger z-10"}
      style={{ width: `calc(100vw - ${navMenuIsOpen ? "14rem" : "5rem"} - 4rem)` }}
    >
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldRecurringBeingEdited} className={"w-full h-full"}></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Updating Recurring Expense</SheetTitle>
            <SheetDescription>{`Making changes to your existing recurring expense.`}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="category" className={"text-right"}>
                Category
              </Label>
              <CategorySelector
                categoryOptions={categoryOptions}
                setFormData={setFormData}
                defaultCategory={oldRecurringExpenseBeingEdited.oldCategory}
                className={"col-span-3"}
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
                value={formData.amount === 0 ? "" : formData.amount}
                name="amount"
                id="amount"
                autoComplete={"off"}
                required
              />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label className={"text-right"}>Starting Date</Label>
              <ExpenseDatePicker
                setFormData={setFormData}
                defaultDate={oldRecurringExpenseBeingEdited.oldTimestamp}
                className={"col-span-3"}
              />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label className={"text-right"}>Repeat</Label>
              <FrequencySelector
                setFormData={setFormData}
                className={"col-span-3"}
                mustBeRecurring={true}
                initialFrequency={oldRecurringExpenseBeingEdited.oldFrequency}
              />
            </div>

            <div className={"grid grid-cols-8 items-center gap-5 mt-2"}>
              <FulcrumDialogThreeOptions
                dialogOpen={showDeleteRecurringOptionsDialog}
                setDialogOpen={setShowDeleteRecurringOptionsDialog}
                dialogTitle={"Keep past repeats of this recurring expense?"}
                dialogDescription={"You can delete specific repeats in the 'Expenses' section."}
                leftButtonText={"Cancel"}
                leftButtonFunction={() => setShowDeleteRecurringOptionsDialog(false)}
                midButtonText={"Keep Repeats"}
                midButtonFunction={() => {
                  setShowDeleteRecurringOptionsDialog(false);
                  deleteRecurringExpense({
                    recurringExpenseId: recurringExpenseId,
                    alsoDeleteAllInstances: false,
                    expenseArray: expenseArray,
                  });
                }}
                rightButtonText={"Delete Repeats"}
                rightButtonFunction={() => {
                  setShowDeleteRecurringOptionsDialog(false);
                  setShowConfirmDeleteRecurringDialog(true);
                }}
                buttonTriggerComponent={
                  <Button className={"flex-grow"} variant={"destructive"} type={"button"}>
                    Delete
                  </Button>
                }
              />

              <Button className={"col-start-6 col-span-3"}>Save Changes</Button>
            </div>

            <FulcrumDialogTwoOptions
              dialogOpen={showConfirmDeleteRecurringDialog}
              setDialogOpen={setShowConfirmDeleteRecurringDialog}
              dialogTitle={"Delete this recurring expense and past repeats?"}
              dialogDescription={"This decision is irreversible."}
              leftButtonText={"Cancel"}
              leftButtonFunction={() => setShowConfirmDeleteRecurringDialog(false)}
              rightButtonText={"Confirm"}
              rightButtonFunction={() => {
                setShowConfirmDeleteRecurringDialog(false);
                deleteRecurringExpense({
                  recurringExpenseId: recurringExpenseId,
                  alsoDeleteAllInstances: true,
                  expenseArray: expenseArray,
                });
              }}
            />
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
