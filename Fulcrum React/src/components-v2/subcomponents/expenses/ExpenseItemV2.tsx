import { DropdownSelectorOption, PreviousExpenseBeingEdited, UserPreferences } from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { darkenColor, formatDollarAmountStatic, getCurrencySymbol, useEmail } from "@/utility/util.ts";
import DynamicIconComponent from "@/components-v2/subcomponents/other/DynamicIconComponent.tsx";
import UpdateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/UpdateExpenseFormV2.tsx";
import UpdateRecurringInstanceFormV2 from "@/components-v2/subcomponents/expenses/forms/UpdateRecurringInstanceFormV2.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseItemV2Props {
  expenseId: string;
  category: string;
  amount: number;
  recurringExpenseId: string | null;
  timestamp: Date;
  iconPath: string;

  groupName: string;
  groupColour: string;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;

  categoryOptions: DropdownSelectorOption[];
}

/**
 * A single interactive expense log.
 */
export default function ExpenseItemV2({
  expenseId,
  recurringExpenseId,
  category,
  amount,
  timestamp,
  iconPath,
  groupName,
  groupColour,
  setOldExpenseBeingEdited,
  oldExpenseBeingEdited,
  categoryOptions,
}: ExpenseItemV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const currencySymbol = getCurrencySymbol(userPreferences.currency);

  return (
    <div className={"relative"}>
      {!!recurringExpenseId ? (
        <UpdateRecurringInstanceFormV2
          categoryOptions={categoryOptions}
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          currencySymbol={currencySymbol}
          setOldExpenseBeingEdited={setOldExpenseBeingEdited}
          expenseId={expenseId}
          recurringExpenseId={recurringExpenseId}
          category={category}
          amount={amount}
          timestamp={timestamp}
        />
      ) : (
        <UpdateExpenseFormV2
          oldExpenseBeingEdited={oldExpenseBeingEdited}
          setOldExpenseBeingEdited={setOldExpenseBeingEdited}
          categoryOptions={categoryOptions}
          expenseId={expenseId}
          recurringExpenseId={recurringExpenseId}
          category={category}
          amount={amount}
          timestamp={timestamp}
          currencySymbol={currencySymbol}
        />
      )}
      <div
        className="expense-item relative saturate-[275%] dark:saturate-[350%]"
        style={{
          backgroundColor: userPreferences.darkModeEnabled ? darkenColor(groupColour, 40) : darkenColor(groupColour, 5),
        }}
        data-value={expenseId}
      >
        <div className="flex flex-row items-center">
          <div className="rounded-full text-primary bg-background p-2 mr-1">
            <DynamicIconComponent componentName={iconPath} props={{ size: "2rem" }} className={""} />
          </div>
          <div className="flex flex-col items-start ml-2">
            <p className="font-bold text-lg 2xl:text-xl mb-[-2px]">{category}</p>
            <p className="text-xs 2xl:text-sm font-medium">{groupName}</p>
          </div>
        </div>
        <div className="flex flex-row items-center">
          {recurringExpenseId && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 mx-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          )}
          <b className="text-lg 2xl:text-xl mr-2">{formatDollarAmountStatic(amount, userPreferences.currency)}</b>
        </div>
      </div>
    </div>
  );
}
