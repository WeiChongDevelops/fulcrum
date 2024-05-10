import "/src/css/Budget.css";
import {
  capitaliseFirstLetter,
  changeFormOrModalVisibility,
  DEFAULT_CATEGORY_GROUP,
  formatDate,
  formatDollarAmountStatic,
  getNextRecurringInstance,
} from "../../../../utility/util.ts";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  PreviousRecurringExpenseBeingEdited,
  PublicUserData,
  RecurringExpenseFormVisibility,
  RecurringExpenseFrequency,
  RecurringExpenseModalVisibility,
} from "../../../../utility/types.ts";

interface RecurringExpenseItemProps {
  recurringExpenseId: string;
  category: string;
  amount: number;
  iconPath: string;
  timestamp: Date;
  frequency: RecurringExpenseFrequency;

  groupName: string;
  groupColour: string;

  setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
  setRecurringExpenseModalVisibility: Dispatch<SetStateAction<RecurringExpenseModalVisibility>>;

  setOldRecurringExpenseBeingEdited: Dispatch<SetStateAction<PreviousRecurringExpenseBeingEdited>>;
  setRecurringExpenseIdToDelete: Dispatch<SetStateAction<string>>;

  publicUserData: PublicUserData;
}

/**
 * A single interactive recurring expense entry.
 */
export default function RecurringExpenseItem({
  recurringExpenseId,
  category,
  amount,
  iconPath,
  timestamp,
  frequency,
  groupName,
  groupColour,
  setRecurringExpenseFormVisibility,
  setRecurringExpenseModalVisibility,
  setOldRecurringExpenseBeingEdited,
  setRecurringExpenseIdToDelete,
  publicUserData,
}: RecurringExpenseItemProps) {
  function handleEditClick() {
    setOldRecurringExpenseBeingEdited({
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
      oldFrequency: frequency,
    });
    changeFormOrModalVisibility(setRecurringExpenseFormVisibility, "isUpdateRecurringExpenseVisible", true);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setRecurringExpenseIdToDelete(recurringExpenseId);
    changeFormOrModalVisibility(setRecurringExpenseModalVisibility, "isConfirmRecurringExpenseDeletionModalVisible", true);
  }

  const nextRecurringInstance = useMemo(() => {
    return getNextRecurringInstance(timestamp, frequency);
  }, [timestamp, frequency]);

  const isMiscellaneous = groupName === DEFAULT_CATEGORY_GROUP;

  return (
    <div
      className="expense-item"
      style={{
        backgroundColor: groupColour,
        opacity: frequency === "never" ? "40%" : "100%",
      }}
      onClick={handleEditClick}
    >
      <div className="flex flex-row items-center">
        <div className="rounded-full bg-[#1b1c1c] p-3">
          <img src={`/static/assets-v2/category-icons/${iconPath}`} alt="Category icon" className="w-8 h-auto" />
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
        <div className="flex flex-row w-44 items-center">
          <img
            src={`/static/assets-v2/UI-icons/tools-recurring-icon-${isMiscellaneous ? "white" : "black"}.svg`}
            alt="Cycle icon"
            className={"w-8 h-8"}
          />
          <p className={"text-xl ml-3 mr-4 font-bold"}>{capitaliseFirstLetter(frequency)}</p>
        </div>

        <div className="font-extrabold mr-12">
          <p>Next:</p>
          <p>{nextRecurringInstance && formatDate(nextRecurringInstance)}</p>
        </div>

        <b className="text-xl">{formatDollarAmountStatic(amount, publicUserData.currency)}</b>
        <div className="flex flex-row items-center ml-2">
          <button className="circle-button" onClick={handleEditClick}>
            <img
              src={`/static/assets-v2/UI-icons/edit-pencil-${isMiscellaneous ? "white" : "black"}-icon.svg`}
              alt="Recurring edit icon"
              className="mx-1 w-6 h-6"
            />
          </button>
          <button className="circle-button" onClick={handleDeleteClick}>
            <img
              src={`/static/assets-v2/UI-icons/delete-trash-${isMiscellaneous ? "white" : "black"}-icon.svg`}
              alt="Recurring delete icon"
              className="mx-1 w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
