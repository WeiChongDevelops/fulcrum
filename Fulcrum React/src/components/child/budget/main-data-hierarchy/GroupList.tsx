import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  ExpenseItemEntity,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  PublicUserData,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../util.ts";
import Group from "./Group.tsx";
import { Dispatch, SetStateAction } from "react";

interface GroupListProps {
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  expenseArray: ExpenseItemEntity[];

  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setModalFormVisibility: SetModalVisibility<BudgetModalVisibility>;

  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>;

  setGroupToDelete: Dispatch<SetStateAction<string>>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;

  perCategoryTotalExpenseArray: Map<string, number>;

  publicUserData: PublicUserData;
}

/**
 * Renders all budget category groups.
 */
export default function GroupList({
  budgetArray,
  groupArray,
  setGroupNameOfNewItem,
  expenseArray,
  setOldBudgetBeingEdited,
  setOldGroupBeingEdited,
  setBudgetFormVisibility,
  setGroupToDelete,
  setModalFormVisibility,
  setCategoryToDelete,
  perCategoryTotalExpenseArray,
  publicUserData,
}: GroupListProps) {
  return (
    <div className="flex flex-col items-center">
      {groupArray.map((groupDataItem: GroupItemEntity, key) => {
        const filteredBudgetArray = budgetArray.filter((budgetItem: BudgetItemEntity) => {
          return budgetItem.group === groupDataItem.group;
        });
        return (
          <Group
            groupName={groupDataItem.group}
            filteredBudgetArray={filteredBudgetArray}
            expenseArray={expenseArray}
            setOldBudgetBeingEdited={setOldBudgetBeingEdited}
            setOldGroupBeingEdited={setOldGroupBeingEdited}
            groupColour={groupDataItem.colour}
            setGroupNameOfNewItem={setGroupNameOfNewItem}
            setBudgetFormVisibility={setBudgetFormVisibility}
            setGroupToDelete={setGroupToDelete}
            setCategoryToDelete={setCategoryToDelete}
            setModalFormVisibility={setModalFormVisibility}
            perCategoryTotalExpenseArray={perCategoryTotalExpenseArray}
            publicUserData={publicUserData}
            key={key}
          />
        );
      })}
    </div>
  );
}
