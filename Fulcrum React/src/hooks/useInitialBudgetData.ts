import { useState } from "react";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  checkForUser,
  getTotalIncome,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
} from "../util.ts";
import { useQuery } from "@tanstack/react-query";

export default function useInitialBudgetData(email: string) {
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
  const [lineAngle, setLineAngle] = useState(0);
  const [perCategoryExpenditureMap, setPerCategoryExpenditureMap] = useState<Map<string, number>>(new Map());

  async function retrieveInitialData() {
    const userStatus = await checkForUser();
    if (userStatus["loggedIn"]) {
      console.log("User logged in.");
    } else {
      console.log("User not logged in, login redirect initiated.");
      window.location.href = "/login";
    }
    return { totalIncome: await getTotalIncome() };
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["totalIncome", email],
    queryFn: retrieveInitialData,
    enabled: !!email,
  });

  return {
    data,

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

    lineAngle,
    setLineAngle,

    perCategoryExpenditureMap,
    setPerCategoryExpenditureMap,

    isLoading,
    isError,
    error,
  };
}
