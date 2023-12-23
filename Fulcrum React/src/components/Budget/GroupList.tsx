import {BudgetItemEntity, GroupOptionsFormattedData} from "../../util.ts";
import Group from "./Group.tsx";
import {Dispatch, SetStateAction} from "react";
import AddNewGroupButton from "./AddNewGroupButton.tsx";

interface GroupListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
    initialGroupOptions: GroupOptionsFormattedData[];
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>
    setGroupOfNewItem: Dispatch<SetStateAction<string>>
    setIsCreateGroupVisible: Dispatch<SetStateAction<boolean>>
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>
}

export default function GroupList( { budgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount, initialGroupOptions, setIsCreateBudgetVisible, setGroupOfNewItem, setIsCreateGroupVisible, setInitialGroupOptions }: GroupListProps ) {

    // 1. Make an array containing unique group in the budgetArray
    const groupArray = initialGroupOptions.map( groupOption => groupOption.label)
    console.log(groupArray)

    return (
        <div>
            {
                // 2. For each unique group, create a filtered version of the budgetArray with only budgetItems with that group
                groupArray.map( (group: string, key) => {
                    const filteredBudgetArray = budgetArray.filter( (budgetItem: BudgetItemEntity) => {
                        return budgetItem.group === group
                    })
                    const groupColour = initialGroupOptions.filter( (groupOption) => {
                        return groupOption.value === group
                    } )[0].colour
                    return <Group groupName={group}
                                  filteredBudgetArray={filteredBudgetArray}
                                  setBudgetArray={setBudgetArray}
                                  setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                  setEditingCategory={setEditingCategory}
                                  setEditingOldAmount={setEditingOldAmount}
                                  groupColour={groupColour}
                                  setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                  setGroupOfNewItem={setGroupOfNewItem}
                                  setInitialGroupOptions={setInitialGroupOptions}
                                  key={key}/>
                })
            }
            <AddNewGroupButton setIsCreateGroupVisible={setIsCreateGroupVisible}/>
        </div>
    )
}