import BudgetCreationForm from "./BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import GroupCreationForm from "./GroupCreationForm.tsx";
import GroupUpdatingForm from "./GroupUpdatingForm.tsx";
import TwoOptionModal from "./TwoOptionModal.tsx";
import {
    BudgetFormVisibilityState,
    BudgetItemEntity,
    BudgetModalVisibilityState,
    GroupItemEntity,
    handleBudgetDeletion, PreviousBudgetBeingEdited, PreviousGroupBeingEdited
} from "../../../util.ts";

import { Dispatch, SetStateAction } from 'react';

interface ModalsAndFormsProps {
    budgetFormVisibility: BudgetFormVisibilityState;
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;

    modalFormVisibility:BudgetModalVisibilityState;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibilityState>>;

    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    groupArray: GroupItemEntity[];
    groupNameOfNewItem: string;
    oldBudgetBeingEdited: PreviousBudgetBeingEdited;
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
    oldGroupBeingEdited: PreviousGroupBeingEdited;
    groupToDelete: string;
    categoryToDelete: string;
    runGroupDeletionWithUserPreference: (keepContainedBudgets: boolean) => void;
}

export default function BudgetModalsAndForms({ budgetFormVisibility,
                                            setBudgetArray,
                                            groupArray,
                                            groupNameOfNewItem,
                                            setBudgetFormVisibility,
                                            modalFormVisibility,
                                            setModalFormVisibility,
                                            oldBudgetBeingEdited,
                                            setGroupArray,
                                            oldGroupBeingEdited,
                                            groupToDelete,
                                            categoryToDelete,
                                            runGroupDeletionWithUserPreference,}:ModalsAndFormsProps ) {
    return(<div>
        {budgetFormVisibility.isCreateBudgetVisible && <BudgetCreationForm setBudgetArray={setBudgetArray}
                                                                           groupArray={groupArray}
                                                                           groupNameOfNewItem={groupNameOfNewItem}
                                                                           setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {budgetFormVisibility.isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                                           oldBudgetBeingEdited={oldBudgetBeingEdited}
                                                                           groupArray={groupArray}
                                                                           setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {budgetFormVisibility.isCreateGroupVisible && <GroupCreationForm setGroupArray={setGroupArray}
                                                                         setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {budgetFormVisibility.isUpdateGroupVisible && <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited}
                                                                         setBudgetArray={setBudgetArray}
                                                                         groupArray={groupArray}
                                                                         setGroupArray={setGroupArray}
                                                                         setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {modalFormVisibility.isDeleteOptionsModalVisible && <TwoOptionModal
            title={`Deleting Group '${groupToDelete}'`}
            setModalFormVisibility={setModalFormVisibility}
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Delete Categories"
            optionTwoFunction={() => {
                setModalFormVisibility(current => (
                    {...current, isDeleteOptionsModalVisible: false, isConfirmGroupDestructionModalVisible: true}
                ));
            }}
            setVisible="setIsDeleteOptionsModalVisible"
        />}
        {modalFormVisibility.isConfirmGroupDestructionModalVisible && <TwoOptionModal
            title="Are you sure? This will delete all expense entries for this budget category."
            setModalFormVisibility={setModalFormVisibility}
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Confirm"
            optionTwoFunction={() => runGroupDeletionWithUserPreference(false)}
            setVisible="setIsConfirmGroupDestructionModalVisible"/>
        }
        {modalFormVisibility.isConfirmCategoryDestructionModalVisible && <TwoOptionModal
            title="Are you sure? This will delete all expense entries for this budget category."
            setModalFormVisibility={setModalFormVisibility}
            optionOneText="Cancel"
            optionOneFunction={() => {
                setModalFormVisibility(current => (
                    {...current, isConfirmCategoryDestructionModalVisible: false}
                ));
            }}
            optionTwoText="Confirm"
            optionTwoFunction={() => {
                setModalFormVisibility(current => (
                    {...current, isConfirmCategoryDestructionModalVisible: false}
                ));
                handleBudgetDeletion(categoryToDelete, setBudgetArray)
                    .then((response) => console.log("Deletion successful", response))
                    .catch((error) => console.log("Deletion unsuccessful", error));
            }}
            setVisible="setIsConfirmCategoryDestructionModalVisible"/>
        }
    </div>);
}