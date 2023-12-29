import {
    BudgetFormVisibilityState,
    BudgetItemEntity, GroupItemEntity, handleGroupDeletion
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    groupName: string;
    groupColour: string;

    filteredBudgetArray: BudgetItemEntity[];

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>;
    setOldGroupBeingEdited: Dispatch<SetStateAction<{ oldGroupName: string, oldColour: string }>>

    setGroupToDelete: Dispatch<SetStateAction<string>>;
    setIsDeleteOptionsModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  setGroupArray,
                                  groupColour,
                                  setGroupNameOfNewItem,
                                  setOldBudgetBeingEdited,
                                  setOldGroupBeingEdited,
                                  setBudgetFormVisibility,
                                  setGroupToDelete,
                                  setIsDeleteOptionsModalVisible}: GroupProps) {

    function handleEditClick() {
        setOldGroupBeingEdited( { oldGroupName: groupName, oldColour: groupColour });
        setBudgetFormVisibility( current => ({...current, isUpdateGroupVisible: true}))
    }
    function handleDeleteClick() {
        setGroupToDelete(groupName);
        // If there are categories inside this group, allow the user to choose between retaining them and deleting them.
        if (filteredBudgetArray.length > 0) {
            setIsDeleteOptionsModalVisible(true);
        } else {
            handleGroupDeletion(groupName, setGroupArray, setBudgetArray, false)
                .then(() => console.log("Deletion successful"))
                .catch((error) => console.log("Deletion unsuccessful", error));
        }
    }

    return (
        <div className="group flex flex-col rounded-3xl p-2 mb-5" style={{backgroundColor: `${groupColour}`}}>
            <div className="flex flex-row justify-center items-center mb-4">
                <b className="mt-2 text-xl">{groupName}</b>

                {groupName !== "Miscellaneous" &&
                    <div className="flex flex-row justify-center items-center ml-1">
                        <div className="circle-button rounded-full p-1 mt-2" onClick={handleEditClick}>
                            <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="w-4 h-4" />
                        </div>
                        <div className="circle-button rounded-full p-1 mt-2" onClick={handleDeleteClick}>
                            <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="w-4 h-4" />
                        </div>
                    </div>
                }

            </div>
            <div className="flex flex-row flex-wrap flex-shrink-0 basis-0 justify-start">
                {filteredBudgetArray.length > 0 && filteredBudgetArray.sort().map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        group={groupName}
                        icon={budgetElement.iconPath}
                        setBudgetArray={setBudgetArray}
                        setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                        setBudgetFormVisibility={setBudgetFormVisibility}
                        key={key}
                    />
                ))}
                <AddNewBudgetToGroupButton setBudgetFormVisibility={setBudgetFormVisibility}
                                           setGroupNameOfNewItem={setGroupNameOfNewItem}
                                           groupNameOfNewItem={groupName}/>
            </div>

        </div>
    );
}