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
} from "../util.ts";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";

export function useGlobalAppData() {
  // const [publicUserData, setPublicUserData] = useState<PublicUserData>({
  //   createdAt: new Date(),
  //   currency: "AUD",
  //   darkModeEnabled: sessionStoredDarkMode ? sessionStoredDarkMode === "true" : false,
  //   accessibilityEnabled: sessionStoredAccessibilityMode ? sessionStoredAccessibilityMode === "true" : false,
  //   profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg",
  // });
  // const [expenseArray, setExpenseArray] = useState<ExpenseItemEntity[]>([]);
  // const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
  // const [groupArray, setGroupArray] = useState<GroupItemEntity[]>([]);
  // const [recurringExpenseArray, setRecurringExpenseArray] = useState<RecurringExpenseItemEntity[]>([]);
  // const [blacklistedExpenseArray, setBlacklistedExpenseArray] = useState<BlacklistedExpenseItemEntity[]>([]);
  // const [categoryDataMap, setCategoryDataMap] = useState<CategoryToIconGroupAndColourMap>(new Map());

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

  // useMemo(() => {
  //   const updateCategoryDataMap = async () => {
  //     groupArray.length !== 0 &&
  //     budgetArray.length !== 0 &&
  //     setCategoryDataMap(await getGroupAndColourMap(budgetArray, groupArray));
  //   };
  //   updateCategoryDataMap();
  // }, [budgetArray, groupArray]);

  // const { data, isLoading, isSuccess, isError, error } = useQuery({
  //   queryKey: ["globalAppData", email],
  //   queryFn: retrieveGlobalAppData,
  //   enabled: !!email,
  // });

  const isAnyLoading =
    globalAppDataQueries.some((query: UseQueryResult) => query.isLoading) || categoryDataMapQuery.isLoading;
  const isAnyError = globalAppDataQueries.some((query: UseQueryResult) => query.isError) || categoryDataMapQuery.isError;
  // const isAllSuccess =
  //   globalAppDataQueries.every((query: UseQueryResult) => query.isSuccess) && groupAndColourMapQuery.isSuccess;
  const errors = globalAppDataQueries
    .map((query: UseQueryResult) => query.error)
    .filter((error) => error !== null) as Error[];

  // THIS USE EFFECT IS TEMPORARY - NO STATE SETTING NEEDED WITH REACT QUERY AFTER RQ IS IMPLEMENTED.
  // useEffect(() => {
  //   if (isAllSuccess) {
  //     setPublicUserData(publicUserDataQuery.data! as PublicUserData);
  //     setExpenseArray(expenseArrayQuery.data! as ExpenseItemEntity[]);
  //     setBudgetArray(budgetArrayQuery.data! as BudgetItemEntity[]);
  //     setGroupArray(groupArrayQuery.data! as GroupItemEntity[]);
  //     setRecurringExpenseArray(recurringExpenseArrayQuery.data! as RecurringExpenseItemEntity[]);
  //     setBlacklistedExpenseArray(blacklistedExpenseArrayQuery.data! as BlacklistedExpenseItemEntity[]);
  //     setCategoryDataMap(groupAndColourMapQuery.data! as CategoryToIconGroupAndColourMap);
  //   }
  // }, [globalAppDataQueries]);

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
