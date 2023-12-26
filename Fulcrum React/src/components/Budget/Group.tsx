import {
    BudgetFormVisibilityState,
    BudgetItemEntity,
    GroupOptionsFormattedData,
    handleGroupDeletion
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupName: string;
    groupColour: string;

    filteredBudgetArray: BudgetItemEntity[];

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;


    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>;
    setOldGroupBeingEdited: Dispatch<SetStateAction<{ oldGroupName: string, oldColour: string }>>
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  groupColour,
                                  setGroupNameOfNewItem,
                                  setInitialGroupOptions,
                                  setOldBudgetBeingEdited,
                                  setOldGroupBeingEdited,
                                  setBudgetFormVisibility}: GroupProps) {

    function handleEditClick() {
        setOldGroupBeingEdited( { oldGroupName: groupName, oldColour: groupColour });
        // setIsUpdateGroupVisible(true);
        setBudgetFormVisibility( current => ({...current, isUpdateGroupVisible: true}))
    }
    function handleDeleteClick() {
        // Delete the group
        handleGroupDeletion(groupName, setInitialGroupOptions, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div className="box-shadow group flex flex-col bg-amber-200 rounded-3xl p-5 mb-8" style={{backgroundColor: `${groupColour}`}}>
            <div className="flex flex-row justify-center items-center mb-4">
                <h1 className="m-4">{groupName}</h1>

                {groupName !== "Miscellaneous" &&
                    <div className="flex flex-row justify-center items-center">
                        <div className="circle-button rounded-full p-1 mt-3" onClick={handleEditClick}>
                            <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-10 h-10" />
                        </div>
                        <div className="circle-button rounded-full p-1 mt-3" onClick={handleDeleteClick}>
                            <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-10 h-10" />
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