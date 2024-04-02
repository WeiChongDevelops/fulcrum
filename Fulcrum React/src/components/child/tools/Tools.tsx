import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  getSessionEmail,
  GroupItemEntity,
  OpenToolsSection,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  RecurringExpenseItemEntity,
} from "../../../util.ts";
import "../../../css/Tools.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import RecurringExpenses from "./recurring-expenses/RecurringExpenses.tsx";
import Settings from "./settings/Settings.tsx";
import ToolsHome from "./tools-home/ToolsHome.tsx";

interface ToolsProps {
  publicUserData: PublicUserData;
  setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;

  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];

  setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>;
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;

  recurringExpenseArray: RecurringExpenseItemEntity[];
  setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>;

  categoryDataMap: CategoryToIconGroupAndColourMap;
  setBlacklistedExpenseArray: Dispatch<SetStateAction<BlacklistedExpenseItemEntity[]>>;
}

/**
 * The root component for the tools page.
 */
export default function Tools({
  publicUserData,
  setPublicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  setExpenseArray,
  setBudgetArray,
  recurringExpenseArray,
  setRecurringExpenseArray,
  categoryDataMap,
  setBlacklistedExpenseArray,
}: ToolsProps) {
  const sessionStoredEmail = sessionStorage.getItem("email");
  const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");
  const [email, setEmail] = useState(sessionStoredEmail ? sessionStoredEmail : "");

  useEffect(() => {
    getSessionEmail().then((response) => (response.email ? setEmail(response.email) : ""));
  }, []);

  return (
    <>
      {openToolsSection === "home" ? (
        <ToolsHome
          publicUserData={publicUserData}
          setPublicUserData={setPublicUserData}
          email={email}
          setOpenToolsSection={setOpenToolsSection}
        />
      ) : openToolsSection === "settings" ? (
        <Settings
          setOpenToolsSection={setOpenToolsSection}
          publicUserData={publicUserData}
          setPublicUserData={setPublicUserData}
        />
      ) : (
        <RecurringExpenses
          setOpenToolsSection={setOpenToolsSection}
          publicUserData={publicUserData}
          expenseArray={expenseArray}
          budgetArray={budgetArray}
          groupArray={groupArray}
          setExpenseArray={setExpenseArray}
          setBudgetArray={setBudgetArray}
          categoryDataMap={categoryDataMap}
          recurringExpenseArray={recurringExpenseArray}
          setRecurringExpenseArray={setRecurringExpenseArray}
          setBlacklistedExpenseArray={setBlacklistedExpenseArray}
        />
      )}
    </>
  );
}
