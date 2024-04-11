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
  getSessionEmailOrNull,
  GroupItemEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "../../util.ts";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";

export function useGlobalAppData() {
  const sessionStoredProfileIcon = sessionStorage.getItem("profileIconFileName");
  const sessionStoredDarkMode = sessionStorage.getItem("darkModeEnabled");
  const sessionStoredAccessibilityMode = sessionStorage.getItem("accessibilityEnabled");
  const sessionStoredEmail = sessionStorage.getItem("email");

  const emailQuery = useQuery({
    queryKey: ["activeEmail"],
    initialData: !!sessionStoredEmail ? sessionStoredEmail : null,
    queryFn: getSessionEmailOrNull,
    enabled: window.location.href.split("/").includes("app"),
  });

  const email = emailQuery.data;
  const retrievalConditions = !!email && window.location.href.split("/").includes("app");

  const globalAppDataQueries: UseQueryResult[] = useQueries({
    queries: [
      { queryKey: ["budgetArray", email], queryFn: getBudgetList, enabled: retrievalConditions },
      { queryKey: ["groupArray", email], queryFn: getGroupList, enabled: retrievalConditions },
      { queryKey: ["expenseArray", email], queryFn: getExpenseList, enabled: retrievalConditions },
      { queryKey: ["recurringExpenseArray", email], queryFn: getRecurringExpenseList, enabled: retrievalConditions },
      { queryKey: ["blacklistedExpenseArray", email], queryFn: getBlacklistedExpenses, enabled: retrievalConditions },
      {
        queryKey: ["publicUserData", email],
        queryFn: getPublicUserData,
        enabled: retrievalConditions,
        initialData: {
          createdAt: new Date(),
          currency: "AUD",
          profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "",
          darkModeEnabled: sessionStoredDarkMode ? sessionStoredDarkMode : false,
          accessibilityEnabled: sessionStoredAccessibilityMode ? sessionStoredAccessibilityMode : false,
        },
      },
    ],
  });

  const [
    budgetArrayQuery,
    groupArrayQuery,
    expenseArrayQuery,
    recurringExpenseArrayQuery,
    blacklistedExpenseArrayQuery,
    publicUserDataQuery,
  ] = globalAppDataQueries;

  if (!!publicUserDataQuery.data) {
    const publicUserData = publicUserDataQuery.data as PublicUserData;
    sessionStorage.setItem("profileIconFileName", publicUserData.profileIconFileName);
    sessionStorage.setItem("darkModeEnabled", publicUserData.darkModeEnabled.toString());
    sessionStorage.setItem("accessibilityEnabled", publicUserData.accessibilityEnabled.toString());
  }

  const categoryDataMapQuery = useQuery({
    queryKey: ["groupAndColourMap", email],
    queryFn: () =>
      getGroupAndColourMap(
        globalAppDataQueries[0].data as BudgetItemEntity[],
        globalAppDataQueries[1].data as GroupItemEntity[],
      ),
    enabled: !!email && !!budgetArrayQuery.data && !!groupArrayQuery.data,
  });

  const isAnyLoading =
    globalAppDataQueries.some((query: UseQueryResult) => query.isLoading) || categoryDataMapQuery.isLoading;
  const isAnyError = globalAppDataQueries.some((query: UseQueryResult) => query.isError) || categoryDataMapQuery.isError;
  const errors = globalAppDataQueries
    .map((query: UseQueryResult) => query.error)
    .filter((error) => error !== null) as Error[];

  return {
    email,
    budgetArray: budgetArrayQuery.data as BudgetItemEntity[],
    groupArray: groupArrayQuery.data as GroupItemEntity[],
    expenseArray: expenseArrayQuery.data as ExpenseItemEntity[],
    recurringExpenseArray: recurringExpenseArrayQuery.data as RecurringExpenseItemEntity[],
    blacklistedExpenseArray: blacklistedExpenseArrayQuery.data as BlacklistedExpenseItemEntity[],
    publicUserData: publicUserDataQuery.data as PublicUserData,
    categoryDataMap: categoryDataMapQuery.data as CategoryToIconGroupAndColourMap,
    isAnyLoading,
    isAnyError,
    errors,
  };
}
