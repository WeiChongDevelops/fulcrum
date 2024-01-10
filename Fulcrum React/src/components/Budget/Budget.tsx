import {
    BudgetItemEntity, dynamicallySizeBudgetNameDisplays,
    getAmountBudgeted,
    getBudgetList, getGroupList, GroupItemEntity, handleGroupDeletion,
} from "../../util.ts";
import { useEffect, useState } from "react";
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import FulcrumAnimation from "./FulcrumAnimation.tsx";
import GroupList from "./GroupList.tsx";
import AddNewGroupButton from "./AddNewGroupButton.tsx";
import ModalsAndForms from "./ModalsAndForms/ModalsAndForms.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);

    const [budgetFormVisibility, setBudgetFormVisibility] = useState({
        isCreateBudgetVisible: false,
        isUpdateBudgetVisible: false,
        isCreateGroupVisible: false,
        isUpdateGroupVisible: false,
    });

    const [modalFormVisibility, setModalFormVisibility] = useState( {
        isDeleteOptionsModalVisible: false,
        isConfirmGroupDestructionModalVisible: false,
        isConfirmCategoryDestructionModalVisible: false
    })

    // const [isDeleteOptionsModalVisible, setIsDeleteOptionsModalVisible] = useState<boolean>(false);
    // const [isConfirmGroupDestructionModalVisible, setIsConfirmGroupDestructionModalVisible] = useState<boolean>(false);
    // const [isConfirmCategoryDestructionModalVisible, setIsConfirmCategoryDestructionModalVisible] = useState<boolean>(false);

    const [groupToDelete, setGroupToDelete] = useState<string>("");
    const [categoryToDelete, setCategoryToDelete] = useState<string>("");

    const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState({ oldAmount: 0, oldCategory: "", oldGroup: ""});
    const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState({ oldColour: "", oldGroupName: "" });

    const [totalIncome, setTotalIncome] = useState<number>(1000);
    const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);

    const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");

    useEffect(() => {
        getBudgetList()
            .then(budgetList => {
                setBudgetArray(budgetList.sort())
            })
        getGroupList()
            .then( results => setGroupArray(results))

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
        document.getElementById("category")?.focus();
        console.log(budgetFormVisibility);
    }, [budgetFormVisibility])

    function runGroupDeletionWithUserPreference(keepContainedBudgets: boolean) {
        setModalFormVisibility(current => ({...current,
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

    function adjustBackgroundHeight() {
        const bodyHeight = document.body.scrollHeight;
        const backgroundDiv: HTMLDivElement = document.querySelector('.background')!;
        backgroundDiv!.style.height = bodyHeight + 'px';
    }

    // Select the node to be observed
    const targetNode = document.body;

    // Set up the observer options
        const config = {
            childList: true,    // Detect direct children changes
            subtree: true,      // Detect all descendant changes
            attributes: true    // Detect changes in attributes
        };

    // Callback function to execute when changes are observed
        const callback = function() {
            adjustBackgroundHeight();
        };

    // Create an instance of the observer
        const observer = new MutationObserver(callback);

    // Start observing the target node
        observer.observe(targetNode, config);

    return (
        <div className="flex flex-row justify-center items-center">
            <div className={`flex flex-col elementsBelowPopUpForm z-2
            ${((Object.values(budgetFormVisibility).includes(true)) 
                || Object.values(modalFormVisibility).includes(true)) && "blur"} px-16`}>
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
                    setModalFormVisibility={setModalFormVisibility}/>}

                <AddNewGroupButton setBudgetFormVisibility={setBudgetFormVisibility}/>
            </div>

            <ModalsAndForms budgetFormVisibility={budgetFormVisibility}
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
                            modalFormVisibility={modalFormVisibility}
                            setModalFormVisibility={setModalFormVisibility}/>

        </div>
    );
}
