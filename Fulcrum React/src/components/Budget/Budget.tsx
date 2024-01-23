import {
    BudgetFormVisibility,
    BudgetItemEntity,
    BudgetModalVisibility, checkForOpenBudgetModalOrForm, checkForUser,
    dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList,
    getGroupList,
    GroupItemEntity,
    handleGroupDeletion,
    implementDynamicBackgroundHeight,
    PreviousBudgetBeingEdited, PreviousGroupBeingEdited,
} from "../../util.ts";
import { useEffect, useState } from "react";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";
import BudgetModalsAndForms from "../ModalsAndForms/BudgetModalsAndForms.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [budgetFormVisibility, setBudgetFormVisibility] = useState<BudgetFormVisibility>({
        isCreateBudgetVisible: false,
        isUpdateBudgetVisible: false,
        isCreateGroupVisible: false,
        isUpdateGroupVisible: false,
    });

    const [budgetModalVisibility, setBudgetModalVisibility] = useState<BudgetModalVisibility>( {
        isDeleteOptionsModalVisible: false,
        isConfirmGroupDestructionModalVisible: false,
        isConfirmCategoryDestructionModalVisible: false
    })

    const [groupToDelete, setGroupToDelete] = useState<string>("");
    const [categoryToDelete, setCategoryToDelete] = useState<string>("");

    const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState<PreviousBudgetBeingEdited>({ oldAmount: 0, oldCategory: "", oldGroup: ""});
    const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState<PreviousGroupBeingEdited>({ oldColour: "", oldGroupName: "" });

    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);

    const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");

    const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);

    useEffect(() => {
        checkForUser()
            .then(userStatus => {
                if (userStatus["loggedIn"]) {
                    console.log("User logged in.");
                } else {
                    console.log("User not logged in, login redirect initiated.");
                    window.location.href = "/login";
                }
            })
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList.sort())
            })
        getGroupList()
            .then( results => setGroupArray(results))
            .then(implementDynamicBackgroundHeight)
    }, []);

    useEffect( () => {
        dynamicallySizeBudgetNameDisplays()
        getGroupList()
            .then( results => setGroupArray(results))
    }, [budgetArray])

    useEffect( () => {
        setAmountLeftToBudget(totalIncome - getAmountBudgeted(budgetArray))
    },[budgetArray, totalIncome])

    useEffect( () => {
        const formCategoryInput = document.getElementById("category")
        const formGroupInput = document.getElementById("group")
        formCategoryInput ? formCategoryInput.focus() : formGroupInput?.focus();
        console.log(budgetFormVisibility);
        setIsBudgetFormOrModalOpen(checkForOpenBudgetModalOrForm(budgetFormVisibility, budgetModalVisibility))
    }, [budgetFormVisibility, budgetModalVisibility])

    function runGroupDeletionWithUserPreference(keepContainedBudgets: boolean) {
        setBudgetModalVisibility(current => ({...current,
            isDeleteOptionsModalVisible: false,
            isConfirmGroupDestructionModalVisible: false
        }))

        handleGroupDeletion(groupToDelete, setGroupArray, setBudgetArray, keepContainedBudgets)
            .then(() => console.log("Deletion successful"))
            .catch((error) => console.log("Deletion unsuccessful", error));
    }

    const percentageIncomeRemaining = amountLeftToBudget/totalIncome * 100;
    // Any disproportionately small or large numbers pulled into normal ranges for the animation
    const functionalPercentageIncomeRemaining = percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining

    const lineAngle = functionalPercentageIncomeRemaining <= -100 ? 14.5 :
        functionalPercentageIncomeRemaining === 100 ? -14.5 :
            functionalPercentageIncomeRemaining / (100/14.5);

    return (
        <div className="flex flex-row justify-center items-center">
            <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${((Object.values(budgetFormVisibility).includes(true)) 
                || Object.values(budgetModalVisibility).includes(true)) && "blur"} px-16`}>
                <TotalIncomeDisplay
                    totalIncome={totalIncome}
                    setTotalIncome={setTotalIncome}
                    amountLeftToBudget={amountLeftToBudget}/>

                <FulcrumAnimation lineAngle={lineAngle}/>

                {groupArray?.length > 0 && <GroupList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setOldBudgetBeingEdited={setOldBudgetBeingEdited}
                    setOldGroupBeingEdited={setOldGroupBeingEdited}
                    groupArray={groupArray}
                    setGroupArray={setGroupArray}
                    setGroupNameOfNewItem={setGroupNameOfNewItem}
                    setBudgetFormVisibility={setBudgetFormVisibility}
                    setGroupToDelete={setGroupToDelete}
                    setCategoryToDelete={setCategoryToDelete}
                    setModalFormVisibility={setBudgetModalVisibility}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>

            {isBudgetFormOrModalOpen && <div className="absolute w-screen h-screen bg-transparent z-3"></div>}

            <div className="z-4">
            <BudgetModalsAndForms budgetFormVisibility={budgetFormVisibility}
                                  setBudgetArray={setBudgetArray}
                                  groupArray={groupArray}
                                  groupNameOfNewItem={groupNameOfNewItem}
                                  setBudgetFormVisibility={setBudgetFormVisibility}
                                  oldBudgetBeingEdited={oldBudgetBeingEdited}
                                  setGroupArray={setGroupArray}
                                  oldGroupBeingEdited={oldGroupBeingEdited}
                                  groupToDelete={groupToDelete}
                                  categoryToDelete={categoryToDelete}
                                  runGroupDeletionWithUserPreference={runGroupDeletionWithUserPreference}
                                  modalFormVisibility={budgetModalVisibility}
                                  setModalFormVisibility={setBudgetModalVisibility}/>
            </div>
        </div>
    );
}
