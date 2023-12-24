import {BudgetItemEntity, GroupOptionsFormattedData, handleGroupDeletion} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    groupName: string;
    filteredBudgetArray: BudgetItemEntity[];
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    groupColour: string;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>;
    setGroupColourOfNewItem: Dispatch<SetStateAction<string>>;
    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>;
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  setIsUpdateBudgetVisible,
                                  groupColour,
                                  setIsCreateBudgetVisible,
                                  setGroupNameOfNewItem,
                                  setGroupColourOfNewItem,
                                  setInitialGroupOptions,
                                  setOldBudgetBeingEdited}: GroupProps) {

    function handleEditClick() {
        // Open a form to edit the group name/colour
    }
    function handleDeleteClick() {
        // Delete the group
        handleGroupDeletion(groupName, setInitialGroupOptions, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div className="boxShadow flex flex-col bg-amber-200 rounded-3xl my-10 p-5" style={{backgroundColor: `${groupColour}`}}>
            <h1 className="mb-5">{groupName}</h1>
            <div className="flex flex-row">
                {filteredBudgetArray.length > 0 && filteredBudgetArray.sort().map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        group={groupName}
                        icon={budgetElement.iconPath}
                        setBudgetArray={setBudgetArray}
                        setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                        setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                        key={key}
                    />
                ))}
                <AddNewBudgetToGroupButton setIsCreateBudgetVisible={setIsCreateBudgetVisible}
                                           setGroupNameOfNewItem={setGroupNameOfNewItem}
                                           setGroupColourOfNewItem={setGroupColourOfNewItem}
                                           groupNameOfNewItem={groupName}
                                           groupColourOfNewItem={groupColour}/>
            </div>

            <div className="circle-button rounded-full p-1" onClick={handleEditClick}>
                <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
            </div>
            <div className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
            </div>
        </div>
    );
}