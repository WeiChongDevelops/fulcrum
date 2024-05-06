import {
  changeFormOrModalVisibility,
  DEFAULT_CATEGORY_GROUP,
  dynamicallySizeBudgetNameDisplays,
  formatDollarAmountStatic,
  getGroupBudgetTotal,
  getGroupExpenditureTotal,
  LocationContext,
  monthStringArray,
} from "../../../../utility/util.ts";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "../buttons/AddNewBudgetToGroupButton.tsx";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  ExpenseItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";
import useDeleteGroup from "../../../../hooks/mutations/budget/useDeleteGroup.ts";

interface GroupProps {
  groupName: string;
  groupColour: string;

  filteredBudgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setModalFormVisibility: SetModalVisibility<BudgetModalVisibility>;

  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>;

  setGroupToDelete: Dispatch<SetStateAction<string>>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  publicUserData: PublicUserData;
}

/**
 * Displays the budget tiles for a given group and a button to add another tile to the group.
 */
export default function Group({
  groupName,
  filteredBudgetArray,
  groupColour,
  expenseArray,
  setGroupNameOfNewItem,
  setOldBudgetBeingEdited,
  setOldGroupBeingEdited,
  setBudgetFormVisibility,
  setGroupToDelete,
  setCategoryToDelete,
  setModalFormVisibility,
  perCategoryExpenseTotalThisMonth,
  publicUserData,
}: GroupProps) {
  const routerLocation = useContext(LocationContext);

  const { mutate: deleteGroup } = useDeleteGroup();

  const [groupBudgetTotal, setGroupBudgetTotal] = useState(getGroupBudgetTotal(filteredBudgetArray));
  const [groupExpenditureTotal, setGroupExpenditureTotal] = useState(
    getGroupExpenditureTotal(expenseArray, filteredBudgetArray),
  );

  function handleEditClick() {
    setOldGroupBeingEdited({ oldGroupName: groupName, oldColour: groupColour });
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", true);
  }
  function handleDeleteClick() {
    setGroupToDelete(groupName);
    if (filteredBudgetArray.length > 0) {
      changeFormOrModalVisibility(setModalFormVisibility, "isDeleteOptionsModalVisible", true);
    } else {
      deleteGroup({
        groupToDelete: groupName,
        keepContainedCategories: false,
      });
    }
  }

  useEffect(() => {
    dynamicallySizeBudgetNameDisplays();
    setGroupBudgetTotal(getGroupBudgetTotal(filteredBudgetArray));
    setGroupExpenditureTotal(getGroupExpenditureTotal(expenseArray, filteredBudgetArray));
  }, [filteredBudgetArray, expenseArray, routerLocation]);

  const currency = publicUserData.currency;
  const isMiscellaneous = groupName === DEFAULT_CATEGORY_GROUP;
  const currentMonth = monthStringArray[new Date().getMonth()];

  return (
    <div
      className="group flex flex-col w-[96vw] rounded-xl p-2 mb-5"
      style={{
        backgroundColor: groupColour,
        filter: publicUserData.darkModeEnabled ? "brightness(83%) contrast(113%)" : "brightness(100%)",
      }}
    >
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="flex flex-row ml-4 mt-1">
          <p className={`mt - 2 text-3xl font-bold ${isMiscellaneous ? "text-white" : "text-black"}`}>{groupName}</p>
          {!isMiscellaneous && (
            <div className="flex flex-row justify-center items-center ml-2 relative top-0.5">
              <div className="circle-button" onClick={handleEditClick}>
                <img src="/static/assets/UI-icons/edit-pencil-black-icon.svg" alt="Group edit icon" className="w-5 h-5" />
              </div>
              <div className="circle-button" onClick={handleDeleteClick}>
                <img src="/static/assets/UI-icons/delete-trash-black-icon.svg" alt="Group delete icon" className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
        <p className={`${isMiscellaneous ? "text-white" : "text-black"} font-bold mr-4 text-3xl`}>
          Spent: {formatDollarAmountStatic(groupExpenditureTotal, currency)} of{" "}
          {formatDollarAmountStatic(groupBudgetTotal, currency)} ({currentMonth})
        </p>
      </div>
      <div className="flex flex-row flex-wrap flex-shrink-0 basis-0 justify-start">
        {filteredBudgetArray.length > 0 &&
          filteredBudgetArray.map((budgetElement, key) => (
            <BudgetTile
              category={budgetElement.category}
              amount={budgetElement.amount}
              group={groupName}
              icon={budgetElement.iconPath}
              setOldBudgetBeingEdited={setOldBudgetBeingEdited}
              setBudgetFormVisibility={setBudgetFormVisibility}
              setModalFormVisibility={setModalFormVisibility}
              setCategoryToDelete={setCategoryToDelete}
              perCategoryExpenseTotalThisMonth={perCategoryExpenseTotalThisMonth}
              publicUserData={publicUserData}
              key={key}
            />
          ))}
        <AddNewBudgetToGroupButton
          setBudgetFormVisibility={setBudgetFormVisibility}
          setGroupNameOfNewItem={setGroupNameOfNewItem}
          groupNameOfNewItem={groupName}
        />
      </div>
    </div>
  );
}
