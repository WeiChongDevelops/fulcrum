import { useContext, useEffect, useState } from "react";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  checkForOpenModalOrForm,
  EmailContext,
  getLineAngle,
  getSessionEmailOrNull,
  getTotalIncome,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
} from "../../util.ts";
import { useQuery } from "@tanstack/react-query";

export default function useInitialBudgetData() {
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
    oldIconPath: "",
  });
  const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState<PreviousGroupBeingEdited>({
    oldColour: "",
    oldGroupName: "",
  });
  const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
  const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("");
  const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);
  const [lineAngle, setLineAngle] = useState(1);
  const [perCategoryExpenseTotalThisMonth, setPerCategoryExpenseTotalThisMonth] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setIsBudgetFormOrModalOpen(checkForOpenModalOrForm(budgetFormVisibility, budgetModalVisibility));
  }, [budgetFormVisibility, budgetModalVisibility]);

  const email = useContext(EmailContext);

  async function retrieveInitialData() {
    try {
      const isLoggedIn = (await getSessionEmailOrNull()).email !== null;
      if (isLoggedIn) {
        console.log("User logged in.");
      } else {
        console.log("User not logged in, login redirect initiated.");
        window.location.href = "/login";
      }
      return getTotalIncome();
    } catch (error) {
      console.log(`Unsuccessful budget page data retrieval - error: ${error}`);
    }
  }

  const {
    data: totalIncome,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["totalIncome", email],
    queryFn: retrieveInitialData,
    enabled: !!email,
  });

  useEffect(() => {
    totalIncome && setLineAngle(getLineAngle((amountLeftToBudget / totalIncome) * 100));
  }, [amountLeftToBudget, totalIncome]);

  return {
    totalIncome,
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
    lineAngle,
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isLoading,
    isError,
    isSuccess,
    error,
  };
}
