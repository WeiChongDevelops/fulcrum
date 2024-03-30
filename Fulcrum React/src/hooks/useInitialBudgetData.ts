import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  checkForUser,
  getTotalIncome,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
} from "../util.ts";

export default function useInitialBudgetData(setError: Dispatch<SetStateAction<string>>) {
  const [budgetFormVisibility, setBudgetFormVisibility] = useState<BudgetFormVisibility>({
    isCreateBudgetVisible: false,
    isUpdateBudgetVisible: false,
    isCreateGroupVisible: false,
    isUpdateGroupVisible: false,
  });
  const [budgetModalVisibility, setBudgetModalVisibility] = useState<BudgetModalVisibility>({
    isDeleteOptionsModalVisible: false,
    isConfirmGroupDeletionModalVisible: false,
    isConfirmCategoryDeletionModalVisible: false,
  });
  const [groupToDelete, setGroupToDelete] = useState<string>("");
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState<PreviousBudgetBeingEdited>({
    oldAmount: 0,
    oldCategory: "",
    oldGroup: "",
  });
  const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState<PreviousGroupBeingEdited>({
    oldColour: "",
    oldGroupName: "",
  });
  const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
  const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");
  const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lineAngle, setLineAngle] = useState(0);
  const [perCategoryExpenditureMap, setPerCategoryExpenditureMap] = useState<Map<string, number>>(new Map());

  const [totalIncome, setTotalIncome] = useState<number>(1000);

  useEffect(() => {
    async function retrieveInitialData() {
      const userStatus = await checkForUser();
      !userStatus["loggedIn"] && (window.location.href = "/login");
      setTotalIncome(await getTotalIncome());
    }
    retrieveInitialData()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => setError("We’re unable to load your data right now. Please try again later."));
  }, []);

  return {
    budgetFormVisibility,
    setBudgetFormVisibility,

    budgetModalVisibility,
    setBudgetModalVisibility,

    groupToDelete,
    setGroupToDelete,

    categoryToDelete,
    setCategoryToDelete,

    oldBudgetBeingEdited,
    setOldBudgetBeingEdited,

    oldGroupBeingEdited,
    setOldGroupBeingEdited,

    amountLeftToBudget,
    setAmountLeftToBudget,

    groupNameOfNewItem,
    setGroupNameOfNewItem,

    isBudgetFormOrModalOpen,
    setIsBudgetFormOrModalOpen,

    isLoading,

    lineAngle,
    setLineAngle,

    perCategoryExpenditureMap,
    setPerCategoryExpenditureMap,

    totalIncome,
    setTotalIncome,
  };
}
