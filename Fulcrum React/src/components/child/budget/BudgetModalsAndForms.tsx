import BudgetCreationForm from "./forms/BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./forms/BudgetUpdatingForm.tsx";
import GroupCreationForm from "./forms/GroupCreationForm.tsx";
import GroupUpdatingForm from "./forms/GroupUpdatingForm.tsx";
import TwoOptionModal from "../modals/TwoOptionModal.tsx";
import { changeFormOrModalVisibility, getHighestGroupSortIndex } from "@/utility/util.ts";
import useDeleteGroup from "../../../hooks/mutations/budget/useDeleteGroup.ts";
import useDeleteBudget from "../../../hooks/mutations/budget/useDeleteBudget.ts";
import Loader from "../other/Loader.tsx";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  SetFormVisibility,
  SetModalVisibility,
} from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";

interface ModalsAndFormsProps {
  budgetFormVisibility: BudgetFormVisibility;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;

  budgetModalVisibility: BudgetModalVisibility;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;

  // budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  groupToDelete: string;
  categoryToDelete: string;
  currencySymbol: string;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
}

/**
 * The modals and forms for the budget page.
 */
export default function BudgetModalsAndForms({
  budgetFormVisibility,
  // budgetArray,
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
  setLocalisedGroupArray,
}: ModalsAndFormsProps) {
  const { isPending, mutate: deleteGroup } = useDeleteGroup();
  const { mutate: deleteBudget } = useDeleteBudget();

  return (
    <div className={"z-40"}>
      <Loader isLoading={isPending} isDarkMode={true} positioning={"fixed bottom-[50vh] left-[50vw] z-[100]"} />
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
          setBudgetModalVisibility={setBudgetModalVisibility}
          currencySymbol={currencySymbol}
        />
      )}
      {budgetFormVisibility.isCreateGroupVisible && (
        <GroupCreationForm
          setBudgetFormVisibility={setBudgetFormVisibility}
          highestSortIndex={getHighestGroupSortIndex(groupArray)}
        />
      )}
      {budgetFormVisibility.isUpdateGroupVisible && (
        <GroupUpdatingForm
          oldGroupBeingEdited={oldGroupBeingEdited}
          setBudgetFormVisibility={setBudgetFormVisibility}
          setLocalisedGroupArray={setLocalisedGroupArray}
        />
      )}
      {budgetModalVisibility.isDeleteOptionsModalVisible && (
        <TwoOptionModal
          title={`Would you like to keep the categories inside the group '${groupToDelete}'?`}
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to 'Miscellaneous')"
          optionOneFunction={() => {
            setLocalisedGroupArray((prevLocalisedGroupArray) =>
              prevLocalisedGroupArray.filter((groupItem) => groupItem.group !== groupToDelete),
            );
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
          title={`Are you sure? This will delete all categories in '${groupToDelete}', as well as their expense records.`}
          setModalVisibility={setBudgetModalVisibility}
          optionOneText="Keep Categories (Move to 'Miscellaneous')"
          optionOneFunction={() => {
            setLocalisedGroupArray((prevLocalisedGroupArray) =>
              prevLocalisedGroupArray.filter((groupItem) => groupItem.group !== groupToDelete),
            );
            deleteGroup({
              groupToDelete: groupToDelete,
              keepContainedCategories: true,
            });
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", false);
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            setLocalisedGroupArray((prevLocalisedGroupArray) =>
              prevLocalisedGroupArray.filter((groupItem) => groupItem.group !== groupToDelete),
            );
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
      {/*{budgetModalVisibility.isDataVisVisible && (*/}
      {/*  <BudgetVis budgetArray={budgetArray} setBudgetModalVisibility={setBudgetModalVisibility} />*/}
      {/*)}*/}
    </div>
  );
}
