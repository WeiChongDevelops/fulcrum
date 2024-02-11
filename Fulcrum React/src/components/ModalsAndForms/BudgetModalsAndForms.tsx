import BudgetCreationForm from "./BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import GroupCreationForm from "./GroupCreationForm.tsx";
import GroupUpdatingForm from "./GroupUpdatingForm.tsx";
import TwoOptionModal from "./TwoOptionModal.tsx";
import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility,
    GroupItemEntity,
    handleBudgetDeletion, PreviousBudgetBeingEdited, PreviousGroupBeingEdited
} from "../../util.ts";

import { Dispatch, SetStateAction } from 'react';

interface ModalsAndFormsProps {
    budgetFormVisibility: BudgetFormVisibility;
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;

    modalFormVisibility:BudgetModalVisibility;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>;

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
                                                 runGroupDeletionWithUserPreference,
                                                 currencySymbol}:ModalsAndFormsProps ) {
    return(<div>
        {budgetFormVisibility.isCreateBudgetVisible && <BudgetCreationForm setBudgetArray={setBudgetArray}
                                                                           groupArray={groupArray}
                                                                           groupNameOfNewItem={groupNameOfNewItem}
                                                                           setBudgetFormVisibility={setBudgetFormVisibility}
                                                                           currencySymbol={currencySymbol}/>}
        {budgetFormVisibility.isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray}
                                                                           oldBudgetBeingEdited={oldBudgetBeingEdited}
                                                                           groupArray={groupArray}
                                                                           setBudgetFormVisibility={setBudgetFormVisibility}
                                                                           currencySymbol={currencySymbol}/>}
        {budgetFormVisibility.isCreateGroupVisible && <GroupCreationForm setGroupArray={setGroupArray}
                                                                         setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {budgetFormVisibility.isUpdateGroupVisible && <GroupUpdatingForm oldGroupBeingEdited={oldGroupBeingEdited}
                                                                         setBudgetArray={setBudgetArray}
                                                                         groupArray={groupArray}
                                                                         setGroupArray={setGroupArray}
                                                                         setBudgetFormVisibility={setBudgetFormVisibility}/>}
        {modalFormVisibility.isDeleteOptionsModalVisible && <TwoOptionModal
            title={`Would you like to keep the categories inside group '${groupToDelete}'?`}
            setModalVisibility={setModalFormVisibility}
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Delete Categories"
            optionTwoFunction={() => {
                setModalFormVisibility(current => (
                    {...current, isDeleteOptionsModalVisible: false, isConfirmGroupDestructionModalVisible: true}
                ));
            }}
            isVisible="isDeleteOptionsModalVisible"
        />}
        {modalFormVisibility.isConfirmGroupDestructionModalVisible && <TwoOptionModal
            title="Are you sure? This will delete all expense entries for this budget category."
            setModalVisibility={setModalFormVisibility}
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Confirm"
            optionTwoFunction={() => runGroupDeletionWithUserPreference(false)}
            isVisible="isConfirmGroupDestructionModalVisible"/>
        }
        {modalFormVisibility.isConfirmCategoryDestructionModalVisible && <TwoOptionModal
            title="Are you sure? This will delete all expense entries for this budget category."
            setModalVisibility={setModalFormVisibility}
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
            isVisible="isConfirmCategoryDestructionModalVisible"/>
        }
    </div>);
}