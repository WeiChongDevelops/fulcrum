import { handleInputChangeOnFormWithAmount, useEmail, useSideBarIsOpen } from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import CategorySelector from "@/components-v2/subcomponents/selectors/CategorySelector.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import ExpenseDatePicker from "@/components-v2/subcomponents/selectors/ExpenseDatePicker.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import {
  DropdownSelectorOption,
  ExpenseItemEntity,
  PreviousExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  UserPreferences,
} from "@/utility/types.ts";
import useUpdateExpense from "@/hooks/mutations/expense/useUpdateExpense.ts";
import { toast } from "sonner";
import useDeleteExpense from "@/hooks/mutations/expense/useDeleteExpense.ts";
import ThreeOptionModal from "@/components-v2/subcomponents/other/modal/ThreeOptionModal.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateRecurringInstanceFormV2Props {
  categoryOptions: DropdownSelectorOption[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  currencySymbol: string;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  expenseId: string;
  category: string;
  amount: number;
  recurringExpenseId: string | null;
  timestamp: Date;
}

export default function UpdateRecurringInstanceFormV2({
  categoryOptions,
  oldExpenseBeingEdited,
  currencySymbol,
  setOldExpenseBeingEdited,
  expenseId,
  recurringExpenseId,
  category,
  amount,
  timestamp,
}: UpdateRecurringInstanceFormV2Props) {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [formData, setFormData] = useState<RecurringExpenseInstanceUpdatingFormData>({
    category: oldExpenseBeingEdited.oldCategory,
    amount: oldExpenseBeingEdited.oldAmount,
  });
  const { mutate: updateExpense } = useUpdateExpense();
  const { mutate: deleteExpense, isPending } = useDeleteExpense();

  const queryClient = useQueryClient();
  const expenseArray: ExpenseItemEntity[] = queryClient.getQueryData(["expenseArray", useEmail()])!;
  const userPreferences: UserPreferences = queryClient.getQueryData(["userPreferences", useEmail()])!;

  const hideForm = () => {
    setFormIsOpen(false);
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
    });

    const noChangesMade =
      formData.category === oldExpenseBeingEdited.oldCategory && formData.amount === oldExpenseBeingEdited.oldAmount;

    const updatedExpenseItem: ExpenseItemEntity = {
      expenseId: oldExpenseBeingEdited.expenseId,
      category: formData.category,
      amount: formData.amount,
      timestamp: oldExpenseBeingEdited.oldTimestamp,
      recurringExpenseId: noChangesMade ? oldExpenseBeingEdited.recurringExpenseId : null,
    };

    updateExpense(updatedExpenseItem);
  }

  const updateOldExpenseBeingEdited = () => {
    setOldExpenseBeingEdited({
      expenseId: expenseId,
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
    });
  };

  useEffect(() => {
    setFormData({
      category: oldExpenseBeingEdited.oldCategory,
      amount: oldExpenseBeingEdited.oldAmount,
    });
  }, [oldExpenseBeingEdited]);

  const navMenuIsOpen = useSideBarIsOpen();

  const [toastId, setToastId] = useState<string | number>();

  useEffect(() => {
    if (isPending) {
      setToastId(
        toast.loading("Syncing changes, please wait.", {
          description: "Large deletions may take a bit longer.",
          style: {
            textAlign: "left",
          },
        }),
      );
    } else {
      !!toastId && toast.dismiss(toastId);
    }
  }, [isPending]);

  const [showDeleteInstanceOptionsModal, setShowDeleteInstanceOptionsModal] = useState(false);

  const expenseItemToDelete: ExpenseItemEntity = {
    expenseId: expenseId,
    category: category,
    amount: amount,
    timestamp: timestamp,
    recurringExpenseId: recurringExpenseId,
  };

  return (
    <div
      className={"h-20 inset-0 absolute update-expense-trigger z-10"}
      style={{ width: `calc(100vw - ${navMenuIsOpen ? "13rem" : "5rem"} - 4rem)` }}
    >
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldExpenseBeingEdited} className={"w-full h-full"}></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Updating Expense Repeat</SheetTitle>
            <SheetDescription>
              <span>You're currently editing this instance of your recurring expense.</span>
              <span className={"mt-3 block"}>
                For full control over your recurring expenses, check the <b>'Recurring'</b> section.
              </span>
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="category" className={"text-right"}>
                Category
              </Label>
              <CategorySelector
                categoryOptions={categoryOptions}
                setFormData={setFormData}
                defaultCategory={oldExpenseBeingEdited.oldCategory}
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
              <Label className={"text-right"}>Date</Label>
              <ExpenseDatePicker
                setFormData={setFormData}
                defaultDate={oldExpenseBeingEdited.oldTimestamp}
                className={"col-span-3"}
              />
            </div>

            <div className={"grid grid-cols-8 items-center gap-5 mt-2"}>
              <ThreeOptionModal
                dialogOpen={showDeleteInstanceOptionsModal}
                setDialogOpen={setShowDeleteInstanceOptionsModal}
                dialogTitle={"Delete which expense repeats?"}
                dialogDescription={
                  "To stop future repeats or otherwise manage your recurring expenses, see the 'Recurring' section."
                }
                leftButtonVariant={"default"}
                leftButtonText={"This Repeat Only"}
                leftButtonFunction={() => {
                  setShowDeleteInstanceOptionsModal(false);
                  deleteExpense({
                    expenseItemToDelete: expenseItemToDelete,
                    deletionScale: "THIS",
                    expenseArray: expenseArray,
                  });
                }}
                midButtonText={"This and Future Repeats"}
                midButtonFunction={() => {
                  setShowDeleteInstanceOptionsModal(false);
                  deleteExpense({
                    expenseItemToDelete: expenseItemToDelete,
                    deletionScale: "FUTURE",
                    expenseArray: expenseArray,
                  });
                }}
                rightButtonText={"All Repeats"}
                rightButtonFunction={() => {
                  setShowDeleteInstanceOptionsModal(false);
                  deleteExpense({
                    expenseItemToDelete: expenseItemToDelete,
                    deletionScale: "ALL",
                    expenseArray: expenseArray,
                  });
                }}
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
