import { useContext, useState } from "react";
import { EmailContext } from "@/utility/util.ts";
import { useQuery } from "@tanstack/react-query";
import { PreviousBudgetBeingEdited, PreviousGroupBeingEdited } from "@/utility/types.ts";
import { useNavigate } from "react-router-dom";
import { getTotalIncomeDirect } from "@/api/total-income-api.ts";

export default function useInitialBudgetData() {
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
  const [groupNameOfNewItem, setGroupNameOfNewItem] = useState<string>("Miscellaneous");

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
    error,
  } = useQuery({
    queryKey: ["totalIncome", email],
    queryFn: retrieveInitialData,
    enabled: !!email,
  });

  return {
    totalIncome,
    oldBudgetBeingEdited,
    setOldBudgetBeingEdited,
    oldGroupBeingEdited,
    setOldGroupBeingEdited,
    groupNameOfNewItem,
    setGroupNameOfNewItem,
    isLoading,
    isError,
    error,
  };
}
