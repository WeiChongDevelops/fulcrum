import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface useGlobalAppDataProps {
  email: string;
  setCategoryDataMap: Dispatch<SetStateAction<CategoryToIconGroupAndColourMap>>;
  setError: Dispatch<SetStateAction<string>>;
}

export function useGlobalAppData({ email, setCategoryDataMap, setError }: useGlobalAppDataProps) {
  const sessionStoredProfileIcon = sessionStorage.getItem("profileIconFileName");
  const sessionStoredDarkMode = sessionStorage.getItem("darkModeEnabled");
  const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityEnabled");

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

  useEffect(() => {
    async function retrieveGlobalAppData() {
      if (!!email) {
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

        setPublicUserData(publicUserDataRetrieved);
        setExpenseArray(expenseDataRetrieved);
        setBudgetArray(budgetDataRetrieved);
        setGroupArray(groupDataRetrieved);
        setRecurringExpenseArray(recurringExpenseDataRetrieved);
        setBlacklistedExpenseArray(blacklistedExpenseDataRetrieved);

        setCategoryDataMap(await getGroupAndColourMap(budgetDataRetrieved, groupDataRetrieved));
      }
    }
    retrieveGlobalAppData()
      .then(() => console.log("Global app data retrieval successful."))
      .catch(() => setError("We’re unable to load your data right now. Please try again later."));
  }, [email]);
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
  };
}
