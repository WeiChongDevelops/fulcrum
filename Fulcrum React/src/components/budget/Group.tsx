import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility,
    dynamicallySizeBudgetNameDisplays,
    ExpenseItemEntity, formatDollarAmountStatic,
    getGroupBudgetTotal,
    getGroupExpenditureTotal,
    GroupItemEntity,
    handleGroupDeletion,
    PreviousBudgetBeingEdited,
    PreviousGroupBeingEdited, PublicUserData
} from "../../util.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import BudgetTile from "./BudgetTile.tsx";
import AddNewBudgetToGroupButton from "./AddNewBudgetToGroupButton.tsx";

interface GroupProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;

    groupName: string;
    groupColour: string;

    filteredBudgetArray: BudgetItemEntity[];

    expenseArray: ExpenseItemEntity[];

    setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;

    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
    setModalFormVisibility: Dispatch<SetStateAction<BudgetModalVisibility>>;

    setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>
    setOldGroupBeingEdited: Dispatch<SetStateAction<PreviousGroupBeingEdited>>

    setGroupToDelete: Dispatch<SetStateAction<string>>;

    setCategoryToDelete: Dispatch<SetStateAction<string>>;

    perCategoryTotalExpenseArray: Map<string, number>;

    publicUserData: PublicUserData;
}

export default function Group({ groupName,
                                  filteredBudgetArray,
                                  setBudgetArray,
                                  setGroupArray,
                                  groupColour,
                                  expenseArray,
                                  setGroupNameOfNewItem,
                                  setOldBudgetBeingEdited,
                                  setOldGroupBeingEdited,
                                  setBudgetFormVisibility,
                                  setGroupToDelete,
                                  setCategoryToDelete,
                                  setModalFormVisibility,
                                  perCategoryTotalExpenseArray,
                                  publicUserData}: GroupProps) {

    const [groupBudgetTotal, setGroupBudgetTotal] = useState(getGroupBudgetTotal(filteredBudgetArray));
    const [groupExpenditureTotal, setGroupExpenditureTotal] = useState(getGroupBudgetTotal(filteredBudgetArray));

    function handleEditClick() {
        setOldGroupBeingEdited( { oldGroupName: groupName, oldColour: groupColour });
        setBudgetFormVisibility( current => ({...current, isUpdateGroupVisible: true}))
    }
    function handleDeleteClick() {
        setGroupToDelete(groupName);
        // If there are categories inside this group, allow the user to choose between retaining them and deleting them.
        if (filteredBudgetArray.length > 0) {
            setModalFormVisibility(current => ({...current, isDeleteOptionsModalVisible: true}))
        } else {
            handleGroupDeletion(groupName, setGroupArray, setBudgetArray, false)
                .then(() => console.log("Deletion successful"))
                .catch((error) => console.log("Deletion unsuccessful", error));
        }
    }

    useEffect(() => {
        dynamicallySizeBudgetNameDisplays();

        setGroupBudgetTotal(getGroupBudgetTotal(filteredBudgetArray));
        setGroupExpenditureTotal(getGroupExpenditureTotal(expenseArray, filteredBudgetArray));

    }, [filteredBudgetArray, expenseArray]);

    const currency = publicUserData.currency;

    return (
        <div className="group flex flex-col w-[96vw] rounded-xl p-2 mb-5" style={{backgroundColor: groupColour, filter: publicUserData.darkModeEnabled ? "brightness(83%) contrast(113%)" : "brightness(100%)"}}>
            <div className="flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row ml-4 mt-1">
                    <p className={`mt - 2 text-3xl font-bold ${groupName !== "Miscellaneous" ? "text-black" : "text-white"}`}>{groupName}</p>
                    {groupName !== "Miscellaneous" &&
                        <div className="flex flex-row justify-center items-center ml-2 relative top-0.5">
                            <div className="circle-button" onClick={handleEditClick}>
                                <img src="/src/assets/UI-icons/edit-pencil-black-icon.svg" alt="" className="w-5 h-5" />
                            </div>
                            <div className="circle-button" onClick={handleDeleteClick}>
                                <img src="/src/assets/UI-icons/delete-trash-black-icon.svg" alt="" className="w-5 h-5" />
                            </div>
                        </div>
                    }
                </div>
                <p className={`${groupName !== "Miscellaneous" ? "text-black" : "text-white"} font-bold mr-4 text-3xl`}>Spent: {formatDollarAmountStatic(groupExpenditureTotal, currency)} of {formatDollarAmountStatic(groupBudgetTotal, currency)}</p>
            </div>
            <div className="flex flex-row flex-wrap flex-shrink-0 basis-0 justify-start">
                {filteredBudgetArray.length > 0 && filteredBudgetArray.map((budgetElement, key) => (
                    <BudgetTile
                        category={budgetElement.category}
                        amount={budgetElement.amount}
                        group={groupName}
                        icon={budgetElement.iconPath}
                        setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                        setBudgetFormVisibility={setBudgetFormVisibility}
                        setModalFormVisibility={setModalFormVisibility}
                        setCategoryToDelete={setCategoryToDelete}
                        perCategoryTotalExpenseArray={perCategoryTotalExpenseArray}
                        publicUserData={publicUserData}
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