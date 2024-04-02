import { useEffect, useMemo, useState } from "react";
import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  getBlacklistedExpenses,
  getBudgetList,
  getExpenseList,
  getGroupAndColourMap,
  getGroupList,
  getPublicUserData,
  getRecurringExpenseList,
  GroupItemEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "../util.ts";
import { useQuery } from "@tanstack/react-query";

export function useGlobalAppData() {
  const sessionStoredProfileIcon = sessionStorage.getItem("profileIconFileName");
  const sessionStoredDarkMode = sessionStorage.getItem("darkModeEnabled");
  const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityEnabled");
  const sessionStoredEmail = sessionStorage.getItem("email");

  const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");
  const [publicUserData, setPublicUserData] = useState<PublicUserData>({
    createdAt: new Date(),
    currency: "AUD",
    darkModeEnabled: sessionStoredDarkMode ? sessionStoredDarkMode === "true" : false,
    accessibilityEnabled: sessionStoredAccessibilityMode ? sessionStoredAccessibilityMode === "true" : false,
    profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg",
  });
  const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
  const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
  const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
  const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
  const [blacklistedExpenseArray, setBlacklistedExpenseArray] = useState<BlacklistedExpenseItemEntity[]>([]);
  const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());

  useEffect(() => {
    if (publicUserData) {
      sessionStorage.setItem("profileIconFileName", publicUserData.profileIconFileName);
      sessionStorage.setItem("darkModeEnabled", publicUserData.darkModeEnabled.toString());
      sessionStorage.setItem("accessibilityEnabled", publicUserData.accessibilityEnabled.toString());
    }
  }, [publicUserData]);

  useMemo(() => {
    const updateCategoryDataMap = async () => {
      groupArray.length !== 0 &&
        budgetArray.length !== 0 &&
        setCategoryDataMap(await getGroupAndColourMap(budgetArray, groupArray));
    };
    updateCategoryDataMap();
  }, [budgetArray, groupArray]);

  async function retrieveGlobalAppData() {
    const [
      publicUserDataRetrieved,
      expenseDataRetrieved,
      budgetDataRetrieved,
      groupDataRetrieved,
      recurringExpenseDataRetrieved,
      blacklistedExpenseDataRetrieved,
    ] = await Promise.all([
      getPublicUserData(),
      getExpenseList(),
      getBudgetList(),
      getGroupList(),
      getRecurringExpenseList(),
      getBlacklistedExpenses(),
    ]);

    const groupAndColourMapRetrieved = await getGroupAndColourMap(budgetDataRetrieved, groupDataRetrieved);

    return {
      publicUserDataRetrieved: publicUserDataRetrieved,
      expenseDataRetrieved: expenseDataRetrieved,
      budgetDataRetrieved: budgetDataRetrieved,
      groupDataRetrieved: groupDataRetrieved,
      recurringExpenseDataRetrieved: recurringExpenseDataRetrieved,
      blacklistedExpenseDataRetrieved: blacklistedExpenseDataRetrieved,
      groupAndColourMapRetrieved: groupAndColourMapRetrieved,
    };
  }

  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ["globalAppData", email],
    queryFn: retrieveGlobalAppData,
    enabled: !!email,
  });

  useEffect(() => {
    if (isSuccess) {
      setPublicUserData(data.publicUserDataRetrieved);
      setExpenseArray(data.expenseDataRetrieved);
      setBudgetArray(data.budgetDataRetrieved);
      setGroupArray(data.groupDataRetrieved);
      setRecurringExpenseArray(data.recurringExpenseDataRetrieved);
      setBlacklistedExpenseArray(data.blacklistedExpenseDataRetrieved);
      setCategoryDataMap(data.groupAndColourMapRetrieved);
    }
  }, [isSuccess]);

  return {
    publicUserData,
    setPublicUserData,
    expenseArray,
    setExpenseArray,
    budgetArray,
    setBudgetArray,
    groupArray,
    setGroupArray,
    recurringExpenseArray,
    setRecurringExpenseArray,
    blacklistedExpenseArray,
    setBlacklistedExpenseArray,
    email,
    setEmail,
    categoryDataMap,
    isLoading,
    isError,
    error,
  };
}
