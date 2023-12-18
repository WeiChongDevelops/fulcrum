import {BudgetItemEntity} from "../../util.ts";
import Group from "./Group.tsx";
import {Dispatch, SetStateAction} from "react";

interface GroupListProps {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
}

export default function GroupList( { budgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount }: GroupListProps ) {

    // 1. Make an array containing unique group in the budgetArray
    const groupArray = Array.from(new Set(budgetArray.map( (budgetItem: BudgetItemEntity) => budgetItem.group)))

    return (
        <>
            {
                // 2. For each unique group, create a filtered version of the budgetArray with only budgetItems with that group
                groupArray.map( (group: string, key) => {
                    const filteredBudgetArray = budgetArray.filter( (budgetItem: BudgetItemEntity) => {
                        return budgetItem.group === group
                    })
                        return <Group groupName={group}
                                      filteredBudgetArray={filteredBudgetArray}
                                      setBudgetArray={setBudgetArray}
                                      setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                                      setEditingCategory={setEditingCategory}
                                      setEditingOldAmount={setEditingOldAmount}
                                      key={key}/>
                })
            }
        </>
    )
}