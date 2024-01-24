import '/src/css/Budget.css';
import {
    BudgetItemEntity,
    ExpenseFormVisibility,
    ExpenseItemEntity,
    ExpenseModalVisibility,
    formatDollarAmountStatic,
    PreviousExpenseBeingEdited
} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";

interface BudgetItemProps {
    expenseId: string;
    category: string;
    amount: number;
    iconPath: string;

    groupName: string;
    groupColour: string;

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    setOldExpenseBeingEdited: Dispatch<SetStateAction<PreviousExpenseBeingEdited>>;
    setExpenseIdToDelete: Dispatch<SetStateAction<string>>;
}

export default function ExpenseItem( { expenseId,
                                         category,
                                         amount,
                                         iconPath,
                                         groupName,
                                         groupColour,
                                         setExpenseFormVisibility,
                                         setExpenseModalVisibility,
                                         setOldExpenseBeingEdited,
                                         setExpenseIdToDelete}: BudgetItemProps) {

    function handleEditClick() {
        setExpenseFormVisibility(current => ({...current, isUpdateExpenseVisible: true}))
        setOldExpenseBeingEdited({
            expenseId: expenseId,
            oldCategory: category,
            oldAmount: amount
        })
    }

    function handleDeleteClick() {
        setExpenseIdToDelete(expenseId);
        setExpenseModalVisibility(current => ({...current, isConfirmExpenseDestructionModalVisible: true}))
    }

    return (
        <div className="expense-item flex flex-row justify-between items-center w-[95vw] py-1.5 px-2.5 rounded-2xl my-3 text-black" style={{backgroundColor: groupColour}}>
            <div className="flex flex-row items-center">
                <div className="rounded-full bg-[#1b1c1c] p-2">
                    <img src={iconPath} alt="" />
                </div>
                <div className="flex flex-col items-start ml-2" style={{
                    color: groupName === "Miscellaneous" ? "white" : "black"
                }}>
                    <p className="font-bold text-xl mb-[-2px]">{category}</p>
                    <p className="text-sm font-medium">{groupName}</p>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <b className="text-xl">${formatDollarAmountStatic(amount)}</b>
                <div className="flex flex-row items-center ml-2">
                    <button className="circle-button rounded-full p-1" onClick={handleEditClick}>
                        <img src="/src/assets/UI-icons/edit-pencil-icon.svg" alt="" className="mx-1 w-6 h-6" />
                    </button>
                    <button className="circle-button rounded-full p-1" onClick={handleDeleteClick}>
                        <img src="/src/assets/UI-icons/delete-trash-icon.svg" alt="" className="mx-1 w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
