import {
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SelectorOptionsFormattedData,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import {
  changeFormOrModalVisibility,
  DEFAULT_CATEGORY_GROUP,
  formatDollarAmountStatic,
  getCurrencySymbol,
} from "@/utility/util.ts";
import DynamicIconComponent from "@/components-v2/subcomponents/other/DynamicIconComponent.tsx";
import UpdateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/UpdateExpenseFormV2.tsx";
import UpdateRecurringInstanceFormV2 from "@/components-v2/subcomponents/expenses/forms/UpdateRecurringInstanceFormV2.tsx";

interface ExpenseItemV2Props {
  expenseId: string;
  category: string;
  amount: number;
  recurringExpenseId: string | null;
  timestamp: Date;
  iconPath: string;

  groupName: string;
  groupColour: string;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;
  oldExpenseBeingEdited: PreviousExpenseBeingEdited;

  publicUserData: PublicUserData;
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
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  oldExpenseBeingEdited,
  publicUserData,
  categoryOptions,
}: ExpenseItemV2Props) {
  function handleEditClick() {
    setOldExpenseBeingEdited({
      expenseId: expenseId,
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
    });
    if (recurringExpenseId === null) {
      changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateExpenseVisible", true);
    } else {
      changeFormOrModalVisibility(setExpenseFormVisibility, "isUpdateRecurringExpenseInstanceVisible", true);
    }
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setExpenseItemToDelete({
      expenseId: expenseId,
      category: category,
      amount: amount,
      timestamp: timestamp,
      recurringExpenseId: recurringExpenseId,
    });
    changeFormOrModalVisibility(setExpenseModalVisibility, "isConfirmExpenseDeletionModalVisible", true);
  }

  const isMiscellaneous = groupName === DEFAULT_CATEGORY_GROUP;
  const currencySymbol = getCurrencySymbol(publicUserData.currency);

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
        className="expense-item relative saturate-[275%] brightness-[98%]"
        style={{ backgroundColor: groupColour }}
        data-value={expenseId}
      >
        <div className="flex flex-row items-center">
          <div className="rounded-full bg-primary text-primary-foreground p-2">
            <DynamicIconComponent componentName={iconPath} props={{ size: 32 }} className={""} />
          </div>
          <div
            className="flex flex-col items-start ml-2"
            style={{
              color: isMiscellaneous ? "white" : "black",
            }}
          >
            <p className="font-bold text-[1.2rem] mb-[-2px]">{category}</p>
            <p className="text-sm font-medium">{groupName}</p>
          </div>
        </div>
        <div
          className="flex flex-row items-center"
          style={{
            color: isMiscellaneous ? "white" : "black",
          }}
        >
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
          <b className="text-xl mr-2">{formatDollarAmountStatic(amount, publicUserData.currency)}</b>
        </div>
      </div>
    </div>
  );
}
