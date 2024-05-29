import {
  DropdownSelectorOption,
  ExpenseFormVisibility,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  PreviousExpenseBeingEdited,
  PreviousRecurringExpenseBeingEdited,
  UserPreferences,
  RecurringExpenseFormVisibility,
  RecurringExpenseFrequency,
  RecurringExpenseModalVisibility,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  capitaliseFirstLetter,
  changeFormOrModalVisibility,
  darkenColor,
  DEFAULT_CATEGORY_GROUP,
  formatDate,
  formatDollarAmountStatic,
  getCurrencySymbol,
  getNextRecurringInstance,
} from "@/utility/util.ts";
import DynamicIconComponent from "@/components-v2/subcomponents/other/DynamicIconComponent.tsx";
import UpdateExpenseFormV2 from "@/components-v2/subcomponents/expenses/forms/UpdateExpenseFormV2.tsx";
import UpdateRecurringFormV2 from "@/components-v2/subcomponents/recurring/forms/UpdateRecurringFormV2.tsx";

interface RecurringItemV2Props {
  categoryOptions: DropdownSelectorOption[];
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
  oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
  setRecurringExpenseIdToDelete: Dispatch<SetStateAction<string>>;

  userPreferences: UserPreferences;
}

/**
 * A single interactive expense log.
 */
export default function RecurringItemV2({
  categoryOptions,
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
  oldRecurringExpenseBeingEdited,
  setRecurringExpenseIdToDelete,
  userPreferences,
}: RecurringItemV2Props) {
  function handleEditClick() {
    setOldRecurringExpenseBeingEdited({
      recurringExpenseId: recurringExpenseId,
      oldCategory: category,
      oldAmount: amount,
      oldTimestamp: timestamp,
      oldFrequency: frequency,
    });
    // changeFormOrModalVisibility(setRecurringExpenseFormVisibility, "isUpdateRecurringExpenseVisible", true);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setRecurringExpenseIdToDelete(recurringExpenseId);
    // changeFormOrModalVisibility(setRecurringExpenseModalVisibility, "isConfirmRecurringExpenseDeletionModalVisible", true);
  }

  const nextRecurringInstance = useMemo(() => {
    return getNextRecurringInstance(timestamp, frequency);
  }, [timestamp, frequency]);

  const isMiscellaneous = groupName === DEFAULT_CATEGORY_GROUP;

  return (
    <div className={"w-[95%] relative mx-auto"}>
      <UpdateRecurringFormV2
        recurringExpenseId={recurringExpenseId}
        category={category}
        amount={amount}
        timestamp={timestamp}
        frequency={frequency}
        currencySymbol={getCurrencySymbol(userPreferences.currency)}
        setOldRecurringExpenseBeingEdited={setOldRecurringExpenseBeingEdited}
        categoryOptions={categoryOptions}
        oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
      />
      <div
        className="expense-item relative saturate-[275%] dark:saturate-[350%]"
        style={{ backgroundColor: userPreferences.darkModeEnabled ? darkenColor(groupColour, 40) : groupColour }}
        data-value={recurringExpenseId}
      >
        <div className="flex flex-row items-center">
          <div className="rounded-full text-primary bg-background p-2">
            <DynamicIconComponent componentName={iconPath} props={{ size: 32 }} className={""} />
          </div>
          <div
            className="flex flex-col items-start ml-2"
            style={{
              color: isMiscellaneous ? "white" : "black",
            }}
          >
            <p className="font-bold text-lg 2xl:text-xl mb-[-2px]">{category}</p>
            <p className="text-xs 2xl:text-sm font-medium">{groupName}</p>
          </div>
        </div>
        <div
          className={"grid grid-cols-[1fr_2fr_1fr] place-items-center w-[50%]"}
          style={{
            color: isMiscellaneous ? "white" : "black",
          }}
        >
          <div className="flex flex-row mx-auto items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <p className={"text-base 2xl:text-lg ml-2 font-medium"}>{capitaliseFirstLetter(frequency)}</p>
          </div>

          <div className="text-xs xl:text-sm">
            <p className={"font-light"}>Next:</p>
            <p className={"font-bold"}>{nextRecurringInstance && formatDate(nextRecurringInstance)}</p>
          </div>
          <b className="text-lg 2xl:text-xl">{formatDollarAmountStatic(amount, userPreferences.currency)}</b>
          {/*<div className="flex flex-row items-center ml-2">*/}
          {/*  <button className="circle-button" onClick={handleEditClick}>*/}
          {/*    <img*/}
          {/*      src={`/static/assets-v2/UI-icons/edit-pencil-${isMiscellaneous ? "white" : "black"}-icon.svg`}*/}
          {/*      alt="Expense edit icon"*/}
          {/*      className="mx-1 w-6 h-6"*/}
          {/*    />*/}
          {/*  </button>*/}
          {/*  <button className="circle-button" onClick={handleDeleteClick}>*/}
          {/*    <img*/}
          {/*      src={`/static/assets-v2/UI-icons/delete-trash-${isMiscellaneous ? "white" : "black"}-icon.svg`}*/}
          {/*      alt="Expense delete icon"*/}
          {/*      className="mx-1 w-6 h-6"*/}
          {/*    />*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
