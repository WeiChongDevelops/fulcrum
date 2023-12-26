import {BudgetItemEntity, GroupOptionsFormattedData, handleGroupDeletion} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    groupName: string;
    groupColour: string;

    filteredBudgetArray: BudgetItemEntity[];

    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    setIsUpdateGroupVisible: Dispatch<SetStateAction<boolean>>;

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<{ oldAmount: number, oldCategory: string, oldGroup: string }>>;
    setOldGroupBeingEdited: Dispatch<SetStateAction<{ oldGroupName: string, oldColour: string }>>
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  setIsUpdateBudgetVisible,
                                  groupColour,
                                  setIsCreateBudgetVisible,
                                  setIsUpdateGroupVisible,
                                  setGroupNameOfNewItem,
                                  setInitialGroupOptions,
                                  setOldBudgetBeingEdited,
                                  setOldGroupBeingEdited}: GroupProps) {

    function handleEditClick() {
        // Open a form to edit the group name/colour
        setOldGroupBeingEdited( { oldGroupName: groupName, oldColour: groupColour });
        setIsUpdateGroupVisible(true);
    }
    function handleDeleteClick() {
        // Delete the group
        handleGroupDeletion(groupName, setInitialGroupOptions, setBudgetArray)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    return (
        <div className="boxShadow flex flex-col bg-amber-200 rounded-3xl my-10 p-5" style={{backgroundColor: `${groupColour}`}}>
            <div className="flex flex-row justify-center items-center mb-5">
                <h1 className="mr-4">{groupName}</h1>

                <div className="circle-button rounded-full p-1 mt-3" onClick={handleEditClick}>
                    <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
                </div>
                <div className="circle-button rounded-full p-1 mt-3" onClick={handleDeleteClick}>
                    <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
                </div>
            </div>
            <div className="flex flex-row flex-wrap flex-shrink-0 basis-0 justify-center">
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
                                           groupNameOfNewItem={groupName}/>
            </div>

        </div>
    );
}