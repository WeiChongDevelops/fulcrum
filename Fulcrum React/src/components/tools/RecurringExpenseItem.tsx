import '/src/css/Budget.css';
import {
    capitaliseFirstLetter,
    formatDollarAmountStatic,
    PreviousRecurringExpenseBeingEdited, PublicUserData,
    RecurringExpenseFormVisibility, RecurringExpenseFrequency,
    RecurringExpenseModalVisibility
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";

interface RecurringExpenseItemProps {
    recurringExpenseId: string;
    category: string;
    amount: number;
    iconPath: string;
    timestamp: Date;
    frequency: RecurringExpenseFrequency;

    groupName: string;
    groupColour: string;

    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
    setRecurringExpenseModalVisibility: Dispatch<SetStateAction<RecurringExpenseModalVisibility>>;

    setOldRecurringExpenseBeingEdited: Dispatch<SetStateAction<PreviousRecurringExpenseBeingEdited>>;
    setRecurringExpenseIdToDelete: Dispatch<SetStateAction<string>>;

    publicUserData: PublicUserData;
}

export default function RecurringExpenseItem( { recurringExpenseId,
                                                  category,
                                                  amount,
                                                  iconPath,
                                                  timestamp,
                                                  frequency,
                                                  groupName,
                                                  groupColour,
                                                  setRecurringExpenseFormVisibility,
                                                  setRecurringExpenseModalVisibility,
                                                  setOldRecurringExpenseBeingEdited,
                                                  setRecurringExpenseIdToDelete,
                                                  publicUserData}: RecurringExpenseItemProps) {

    function handleEditClick() {
        setOldRecurringExpenseBeingEdited({
            recurringExpenseId: recurringExpenseId,
            oldCategory: category,
            oldAmount: amount,
            oldTimestamp: timestamp,
            oldFrequency: frequency
        })
        setRecurringExpenseFormVisibility(current => ({...current, isUpdateRecurringExpenseVisible: true}))
    }

    function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        setRecurringExpenseIdToDelete(recurringExpenseId);
        setRecurringExpenseModalVisibility(current => ({...current, isConfirmRecurringExpenseDestructionModalVisible: true}))
    }

    return (
        <div className="expense-item flex flex-row justify-between items-center w-[95vw] py-1.5 px-2.5 rounded-2xl my-3 text-black select-none"
             style={{backgroundColor: groupColour, opacity: frequency === "never" ? "40%" : "100%"}}
             onClick={handleEditClick}>
            <div className="flex flex-row items-center">
                <div className="rounded-full bg-[#1b1c1c] p-3">
                    <img src={`/src/assets/category-icons/${iconPath}`} alt="" className="w-8 h-auto"/>
                </div>
                <div className="flex flex-col items-start ml-2" style={{
                    color: groupName === "Miscellaneous" ? "white" : "black"
                }}>
                    <p className="font-bold text-xl mb-[-2px]">{category}</p>
                    <p className="text-sm font-medium">{groupName}</p>
                </div>
            </div>
            <div className="flex flex-row items-center" style={{
                color: groupName === "Miscellaneous" ? "white" : "black"
            }}>
                <div className="flex flex-row w-44 items-center">
                    <img src={`/src/assets/UI-icons/tools-recurring-icon-${groupName === "Miscellaneous" ? "white" : "black"}.svg`} alt="Cycle icon" className={"w-8 h-8"}/>
                    <p className={"text-xl ml-3 mr-8 font-bold"}>{capitaliseFirstLetter(frequency)}</p>
                </div>

                <b className="text-xl">{formatDollarAmountStatic(amount, publicUserData.currency)}</b>
                <div className="flex flex-row items-center ml-2">
                    <button className="circle-button" onClick={handleEditClick}>
                        <img src={`/src/assets/UI-icons/edit-pencil-${groupName === "Miscellaneous" ? "white" : "black"}-icon.svg`} alt="" className="mx-1 w-6 h-6" />
                    </button>
                    <button className="circle-button" onClick={handleDeleteClick}>
                        <img src={`/src/assets/UI-icons/delete-trash-${groupName === "Miscellaneous" ? "white" : "black"}-icon.svg`} alt="" className="mx-1 w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
