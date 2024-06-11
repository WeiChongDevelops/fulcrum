import { useContext, useEffect, useState } from "react";
import { checkForOpenModalOrForm, EmailContext, LocationContext, useLocation } from "../../utility/util.ts";
import { useQuery } from "@tanstack/react-query";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  PreviousBudgetBeingEdited,
  PreviousGroupBeingEdited,
} from "../../utility/types.ts";
import { getSessionEmailOrNull, getTotalIncome } from "../../api/api.ts";
import { useNavigate } from "react-router-dom";
import { getSessionEmailOrNullDirect } from "@/utility/supabase-client.ts";
import { getTotalIncomeDirect } from "@/api/total-income-api.ts";

export default function useInitialBudgetData() {
  const [budgetFormVisibility, setBudgetFormVisibility] = useState<BudgetFormVisibility>({
    isCreateBudgetVisible: false,
    isUpdateBudgetVisible: false,
    isCreateGroupVisible: false,
    isUpdateGroupVisible: false,
  });
  const [budgetModalVisibility, setBudgetModalVisibility] = useState<BudgetModalVisibility>({
    showChooseDeleteGroupOptionModal: false,
    showConfirmDeleteGroupModal: false,
    showConfirmDeleteCategoryModal: false,
    showDataVisModal: false,
  });
  const [groupToDelete, setGroupToDelete] = useState<string>("");
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [oldBudgetBeingEdited, setOldBudgetBeingEdited] = useState<PreviousBudgetBeingEdited>({
    oldAmount: 0,
    oldCategory: "",
    oldGroup: "",
    oldIconPath: "",
    id: -1,
  });
  const [oldGroupBeingEdited, setOldGroupBeingEdited] = useState<PreviousGroupBeingEdited>({
    oldColour: "",
    oldGroupName: "",
    oldId: -1,
  });
  const [amountLeftToBudget, setAmountLeftToBudget] = useState<number>(0);
  const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("Miscellaneous");
  const [isBudgetFormOrModalOpen, setIsBudgetFormOrModalOpen] = useState(false);

  const routerLocation = useLocation();

  useEffect(() => {
    setIsBudgetFormOrModalOpen(checkForOpenModalOrForm(budgetFormVisibility, budgetModalVisibility));
  }, [budgetFormVisibility, budgetModalVisibility, routerLocation]);

  const email = useContext(EmailContext);
  const navigate = useNavigate();

  async function retrieveInitialData() {
    try {
      return getTotalIncomeDirect();
    } catch (error) {
      console.log(`Unsuccessful budget page data retrieval - error: ${error}`);
      navigate("/login");
    }
  }

  const {
    data: totalIncome,
    isLoading,
    isError,
    isSuccess,
    error,
    status,
  } = useQuery({
    queryKey: ["totalIncome", email],
    queryFn: retrieveInitialData,
    enabled: !!email,
  });

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
    isLoading,
    isError,
    isSuccess,
    error,
  };
}
