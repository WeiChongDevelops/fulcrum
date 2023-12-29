import {
    BudgetFormVisibilityState,
    BudgetItemEntity,
    GroupItemEntity
} from "../../util.ts";
import Group from "./Group.tsx";
import {Dispatch, SetStateAction} from "react";

interface GroupListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupArray: GroupItemEntity[];
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>
    setOldGroupBeingEdited: Dispatch<SetStateAction<{ oldGroupName: string, oldColour: string }>>

    setGroupToDelete: Dispatch<SetStateAction<string>>;
    setIsDeleteOptionsModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function GroupList( { budgetArray,
                                       setBudgetArray,
                                       groupArray,
                                       setGroupArray,
                                       setGroupNameOfNewItem,
                                       setOldBudgetBeingEdited,
                                       setOldGroupBeingEdited,
                                       setBudgetFormVisibility,
                                       setGroupToDelete,
                                       setIsDeleteOptionsModalVisible
                                   }: GroupListProps ) {

    // 1. Make an array containing unique group in the budgetArray
    // const groupOptions = groupListAsOptions(groupArray);
    return (
        <div>
            {
                // 2. For each unique group, create a filtered version of the budgetArray with only budgetItems with that group
                groupArray.map( (groupDataItem: GroupItemEntity, key) => {
                    const filteredBudgetArray = budgetArray.filter( (budgetItem: BudgetItemEntity) => {
                        return budgetItem.group === groupDataItem.group
                    })
                    // const groupColour: string = groupOptions.filter( (groupOption) => {
                    //     return groupOption.value === group
                    // } )[0].colour!!
                    return <Group groupName={groupDataItem.group}
                                  filteredBudgetArray={filteredBudgetArray}
                                  setBudgetArray={setBudgetArray}
                                  setGroupArray={setGroupArray}
                                  setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                                  setOldGroupBeingEdited={setOldGroupBeingEdited}
                                  groupColour={groupDataItem.colour}
                                  setGroupNameOfNewItem={setGroupNameOfNewItem}
                                  setBudgetFormVisibility={setBudgetFormVisibility}
                                  setGroupToDelete={setGroupToDelete}
                                  setIsDeleteOptionsModalVisible={setIsDeleteOptionsModalVisible}
                                  key={key}/>
                })
            }
        </div>
    )
}