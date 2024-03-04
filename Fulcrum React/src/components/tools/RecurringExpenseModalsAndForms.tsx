import ExpenseCreationForm from "../modals-and-forms/ExpenseCreationForm.tsx";
import {
    BudgetItemEntity,
    categoryListAsOptions,
    ExpenseItemEntity,
    getCurrencySymbol,
    GroupItemEntity,
    handleRecurringExpenseDeletion,
    PreviousRecurringExpenseBeingEdited,
    PublicUserData,
    RecurringExpenseFormVisibility,
    RecurringExpenseItemEntity,
    RecurringExpenseModalVisibility
} from "../../util.ts";
import RecurringExpenseUpdatingForm from "../modals-and-forms/RecurringExpenseUpdatingForm.tsx";
import TwoOptionModal from "../modals-and-forms/TwoOptionModal.tsx";
import {Dispatch, SetStateAction} from "react";

interface RecurringExpenseModalsAndFormsProps {
    recurringExpenseFormVisibility: RecurringExpenseFormVisibility;
    setRecurringExpenseFormVisibility: Dispatch<SetStateAction<RecurringExpenseFormVisibility>>;
    recurringExpenseModalVisibility: RecurringExpenseModalVisibility;
    setRecurringExpenseModalVisibility: Dispatch<SetStateAction<RecurringExpenseModalVisibility>>;

    budgetArray: BudgetItemEntity[];
    groupArray: GroupItemEntity[];

    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
    setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

    publicUserData: PublicUserData;

    recurringExpenseIdToDelete: string;
    oldRecurringExpenseBeingEdited: PreviousRecurringExpenseBeingEdited;
}

export default function RecurringExpenseModalsAndForms( { recurringExpenseFormVisibility,
                                                            setRecurringExpenseFormVisibility,
                                                            recurringExpenseModalVisibility,
                                                            setRecurringExpenseModalVisibility,
                                                            budgetArray,
                                                            groupArray,
                                                            setExpenseArray,
                                                            setRecurringExpenseArray,
                                                            setBudgetArray,
                                                            publicUserData,
                                                            recurringExpenseIdToDelete,
                                                            oldRecurringExpenseBeingEdited}: RecurringExpenseModalsAndFormsProps) {

    function runRecurringExpenseDeletion() {
        handleRecurringExpenseDeletion(recurringExpenseIdToDelete, setRecurringExpenseArray)
            .then(() => console.log("Deletion successful"))
            .catch(() => console.log("Deletion unsuccessful"));
    }

    return (
        <div className={"z-4"}>
            {recurringExpenseFormVisibility.isCreateExpenseVisible &&
                <ExpenseCreationForm
                    setExpenseFormVisibility={setRecurringExpenseFormVisibility}
                    setExpenseArray={setExpenseArray}
                    setBudgetArray={setBudgetArray}
                    setRecurringExpenseArray={setRecurringExpenseArray}
                    budgetArray={budgetArray}
                    categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                    currencySymbol={getCurrencySymbol(publicUserData.currency)}
                    defaultCalendarDate={new Date()}
                    mustBeRecurring={true}/>}

            {recurringExpenseFormVisibility.isUpdateRecurringExpenseVisible &&
                <RecurringExpenseUpdatingForm setRecurringExpenseFormVisibility={setRecurringExpenseFormVisibility}
                                              setRecurringExpenseArray={setRecurringExpenseArray}
                                              setBudgetArray={setBudgetArray}
                                              categoryOptions={categoryListAsOptions(budgetArray, groupArray)}
                                              oldRecurringExpenseBeingEdited={oldRecurringExpenseBeingEdited}
                                              currencySymbol={getCurrencySymbol(publicUserData.currency)}/>}

            {recurringExpenseModalVisibility.isConfirmRecurringExpenseDestructionModalVisible &&
                <TwoOptionModal optionOneText="Cancel"
                                optionOneFunction={() => setRecurringExpenseModalVisibility(current => ({
                                    ...current,
                                    isConfirmRecurringExpenseDestructionModalVisible: false
                                }))} optionTwoText="Confirm" optionTwoFunction={() => {
                    runRecurringExpenseDeletion()
                    setRecurringExpenseModalVisibility(current => ({
                        ...current,
                        isConfirmRecurringExpenseDestructionModalVisible: false
                    }));
                }}
                                setModalVisibility={setRecurringExpenseModalVisibility}
                                isVisible="isConfirmRecurringExpenseDestructionModalVisible"
                                title="Are you sure you want to delete this recurring expense? Don't worry, this won't affect any past records."/>}
        </div>
    );
}