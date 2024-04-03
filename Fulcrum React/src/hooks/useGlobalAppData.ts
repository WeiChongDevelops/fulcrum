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
import { useQueries, UseQueryResult } from "@tanstack/react-query";

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

  // async function retrieveGlobalAppData() {
  //   const [
  //     publicUserDataRetrieved,
  //     expenseDataRetrieved,
  //     budgetDataRetrieved,
  //     groupDataRetrieved,
  //     recurringExpenseDataRetrieved,
  //     blacklistedExpenseDataRetrieved,
  //   ] = await Promise.all([
  //     getPublicUserData(),
  //     getExpenseList(),
  //     getBudgetList(),
  //     getGroupList(),
  //     getRecurringExpenseList(),
  //     getBlacklistedExpenses(),
  //   ]);
  //
  //   const groupAndColourMapRetrieved = await getGroupAndColourMap(budgetDataRetrieved, groupDataRetrieved);
  //
  //   return {
  //     publicUserDataRetrieved: publicUserDataRetrieved,
  //     expenseDataRetrieved: expenseDataRetrieved,
  //     budgetDataRetrieved: budgetDataRetrieved,
  //     groupDataRetrieved: groupDataRetrieved,
  //     recurringExpenseDataRetrieved: recurringExpenseDataRetrieved,
  //     blacklistedExpenseDataRetrieved: blacklistedExpenseDataRetrieved,
  //     groupAndColourMapRetrieved: groupAndColourMapRetrieved,
  //   };
  // }

  const globalAppDataQueries: UseQueryResult[] = useQueries({
    queries: [
      { queryKey: ["publicUserData", email], queryFn: getPublicUserData, enabled: !!email },
      { queryKey: ["expenseArray", email], queryFn: getExpenseList, enabled: !!email },
      { queryKey: ["budgetArray", email], queryFn: getBudgetList, enabled: !!email },
      { queryKey: ["groupArray", email], queryFn: getGroupList, enabled: !!email },
      { queryKey: ["recurringExpenseArray", email], queryFn: getRecurringExpenseList, enabled: !!email },
      { queryKey: ["blacklistedExpenseArray", email], queryFn: getBlacklistedExpenses, enabled: !!email },
      {
        queryKey: ["groupAndColourMap", email],
        queryFn: () =>
          getGroupAndColourMap(budgetArrayQuery.data as BudgetItemEntity[], groupArrayQuery.data as GroupItemEntity[]),
        enabled: !!email && !!budgetArray && !!groupArray,
      },
    ],
  });

  const [
    publicUserDataQuery,
    expenseArrayQuery,
    budgetArrayQuery,
    groupArrayQuery,
    recurringExpenseArrayQuery,
    blacklistedExpenseArrayQuery,
    groupAndColourMapQuery,
  ] = globalAppDataQueries;

  // const { data, isLoading, isSuccess, isError, error } = useQuery({
  //   queryKey: ["globalAppData", email],
  //   queryFn: retrieveGlobalAppData,
  //   enabled: !!email,
  // });

  const isAnyLoading = globalAppDataQueries.some((query: UseQueryResult) => query.isLoading);
  const isAnyError = globalAppDataQueries.some((query: UseQueryResult) => query.isError);
  const isAllSuccess = globalAppDataQueries.every((query: UseQueryResult) => query.isSuccess);
  const errors = globalAppDataQueries
    .map((query: UseQueryResult) => query.error)
    .filter((error) => error !== null) as Error[];

  // THIS USE EFFECT IS TEMPORARY - NO STATE SETTING NEEDED WITH REACT QUERY AFTER RQ IS IMPLEMENTED.
  useEffect(() => {
    if (isAllSuccess) {
      setPublicUserData(publicUserDataQuery.data! as PublicUserData);
      setExpenseArray(expenseArrayQuery.data! as ExpenseItemEntity[]);
      // setBudgetArray(budgetArrayQuery.data! as BudgetItemEntity[]);
      setGroupArray(groupArrayQuery.data! as GroupItemEntity[]);
      setRecurringExpenseArray(recurringExpenseArrayQuery.data! as RecurringExpenseItemEntity[]);
      setBlacklistedExpenseArray(blacklistedExpenseArrayQuery.data! as BlacklistedExpenseItemEntity[]);
      setCategoryDataMap(groupAndColourMapQuery.data! as CategoryToIconGroupAndColourMap);
    }
  }, [globalAppDataQueries]);

  return {
    publicUserData,
    setPublicUserData,
    expenseArray,
    setExpenseArray,
    budgetArrayQuery,
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
    isAnyLoading,
    isAnyError,
    errors,
  };
}
