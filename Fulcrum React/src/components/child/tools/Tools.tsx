import {
  BudgetItemEntity,
  CategoryToIconGroupAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  OpenToolsSection,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "../../../util.ts";
import "../../../css/Tools.css";
import { useState } from "react";
import RecurringExpenses from "./recurring-expenses/RecurringExpenses.tsx";
import Settings from "./settings/Settings.tsx";
import ToolsHome from "./tools-home/ToolsHome.tsx";

interface ToolsProps {
  publicUserData: PublicUserData;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
  categoryDataMap: CategoryToIconGroupAndColourMap;
}

/**
 * The root component for the tools page.
 */
export default function Tools({
  publicUserData,
  expenseArray,
  budgetArray,
  groupArray,
  recurringExpenseArray,
  categoryDataMap,
}: ToolsProps) {
  const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");

  return (
    <>
      {openToolsSection === "home" ? (
        <ToolsHome publicUserData={publicUserData} setOpenToolsSection={setOpenToolsSection} />
      ) : openToolsSection === "settings" ? (
        <Settings setOpenToolsSection={setOpenToolsSection} publicUserData={publicUserData} />
      ) : (
        <RecurringExpenses
          setOpenToolsSection={setOpenToolsSection}
          publicUserData={publicUserData}
          expenseArray={expenseArray}
          budgetArray={budgetArray}
          groupArray={groupArray}
          categoryDataMap={categoryDataMap}
          recurringExpenseArray={recurringExpenseArray}
        />
      )}
    </>
  );
}
