import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import CategorySelector from "@/components/child/selectors/CategorySelector.tsx";
import {
  capitaliseFirstLetter,
  getCurrencySymbol,
  handleInputChangeOnFormWithAmount,
  useNavMenuIsOpen,
} from "@/utility/util.ts";
import ExpenseDatePicker from "@/components/child/selectors/ExpenseDatePicker.tsx";
import FrequencySelector from "@/components/child/selectors/FrequencySelector.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import {
  BudgetItemEntity,
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  SelectorOptionsFormattedData,
  SetFormVisibility,
} from "@/utility/types.ts";
import useUpdateExpense from "@/hooks/mutations/expense/useUpdateExpense.ts";

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
    console.log({
      expenseId: expenseId,
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
    });
  };

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
            <Button className={"mt-1 self-end"}>Save Changes</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
