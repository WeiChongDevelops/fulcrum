import "/src/css/Budget.css";
import {
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  formatDollarAmountStatic,
  PreviousExpenseBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../util.ts";
import { Dispatch, SetStateAction } from "react";

interface ExpenseItemProps {
  expenseId: string;
  category: string;
  amount: number;
  iconPath: string;
  timestamp: Date;

  recurringExpenseId: string | null;

  groupName: string;
  groupColour: string;

  setExpenseFormVisibility: SetFormVisibility<ExpenseFormVisibility>;
  setExpenseModalVisibility: SetModalVisibility<ExpenseModalVisibility>;

  setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
  setExpenseItemToDelete: Dispatch<SetStateAction<ExpenseItemEntity>>;

  publicUserData: PublicUserData;
}

/**
 * A single interactive expense log.
 */
export default function ExpenseItem({
  expenseId,
  category,
  amount,
  iconPath,
  timestamp,
  recurringExpenseId,
  groupName,
  groupColour,
  setExpenseFormVisibility,
  setExpenseModalVisibility,
  setOldExpenseBeingEdited,
  setExpenseItemToDelete,
  publicUserData,
}: ExpenseItemProps) {
  function handleEditClick() {
    setOldExpenseBeingEdited({
      expenseId: expenseId,
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
    });
    if (recurringExpenseId === null) {
      setExpenseFormVisibility((current) => ({
        ...current,
        isUpdateExpenseVisible: true,
      }));
    } else {
      setExpenseFormVisibility((current) => ({
        ...current,
        isUpdateRecurringExpenseInstanceVisible: true,
      }));
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
    setExpenseModalVisibility((current) => ({
      ...current,
      isConfirmExpenseDeletionModalVisible: true,
    }));
  }

  return (
    <div className="expense-item" style={{ backgroundColor: groupColour }} onClick={handleEditClick} data-value={expenseId}>
      <div className="flex flex-row items-center">
        <div className="rounded-full bg-[#1b1c1c] p-3">
          <img src={`/src/assets/category-icons/${iconPath}`} alt="Category icon" className="w-8 h-auto" />
        </div>
        <div
          className="flex flex-col items-start ml-2"
          style={{
            color: groupName === "Miscellaneous" ? "white" : "black",
          }}
        >
          <p className="font-bold text-xl mb-[-2px]">{category}</p>
          <p className="text-sm font-medium">{groupName}</p>
        </div>
      </div>
      <div
        className="flex flex-row items-center"
        style={{
          color: groupName === "Miscellaneous" ? "white" : "black",
        }}
      >
        {recurringExpenseId && (
          <img
            src={`/src/assets/UI-icons/tools-recurring-icon-${groupName === "Miscellaneous" ? "white" : "black"}.svg`}
            alt="Cycle icon"
            className={"w-8 h-8 mr-6"}
          />
        )}
        <b className="text-xl">{formatDollarAmountStatic(amount, publicUserData.currency)}</b>
        <div className="flex flex-row items-center ml-2">
          <button className="circle-button" onClick={handleEditClick}>
            <img
              src={`/src/assets/UI-icons/edit-pencil-${groupName === "Miscellaneous" ? "white" : "black"}-icon.svg`}
              alt="Edit icon"
              className="mx-1 w-6 h-6"
            />
          </button>
          <button className="circle-button" onClick={handleDeleteClick}>
            <img
              src={`/src/assets/UI-icons/delete-trash-${groupName === "Miscellaneous" ? "white" : "black"}-icon.svg`}
              alt="Delete icon"
              className="mx-1 w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
