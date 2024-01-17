import {
    BudgetFormVisibilityState,
    BudgetItemEntity, BudgetModalVisibilityState,
    GroupItemEntity, PreviousBudgetBeingEdited, PreviousGroupBeingEdited
} from "../../util.ts";
import Group from "./Group.tsx";
import {Dispatch, SetStateAction} from "react";

interface GroupListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupArray: GroupItemEntity[];
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibilityState>>;

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>
    setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>

    setGroupToDelete: Dispatch<SetStateAction<string>>;

    setCategoryToDelete: Dispatch<SetStateAction<string>>;

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
                                       setModalFormVisibility,
                                       setCategoryToDelete}: GroupListProps ) {

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
                                  setCategoryToDelete={setCategoryToDelete}
                                  setModalFormVisibility={setModalFormVisibility}
                                  key={key}/>
                })
            }
        </div>
    )
}