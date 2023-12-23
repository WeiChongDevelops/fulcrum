import {BudgetItemEntity} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    groupName: string
    filteredBudgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setEditingCategory: Dispatch<SetStateAction<string | null>>;
    setEditingOldAmount: Dispatch<SetStateAction<number>>;
    groupColour: string | null;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>
    setGroupOfNewItem: Dispatch<SetStateAction<string>>
}

export default function Group({ groupName, filteredBudgetArray, setBudgetArray, setIsUpdateBudgetVisible, setEditingCategory, setEditingOldAmount, groupColour, setIsCreateBudgetVisible, setGroupOfNewItem }: GroupProps) {

    // If the issue arises again with the colour of the tile being undefined, set a default colour for it to use when the value
    // is found to be undefined

    return (
        <div className="boxShadow flex flex-col bg-amber-200 rounded-3xl my-10 p-5" style={{backgroundColor: `${groupColour}`}}>
            <h1 className="mb-5">{groupName}</h1>
            <div className="flex flex-row">
                {filteredBudgetArray.length > 0 && filteredBudgetArray.sort().map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        icon={budgetElement.iconPath}
                        setBudgetArray={setBudgetArray}
                        setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                        setEditingCategory={setEditingCategory}
                        setEditingOldAmount={setEditingOldAmount}
                        key={key}
                    />
                ))}
                <AddNewBudgetToGroupButton setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                           setGroupOfNewItem={setGroupOfNewItem}
                                           clickedGroup={groupName}/>
            </div>
        </div>
    );
}