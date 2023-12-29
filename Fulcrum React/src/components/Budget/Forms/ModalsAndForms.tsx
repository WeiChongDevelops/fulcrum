import BudgetCreationForm from "./BudgetCreationForm.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";
import GroupCreationForm from "./GroupCreationForm.tsx";
import GroupUpdatingForm from "./GroupUpdatingForm.tsx";
import TwoOptionModal from "../../Other/TwoOptionModal.tsx";
import {BudgetItemEntity, GroupItemEntity} from "../../../util.ts";

import { Dispatch, SetStateAction } from 'react';

interface ModalsAndFormsProps {
    budgetFormVisibility: {
        isCreateBudgetVisible: boolean;
        isUpdateBudgetVisible: boolean;
        isCreateGroupVisible: boolean;
        isUpdateGroupVisible: boolean;
    };
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    groupArray: GroupItemEntity[];
    groupNameOfNewItem: string;
    setBudgetFormVisibility: Dispatch<SetStateAction<{
        isCreateBudgetVisible: boolean;
        isUpdateBudgetVisible: boolean;
        isCreateGroupVisible: boolean;
        isUpdateGroupVisible: boolean;
    }>>;
    oldBudgetBeingEdited: { oldAmount: number; oldCategory: string; oldGroup: string };
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
    oldGroupBeingEdited: { oldColour: string; oldGroupName: string };
    isDeleteOptionsModalVisible: boolean;
    groupToDelete: string;
    runGroupDeletionWithUserPreference: (keepContainedBudgets: boolean) => void;
    setIsDeleteOptionsModalVisible: Dispatch<SetStateAction<boolean>>;
    setIsConfirmDestructionModalVisible: Dispatch<SetStateAction<boolean>>;
    isConfirmDestructionModalVisible: boolean;
}


export default function ModalsAndForms( { budgetFormVisibility,
                                            setBudgetArray,
                                            groupArray,
                                            groupNameOfNewItem,
                                            setBudgetFormVisibility,
                                            oldBudgetBeingEdited,
                                            setGroupArray,
                                            oldGroupBeingEdited,
                                            isDeleteOptionsModalVisible,
                                            groupToDelete,
                                            runGroupDeletionWithUserPreference,
                                            setIsDeleteOptionsModalVisible,
                                            setIsConfirmDestructionModalVisible,
                                            isConfirmDestructionModalVisible}:ModalsAndFormsProps ) {
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
        {isDeleteOptionsModalVisible && <TwoOptionModal
            title={`Deleting Group '${groupToDelete}'`}
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Delete Categories"
            optionTwoFunction={() => {
                setIsDeleteOptionsModalVisible(false);
                setIsConfirmDestructionModalVisible(true);
            }}
            setVisible={setIsDeleteOptionsModalVisible}
        />}
        {isConfirmDestructionModalVisible && <TwoOptionModal
            title="Are you sure? This will delete all expense entries for this budget category."
            optionOneText="Keep Categories (Move to Miscellaneous)"
            optionOneFunction={() => runGroupDeletionWithUserPreference(true)}
            optionTwoText="Confirm"
            optionTwoFunction={() => runGroupDeletionWithUserPreference(false)}
            setVisible={setIsConfirmDestructionModalVisible}
        />}
    </div>);
}