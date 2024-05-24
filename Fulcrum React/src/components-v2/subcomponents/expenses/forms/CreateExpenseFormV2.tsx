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
import {
  capitaliseFirstLetter,
  DEFAULT_CATEGORY_GROUP,
  DEFAULT_CATEGORY_ICON,
  getCurrencySymbol,
  handleInputChangeOnFormWithAmount,
} from "@/utility/util.ts";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseCreationFormData,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  PublicUserData,
  RecurringExpenseFormVisibility,
  RecurringExpenseItemEntity,
  SelectorOptionsFormattedData,
  SetFormVisibility,
  Value,
} from "@/utility/types.ts";
import { v4 as uuid } from "uuid";
import useCreateExpense from "@/hooks/mutations/expense/useCreateExpense.ts";
import useCreateRecurringExpense from "@/hooks/mutations/recurring-expense/useCreateRecurringExpense.ts";
import CategorySelector from "@/components/child/selectors/CategorySelector.tsx";
import FrequencySelector from "@/components/child/selectors/FrequencySelector.tsx";
import ExpenseDatePicker from "@/components/child/selectors/ExpenseDatePicker.tsx";

interface CreateExpenseFormV2Props {
  categoryDataMap: CategoryToIconGroupAndColourMap;
  budgetArray: BudgetItemEntity[];
  defaultCalendarDate: Date;
  mustBeRecurring: boolean;
  publicUserData: PublicUserData;
}

export default function CreateExpenseFormV2({
  categoryDataMap,
  budgetArray,
  defaultCalendarDate,
  mustBeRecurring,
  publicUserData,
}: CreateExpenseFormV2Props) {
  const [formIsOpen, setFormIsOpen] = useState(false);

  const { mutate: createExpense } = useCreateExpense();
  const { mutate: createRecurringExpense } = useCreateRecurringExpense();
  const [formData, setFormData] = useState<ExpenseCreationFormData>({
    category: "Other",
    amount: 0,
    timestamp: defaultCalendarDate,
    frequency: mustBeRecurring ? "monthly" : "never",
  });

  const hideForm = () => {
    setFormIsOpen(false);
  };

  useEffect(() => {
    setFormData({
      category: "Other",
      amount: 0,
      timestamp: defaultCalendarDate,
      frequency: mustBeRecurring ? "monthly" : "never",
    });
  }, [formIsOpen]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: "Other",
      amount: 0,
      timestamp: defaultCalendarDate,
      frequency: mustBeRecurring ? "monthly" : "never",
    });
    let newDefaultBudgetItem: BudgetItemEntity | undefined = undefined;

    const newExpenseItem: ExpenseItemEntity = {
      expenseId: uuid(),
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      timestamp: formData.timestamp as Date,
      recurringExpenseId: null,
    };

    if (!budgetArray.map((budgetItem) => budgetItem.category).includes(newExpenseItem.category)) {
      newDefaultBudgetItem = {
        category: formData.category,
        amount: 0,
        iconPath: DEFAULT_CATEGORY_ICON,
        group: DEFAULT_CATEGORY_GROUP,
        timestamp: formData.timestamp as Date,
      };
    }

    if (formData.frequency === "never") {
      createExpense({
        newExpenseItem: newExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    } else {
      const newRecurringExpenseItem: RecurringExpenseItemEntity = {
        recurringExpenseId: uuid(),
        category: formData.category,
        amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
        timestamp: formData.timestamp as Date,
        frequency: formData.frequency,
      };
      createRecurringExpense({
        newRecurringExpenseItem: newRecurringExpenseItem,
        newBudgetItem: newDefaultBudgetItem,
      });
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function onDateInputChange(newValue: Value) {
    setFormData((prevFormData) => ({ ...prevFormData, timestamp: newValue }));
  }

  const categoryOptions = budgetArray.map((budgetItem) => {
    const dataMapEntry = categoryDataMap.get(budgetItem.category);
    return {
      value: budgetItem.category,
      label: capitaliseFirstLetter(budgetItem.category),
      colour: !!dataMapEntry && !!dataMapEntry.colour ? dataMapEntry.colour : "black",
    };
  });

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger className={"w-full"}>
        <Button
          asChild
          variant={"empty"}
          className={`w-[95%] h-16 mb-2 border-2 border-dashed border-black rounded-2xl hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-300 ease-out text-2xl font-bold ${publicUserData.darkModeEnabled && "create-expense-button-dark"}`}
        >
          <p>+</p>
        </Button>
      </SheetTrigger>
      <SheetOverlay>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Expense Entry</SheetTitle>
            <SheetDescription>
              Log your latest expense and get notified if you create an expense that exceeds your budget.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="category" className={"text-right"}>
                Category
              </Label>
              <CategorySelector categoryOptions={categoryOptions} setFormData={setFormData} className={"col-span-3"} />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5 relative"}>
              <Label htmlFor="amount" className={"text-right"}>
                Amount
              </Label>
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-black text-sm">
                {getCurrencySymbol(publicUserData.currency)}
              </b>
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
              <ExpenseDatePicker setFormData={setFormData} className={"col-span-3"} />
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label className={"text-right"}>Repeat</Label>
              <FrequencySelector setFormData={setFormData} className={"col-span-3"} mustBeRecurring={mustBeRecurring} />
            </div>

            <Button className={"mt-2 self-end"}>Add Expense</Button>
          </form>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  );
}
