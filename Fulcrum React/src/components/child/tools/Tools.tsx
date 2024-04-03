import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  OpenToolsSection,
  PublicUserData,
  BlacklistedExpenseItemEntity,
  RecurringExpenseItemEntity,
} from "../../../util.ts";
import "../../../css/Tools.css";
import { Dispatch, SetStateAction, useState } from "react";
import RecurringExpenses from "./recurring-expenses/RecurringExpenses.tsx";
import Settings from "./settings/Settings.tsx";
import ToolsHome from "./tools-home/ToolsHome.tsx";

interface ToolsProps {
  email: string;
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
  email,
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
  const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");

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
          email={email}
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
