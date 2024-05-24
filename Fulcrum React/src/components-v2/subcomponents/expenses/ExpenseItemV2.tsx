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
      <div className="expense-item relative" style={{ backgroundColor: groupColour }} data-value={expenseId}>
        <div className="flex flex-row items-center">
          <div className="rounded-full bg-primary text-primary-foreground p-3">
            <DynamicIconComponent componentName={iconPath} props={{ size: 26 }} className={""} />
          </div>
          <div
            className="flex flex-col items-start ml-2"
            style={{
              color: isMiscellaneous ? "white" : "black",
            }}
          >
            <p className="font-bold text-xl mb-[-2px]">{category}</p>
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
            <img
              src={`/static/assets-v2/UI-icons/tools-recurring-icon-${isMiscellaneous ? "white" : "black"}.svg`}
              alt="Cycle icon"
              className={"w-8 h-8 mr-6"}
            />
          )}
          <b className="text-xl">{formatDollarAmountStatic(amount, publicUserData.currency)}</b>
          <div className="flex flex-row items-center ml-2">
            <button className="circle-button" onClick={handleEditClick}>
              <img
                src={`/static/assets-v2/UI-icons/edit-pencil-${isMiscellaneous ? "white" : "black"}-icon.svg`}
                alt="Expense edit icon"
                className="mx-1 w-6 h-6"
              />
            </button>
            <button className="circle-button" onClick={handleDeleteClick}>
              <img
                src={`/static/assets-v2/UI-icons/delete-trash-${isMiscellaneous ? "white" : "black"}-icon.svg`}
                alt="Expense delete icon"
                className="mx-1 w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
