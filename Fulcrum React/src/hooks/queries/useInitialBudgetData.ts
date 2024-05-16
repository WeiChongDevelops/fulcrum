import { useContext, useEffect, useState } from "react";
import { checkForOpenModalOrForm, EmailContext, getLineAngle, LocationContext } from "../../utility/util.ts";
import { useQuery } from "@tanstack/react-query";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
} from "../../utility/types.ts";
import { getSessionEmailOrNull, getTotalIncome } from "../../utility/api.ts";
import { useNavigate } from "react-router-dom";

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
    isDataVisVisible: false,
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
  const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("Miscellaneous");
  const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);

  const routerLocation = useContext(LocationContext);
  const [lineAngle, setLineAngle] = useState(0);
  const [perCategoryExpenseTotalThisMonth, setPerCategoryExpenseTotalThisMonth] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    setIsBudgetFormOrModalOpen(checkForOpenModalOrForm(budgetFormVisibility, budgetModalVisibility));
  }, [budgetFormVisibility, budgetModalVisibility, routerLocation]);

  const email = useContext(EmailContext);
  const navigate = useNavigate();

  async function retrieveInitialData() {
    try {
      const isLoggedIn = (await getSessionEmailOrNull()) !== null;
      if (isLoggedIn) {
        console.log("User logged in.");
      } else {
        console.log("User not logged in, login redirect initiated.");
        navigate("/login");
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
    totalIncome && setLineAngle(getLineAngle(amountLeftToBudget, totalIncome));
  }, [amountLeftToBudget, totalIncome, routerLocation]);

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
