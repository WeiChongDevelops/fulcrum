import ExpenseCreationForm from "../modals-and-forms/ExpenseCreationForm.tsx";
import {
    BudgetItemEntity,
    categoryListAsOptions,
    ExpenseFormVisibility,
    ExpenseItemEntity,
    ExpenseModalVisibility,
    getCurrencySymbol,
    GroupItemEntity,
    handleExpenseDeletion,
    handleRemovedRecurringExpenseCreation,
    PreviousExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseItemEntity,
    RemovedRecurringExpenseItem
} from "../../util.ts";
import ExpenseUpdatingForm from "../modals-and-forms/ExpenseUpdatingForm.tsx";
import RecurringExpenseInstanceUpdatingForm from "../modals-and-forms/RecurringExpenseInstanceUpdatingForm.tsx";
import TwoOptionModal from "../modals-and-forms/TwoOptionModal.tsx";
import {Dispatch, SetStateAction} from "react";

interface ExpenseModalsAndFormsProps {
    expenseFormVisibility: ExpenseFormVisibility;
    setExpenseFormVisibility: Dispatch<SetStateAction<ExpenseFormVisibility>>;
    expenseModalVisibility: ExpenseModalVisibility;
    setExpenseModalVisibility: Dispatch<SetStateAction<ExpenseModalVisibility>>;

    expenseArray: ExpenseItemEntity[];
    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
    setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItem[]>>;

    publicUserData: PublicUserData;
    defaultCalendarDate: Date;

    oldExpenseBeingEdited: PreviousExpenseBeingEdited;
    expenseIdToDelete: string;
}

export default function ExpenseModalsAndForms( { expenseFormVisibility,
                                                   setExpenseFormVisibility,
                                                   expenseModalVisibility,
                                                   setExpenseModalVisibility,
                                                   expenseArray,
                                                   budgetArray,
                                                   groupArray,
                                                   setExpenseArray,
                                                   setBudgetArray,
                                                   setRecurringExpenseArray,
                                                   setRemovedRecurringExpenseInstances,
                                                   publicUserData,
                                                   defaultCalendarDate,
                                                   oldExpenseBeingEdited,
                                                   expenseIdToDelete }: ExpenseModalsAndFormsProps) {

    async function runExpenseDeletion() {
        const expenseItemToDelete = expenseArray.find(expenseItem => expenseItem.expenseId === expenseIdToDelete);
        if (expenseItemToDelete) {
            if (expenseItemToDelete.recurringExpenseId !== null) {
                handleRemovedRecurringExpenseCreation(expenseItemToDelete.recurringExpenseId, expenseItemToDelete.timestamp, setRemovedRecurringExpenseInstances)
                    .then(() => {
                        console.log("Logged recurrence removal successful")
                        handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
                            .then(() => console.log("Deletion successful"))
                            .catch(() => console.log("Deletion unsuccessful"));
                    })
                    .catch(() => console.log("Logged recurrence removal unsuccessful"));
            } else {
                handleExpenseDeletion(expenseIdToDelete, setExpenseArray, setBudgetArray)
                    .then(() => console.log("Deletion successful"))
                    .catch(() => console.log("Deletion unsuccessful"));
            }
        }
    }


    return (
        <div className={"z-4"}>
            {expenseFormVisibility.isCreateExpenseVisible && <ExpenseCreationForm
                setExpenseFormVisibility={setExpenseFormVisibility}
                setExpenseArray={setExpenseArray}
                setBudgetArray={setBudgetArray}
                setRecurringExpenseArray={setRecurringExpenseArray}
                budgetArray={budgetArray}
                categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                currencySymbol={getCurrencySymbol(publicUserData.currency)}
                defaultCalendarDate={defaultCalendarDate}
                mustBeRecurring={false}/>}
            {expenseFormVisibility.isUpdateExpenseVisible &&
                <ExpenseUpdatingForm setExpenseFormVisibility={setExpenseFormVisibility}
                                     setExpenseArray={setExpenseArray} setBudgetArray={setBudgetArray}
                                     categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                     oldExpenseBeingEdited={oldExpenseBeingEdited}
                                     currencySymbol={getCurrencySymbol(publicUserData.currency)}/>}

            {expenseFormVisibility.isUpdateRecurringExpenseInstanceVisible &&
                <RecurringExpenseInstanceUpdatingForm setExpenseFormVisibility={setExpenseFormVisibility}
                                                      setExpenseArray={setExpenseArray}
                                                      categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                                      oldExpenseBeingEdited={oldExpenseBeingEdited}
                                                      currencySymbol={getCurrencySymbol(publicUserData.currency)}
                                                      setRemovedRecurringExpenseInstances={setRemovedRecurringExpenseInstances}/>}

            {expenseModalVisibility.isConfirmExpenseDestructionModalVisible &&
                <TwoOptionModal optionOneText="Cancel"
                                optionOneFunction={() => setExpenseModalVisibility(current => ({
                                    ...current,
                                    isConfirmExpenseDestructionModalVisible: false
                                }))} optionTwoText="Confirm" optionTwoFunction={() => {
                    runExpenseDeletion()
                    setExpenseModalVisibility(current => ({
                        ...current,
                        isConfirmExpenseDestructionModalVisible: false
                    }));
                }}
                                setModalVisibility={setExpenseModalVisibility}
                                isVisible="isConfirmExpenseDestructionModalVisible"
                                title="Are you sure you want to delete this expense?"/>}
        </div>
    );
}