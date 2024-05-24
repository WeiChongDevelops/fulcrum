import { handleInputChangeOnFormWithAmount, useNavMenuIsOpen } from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import CategorySelector from "@/components/child/selectors/CategorySelector.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import ExpenseDatePicker from "@/components/child/selectors/ExpenseDatePicker.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import {
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  SelectorOptionsFormattedData,
  SetFormVisibility,
} from "@/utility/types.ts";
import useUpdateExpense from "@/hooks/mutations/expense/useUpdateExpense.ts";
import { toast } from "sonner";
import * as React from "react";

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

  const navMenuIsOpen = useNavMenuIsOpen();

  return (
    <div
      className={"h-20 inset-0 absolute update-expense-trigger z-10"}
      style={{ width: `calc(100vw - ${navMenuIsOpen ? "14rem" : "5rem"} - 4rem)` }}
    >
      <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
        <SheetTrigger onClick={updateOldExpenseBeingEdited} className={"w-full h-full"}></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Updating Expense Repeat</SheetTitle>
            <SheetDescription>
              <span>Editing this particular repeat of your recurring expense.</span>
              <span className={"mt-3 block"}>
                To manage your recurring expenses, please see the <b>'Recurring'</b> section.
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
                value={formData.amount === 0 ? "" : formData.amount.toFixed(2)}
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
              <Button
                className={"col-start-3 col-span-3"}
                variant={"destructive"}
                onClick={() => toast.warning("Uh oh.")}
                type={"button"}
              >
                Delete
              </Button>
              <Button className={"col-start-6 col-span-3"}>Save Changes</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
