import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import GroupColourSelector from "@/components-v2/subcomponents/selectors/GroupColourSelector.tsx";
import CategorySelector from "@/components-v2/subcomponents/selectors/CategorySelector.tsx";
import {
  capitaliseFirstLetter,
  cn,
  getCurrencySymbol,
  handleInputChangeOnFormWithAmount,
  useEmail,
  useSideBarIsOpen,
} from "@/utility/util.ts";
import ExpenseDatePicker from "@/components-v2/subcomponents/selectors/ExpenseDatePicker.tsx";
import FrequencySelector from "@/components-v2/subcomponents/selectors/FrequencySelector.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import {
  BudgetItemEntity,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  UserPreferences,
  SetFormVisibility,
} from "@/utility/types.ts";
import useUpdateExpense from "@/hooks/mutations/expense/useUpdateExpense.ts";
import { toast } from "sonner";
import TwoOptionModal from "@/components-v2/subcomponents/other/modal/TwoOptionModal.tsx";
import useDeleteExpense from "@/hooks/mutations/expense/useDeleteExpense.ts";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateExpenseFormV2Props {
  categoryOptions: DropdownSelectorOption[];
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;
  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  currencySymbol: string;

  expenseId: string;
  category: string;
  amount: number;
  recurringExpenseId: string | null;
  timestamp: Date;
}

export default function UpdateExpenseFormV2({
  categoryOptions,
  oldExpenseBeingEdited,
  setOldExpenseBeingEdited,
  currencySymbol,
  expenseId,
  recurringExpenseId,
  category,
  amount,
  timestamp,
}: UpdateExpenseFormV2Props) {
  const [formIsOpen, setFormIsOpen] = useState(false);

  const [formData, setFormData] = useState<ExpenseUpdatingFormData>({
    category: oldExpenseBeingEdited.oldCategory,
    amount: oldExpenseBeingEdited.oldAmount,
    timestamp: oldExpenseBeingEdited.oldTimestamp,
  });
  const { mutate: updateExpense } = useUpdateExpense();
  const { mutate: deleteExpense, isPending } = useDeleteExpense();
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [showConfirmDeleteExpenseDialog, setShowConfirmDeleteExpenseDialog] = useState(false);

  const queryClient = useQueryClient();
  const expenseArray: ExpenseItemEntity[] = queryClient.getQueryData(["expenseArray", useEmail()])!;

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
      timestamp: oldExpenseBeingEdited.oldTimestamp,
    });

    const updatedExpenseItem: ExpenseItemEntity = {
      ...formData,
      amount: formData.amount,
      expenseId: oldExpenseBeingEdited.expenseId,
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
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
      timestamp: oldExpenseBeingEdited.oldTimestamp,
    });
  }, [setOldExpenseBeingEdited, formIsOpen]);

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

  return (
    <div
      className={"h-20 inset-0 absolute update-expense-trigger z-10"}
      style={{ width: `calc(100vw - ${navMenuIsOpen ? "13rem" : "5rem"} - 4rem)` }}
    >
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldExpenseBeingEdited} className={"w-full h-full"}></SheetTrigger>
        <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
          <SheetHeader>
            <SheetTitle>Updating Expense</SheetTitle>
            <SheetDescription>{`Making changes to an existing expense entry.`}</SheetDescription>
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
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-primary text-sm">{currencySymbol}</b>
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
              <TwoOptionModal
                dialogOpen={showConfirmDeleteExpenseDialog}
                setDialogOpen={setShowConfirmDeleteExpenseDialog}
                dialogTitle={"Delete this expense?"}
                dialogDescription={"This decision is irreversible."}
                leftButtonText={"Cancel"}
                leftButtonFunction={() => setShowConfirmDeleteExpenseDialog(false)}
                rightButtonText={"Delete"}
                rightButtonFunction={() => {
                  setShowConfirmDeleteExpenseDialog(false);
                  deleteExpense({
                    expenseItemToDelete: {
                      expenseId: expenseId,
                      category: category,
                      amount: amount,
                      timestamp: timestamp,
                      recurringExpenseId: recurringExpenseId,
                    },
                    deletionScale: "THIS",
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
