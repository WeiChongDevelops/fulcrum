import BudgetCreationForm from "./forms/BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./forms/BudgetUpdatingForm.tsx";
import GroupCreationForm from "./forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./forms/GroupUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  changeFormOrModalVisibility,
  getBudgetList,
  GroupItemEntity,
  handleBudgetDeletion,
  handleGroupDeletion,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../util.ts";

import { Dispatch, SetStateAction } from "react";

interface ModalsAndFormsProps {
  budgetFormVisibility: BudgetFormVisibility;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;

  budgetModalVisibility: BudgetModalVisibility;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;

  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  groupToDelete: string;
  categoryToDelete: string;

  currencySymbol: string;
}

/**
 * The modals and forms for the budget page.
 */
export default function BudgetModalsAndForms({
  budgetFormVisibility,
  setBudgetArray,
  groupArray,
  groupNameOfNewItem,
  setBudgetFormVisibility,
  budgetModalVisibility,
  setBudgetModalVisibility,
  oldBudgetBeingEdited,
  setGroupArray,
  oldGroupBeingEdited,
  groupToDelete,
  categoryToDelete,
  currencySymbol,
}: ModalsAndFormsProps) {
  function runGroupDeletionWithUserPreference(keepContainedBudgets: boolean) {
    changeFormOrModalVisibility(setBudgetModalVisibility, "isDeleteOptionsModalVisible", false);
    changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", false);
    handleGroupDeletion(groupToDelete, setGroupArray, keepContainedBudgets)
      .then(async () => {
        setBudgetArray(await getBudgetList());
        console.log("Deletion successful");
      })
      .catch((error) => console.log("Deletion unsuccessful", error));
  }

  return (
    <div className={"z-40"}>
      {budgetFormVisibility.isCreateBudgetVisible && (
        <BudgetCreationForm
          setBudgetArray={setBudgetArray}
          groupArray={groupArray}
          groupNameOfNewItem={groupNameOfNewItem}
          setBudgetFormVisibility={setBudgetFormVisibility}
          currencySymbol={currencySymbol}
        />
      )}
      {budgetFormVisibility.isUpdateBudgetVisible && (
        <BudgetUpdatingForm
          setBudgetArray={setBudgetArray}
          oldBudgetBeingEdited={oldBudgetBeingEdited}
          groupArray={groupArray}
          setBudgetFormVisibility={setBudgetFormVisibility}
          currencySymbol={currencySymbol}
        />
      )}
      {budgetFormVisibility.isCreateGroupVisible && (
        <GroupCreationForm setGroupArray={setGroupArray} setBudgetFormVisibility={setBudgetFormVisibility} />
      )}
      {budgetFormVisibility.isUpdateGroupVisible && (
        <GroupUpdatingForm
          oldGroupBeingEdited={oldGroupBeingEdited}
          setBudgetArray={setBudgetArray}
          groupArray={groupArray}
          setGroupArray={setGroupArray}
          setBudgetFormVisibility={setBudgetFormVisibility}
        />
      )}
      {budgetModalVisibility.isDeleteOptionsModalVisible && (
        <TwoOptionModal
          title={`Would you like to keep the categories inside the group '${groupToDelete}'?`}
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to 'Miscellaneous')"
          optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
          optionTwoText="Delete Categories"
          optionTwoFunction={() => {
            changeFormOrModalVisibility(setBudgetModalVisibility, "isDeleteOptionsModalVisible", false);
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", true);
          }}
          isVisible="isDeleteOptionsModalVisible"
        />
      )}
      {budgetModalVisibility.isConfirmGroupDeletionModalVisible && (
        <TwoOptionModal
          title="Are you sure? This will delete all categories in the group, as well as their expense records."
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to 'Miscellaneous')"
          optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
          optionTwoText="Confirm"
          optionTwoFunction={() => runGroupDeletionWithUserPreference(false)}
          isVisible="isConfirmGroupDeletionModalVisible"
        />
      )}
      {budgetModalVisibility.isConfirmCategoryDeletionModalVisible && (
        <TwoOptionModal
          title="Are you sure? This will delete all expense entries for this budget category."
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Cancel"
          optionOneFunction={() => {
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmCategoryDeletionModalVisible", false);
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmCategoryDeletionModalVisible", false);
            handleBudgetDeletion(categoryToDelete, setBudgetArray)
              .then(async (response) => {
                setBudgetArray(await getBudgetList());
                console.log("Deletion successful", response);
              })
              .catch((error) => console.log("Deletion unsuccessful", error));
          }}
          isVisible="isConfirmCategoryDeletionModalVisible"
        />
      )}
    </div>
  );
}
