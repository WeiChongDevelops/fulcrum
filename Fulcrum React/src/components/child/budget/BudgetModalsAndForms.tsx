import BudgetCreationForm from "./forms/BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./forms/BudgetUpdatingForm.tsx";
import GroupCreationForm from "./forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./forms/GroupUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  getBudgetList,
  GroupItemEntity,
  handleBudgetDeletion,
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
  runGroupDeletionWithUserPreference: (keepContainedBudgets: boolean) => void;

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
  runGroupDeletionWithUserPreference,
  currencySymbol,
}: ModalsAndFormsProps) {
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
          title={`Would you like to keep the categories inside group '${groupToDelete}'?`}
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Moves Them to 'Miscellaneous')"
          optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
          optionTwoText="Delete Categories"
          optionTwoFunction={() => {
            setBudgetModalVisibility((current) => ({
              ...current,
              isDeleteOptionsModalVisible: false,
              isConfirmGroupDestructionModalVisible: true,
            }));
          }}
          isVisible="isDeleteOptionsModalVisible"
        />
      )}
      {budgetModalVisibility.isConfirmGroupDestructionModalVisible && (
        <TwoOptionModal
          title="Are you sure? This will delete all categories in the group, as well as their expense records."
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to Miscellaneous)"
          optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
          optionTwoText="Confirm"
          optionTwoFunction={() => runGroupDeletionWithUserPreference(false)}
          isVisible="isConfirmGroupDestructionModalVisible"
        />
      )}
      {budgetModalVisibility.isConfirmCategoryDestructionModalVisible && (
        <TwoOptionModal
          title="Are you sure? This will delete all expense entries for this budget category."
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Cancel"
          optionOneFunction={() => {
            setBudgetModalVisibility((current) => ({
              ...current,
              isConfirmCategoryDestructionModalVisible: false,
            }));
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            setBudgetModalVisibility((current) => ({
              ...current,
              isConfirmCategoryDestructionModalVisible: false,
            }));
            handleBudgetDeletion(categoryToDelete, setBudgetArray)
              .then(async (response) => {
                setBudgetArray(await getBudgetList());
                console.log("Deletion successful", response);
              })
              .catch((error) => console.log("Deletion unsuccessful", error));
          }}
          isVisible="isConfirmCategoryDestructionModalVisible"
        />
      )}
    </div>
  );
}
