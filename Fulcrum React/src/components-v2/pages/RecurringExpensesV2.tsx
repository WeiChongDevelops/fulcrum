import { BudgetItemEntity, CategoryToIconAndColourMap, RecurringExpenseItemEntity } from "@/utility/types.ts";
import { capitaliseFirstLetter, useEmail } from "@/utility/util.ts";
import useInitialRecurringExpenseData from "@/hooks/queries/useInitialRecurringExpenseData.ts";
import RecurringExpensesHeaderV2 from "@/components-v2/subcomponents/recurring/RecurringHeaderV2.tsx";
import { ScrollArea } from "@/components-v2/ui/scroll-area.tsx";
import RecurringItemV2 from "@/components-v2/subcomponents/recurring/RecurringItemV2.tsx";
import CreateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/CreateExpenseFormV2.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface RecurringExpensesV2Props {
  perCategoryExpenseTotalThisMonth: Map<string, number>;
}

/**
 * The root component for the recurring expense page.
 */
export default function RecurringExpensesV2({ perCategoryExpenseTotalThisMonth }: RecurringExpensesV2Props) {
  const recurringExpenseArray: RecurringExpenseItemEntity[] = useQueryClient().getQueryData([
    "recurringExpenseArray",
    useEmail(),
  ])!;
  const budgetArray: BudgetItemEntity[] = useQueryClient().getQueryData(["budgetArray", useEmail()])!;
  const categoryToIconAndColourMap: CategoryToIconAndColourMap = useQueryClient().getQueryData([
    "categoryToIconAndColourMap",
    useEmail(),
  ])!;

  const { oldRecurringExpenseBeingEdited, setOldRecurringExpenseBeingEdited } = useInitialRecurringExpenseData();

  const categoryOptions = budgetArray.map((budgetItem) => {
    const dataMapEntry = categoryToIconAndColourMap.get(budgetItem.category);
    return {
      value: budgetItem.category,
      label: capitaliseFirstLetter(budgetItem.category),
      colour: !!dataMapEntry && !!dataMapEntry.colour ? dataMapEntry.colour : "black",
    };
  });

  return (
    <div className={"flex flex-col justify-start items-center h-screen"}>
      <RecurringExpensesHeaderV2 />
      <ScrollArea className={"w-full h-[94vh] pt-8"}>
        <CreateExpenseFormV2
          defaultCalendarDate={new Date()}
          mustBeRecurring={true}
          perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
        />
        <div className={"mt-6 w-full"}>
          {recurringExpenseArray.length > 0 ? (
            recurringExpenseArray.map((recurringExpenseItem, key) => {
              const groupName = budgetArray.find(
                (budgetItem) => budgetItem.category === recurringExpenseItem.category,
              )!.group;
              return (
                <RecurringItemV2
                  categoryOptions={categoryOptions}
                  recurringExpenseId={recurringExpenseItem.recurringExpenseId}
                  category={recurringExpenseItem.category}
                  amount={recurringExpenseItem.amount}
                  iconPath={categoryToIconAndColourMap.get(recurringExpenseItem.category)!.iconPath}
                  timestamp={recurringExpenseItem.timestamp}
                  frequency={recurringExpenseItem.frequency}
                  groupName={groupName}
                  groupColour={categoryToIconAndColourMap.get(recurringExpenseItem.category)!.colour}
                  setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
                  oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
                  key={key}
                />
              );
            })
          ) : (
            <p className={"text-lg mt-48"}>Add recurring expenses for transactions you expect to arise regularly.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
