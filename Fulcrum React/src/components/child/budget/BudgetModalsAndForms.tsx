import BudgetCreationForm from "./forms/BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./forms/BudgetUpdatingForm.tsx";
import GroupCreationForm from "./forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./forms/GroupUpdatingForm.tsx";
import TwoOptionModal from "../other/TwoOptionModal.tsx";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  changeFormOrModalVisibility,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../util.ts";
import useDeleteGroup from "../../../hooks/mutations/budget/useDeleteGroup.ts";
import useDeleteBudget from "../../../hooks/mutations/budget/useDeleteBudget.ts";

interface ModalsAndFormsProps {
  budgetFormVisibility: BudgetFormVisibility;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;

  budgetModalVisibility: BudgetModalVisibility;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;

  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
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
  groupArray,
  groupNameOfNewItem,
  setBudgetFormVisibility,
  budgetModalVisibility,
  setBudgetModalVisibility,
  oldBudgetBeingEdited,
  oldGroupBeingEdited,
  groupToDelete,
  categoryToDelete,
  currencySymbol,
}: ModalsAndFormsProps) {
  const { mutate: deleteGroup } = useDeleteGroup();
  const { mutate: deleteBudget } = useDeleteBudget();

  return (
    <div className={"z-40"}>
      {budgetFormVisibility.isCreateBudgetVisible && (
        <BudgetCreationForm
          groupArray={groupArray}
          groupNameOfNewItem={groupNameOfNewItem}
          setBudgetFormVisibility={setBudgetFormVisibility}
          currencySymbol={currencySymbol}
        />
      )}
      {budgetFormVisibility.isUpdateBudgetVisible && (
        <BudgetUpdatingForm
          oldBudgetBeingEdited={oldBudgetBeingEdited}
          groupArray={groupArray}
          setBudgetFormVisibility={setBudgetFormVisibility}
          currencySymbol={currencySymbol}
        />
      )}
      {budgetFormVisibility.isCreateGroupVisible && <GroupCreationForm setBudgetFormVisibility={setBudgetFormVisibility} />}
      {budgetFormVisibility.isUpdateGroupVisible && (
        <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited} setBudgetFormVisibility={setBudgetFormVisibility} />
      )}
      {budgetModalVisibility.isDeleteOptionsModalVisible && (
        <TwoOptionModal
          title={`Would you like to keep the categories inside the group '${groupToDelete}'?`}
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to 'Miscellaneous')"
          optionOneFunction={() => {
            deleteGroup({
              groupToDelete: groupToDelete,
              keepContainedCategories: true,
            });
            changeFormOrModalVisibility(setBudgetModalVisibility, "isDeleteOptionsModalVisible", false);
          }}
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
          optionOneFunction={() => {
            deleteGroup({
              groupToDelete: groupToDelete,
              keepContainedCategories: true,
            });
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", false);
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            deleteGroup({
              groupToDelete: groupToDelete,
              keepContainedCategories: false,
            });
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", false);
          }}
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
            deleteBudget(categoryToDelete);
          }}
          isVisible="isConfirmCategoryDeletionModalVisible"
        />
      )}
    </div>
  );
}
