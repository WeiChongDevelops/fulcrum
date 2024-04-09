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
  EmailContext,
  GroupItemEntity,
  handleBudgetDeletion,
  handleGroupDeletion,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../util.ts";

import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const email = useContext(EmailContext);

  interface GroupDeletionProps {
    groupToDelete: string;
    keepContainedCategories: boolean;
  }

  const groupDeletionMutation = useMutation({
    mutationFn: (groupDeletionProps: GroupDeletionProps) => {
      return handleGroupDeletion(groupDeletionProps.groupToDelete, groupDeletionProps.keepContainedCategories);
    },
    onMutate: async (groupDeletionProps: GroupDeletionProps) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return prevGroupCache.filter((groupItem) => groupItem.group !== groupDeletionProps.groupToDelete);
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });

  const budgetDeletionMutation = useMutation({
    mutationFn: (categoryToDelete: string) => {
      return handleBudgetDeletion(categoryToDelete);
    },
    onMutate: async (categoryToDelete: string) => {
      await queryClient.cancelQueries({ queryKey: ["budgetArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["budgetArray", email]);
      await queryClient.setQueryData(["budgetArray", email], (prevBudgetCache: BudgetItemEntity[]) => {
        return prevBudgetCache.filter((budgetItem) => budgetItem.category !== categoryToDelete);
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["budgetArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
      queryClient.invalidateQueries({ queryKey: ["budgetArray", email] });
    },
  });

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
            groupDeletionMutation.mutate({
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
            groupDeletionMutation.mutate({
              groupToDelete: groupToDelete,
              keepContainedCategories: true,
            });
            changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmGroupDeletionModalVisible", false);
          }}
          optionTwoText="Confirm"
          optionTwoFunction={() => {
            groupDeletionMutation.mutate({
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
            // handleBudgetDeletion(categoryToDelete, setBudgetArray)
            //   .then(async (response) => {
            //     setBudgetArray(await getBudgetList());
            //     console.log("Deletion successful", response);
            //   })
            //   .catch((error) => console.log("Deletion unsuccessful", error));
            budgetDeletionMutation.mutate(categoryToDelete);
          }}
          isVisible="isConfirmCategoryDeletionModalVisible"
        />
      )}
    </div>
  );
}
