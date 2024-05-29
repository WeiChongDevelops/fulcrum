import "../../../css/Tools.css";
import { useState } from "react";
import RecurringExpenses from "./recurring-expenses/RecurringExpenses.tsx";
import Settings from "./settings/Settings.tsx";
import ToolsHome from "./tools-home/ToolsHome.tsx";
import {
  BudgetItemEntity,
  CategoryToIconAndColourMap,
  ExpenseItemEntity,
  GroupItemEntity,
  OpenToolsSection,
  UserPreferences,
  RecurringExpenseItemEntity,
} from "../../../utility/types.ts";

interface ToolsProps {
  userPreferences: UserPreferences;
  expenseArray: ExpenseItemEntity[];
  budgetArray: BudgetItemEntity[];
  groupArray: GroupItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
  categoryToIconAndColourMap: CategoryToIconAndColourMap;
}

/**
 * The root component for the tools page.
 */
export default function Tools({
  userPreferences,
  expenseArray,
  budgetArray,
  groupArray,
  recurringExpenseArray,
  categoryToIconAndColourMap,
}: ToolsProps) {
  // const [openToolsSection, setOpenToolsSection] = useState<OpenToolsSection>("home");
  //
  // if (openToolsSection === "settings") {
  //   return <Settings setOpenToolsSection={setOpenToolsSection} userPreferences={userPreferences} />;
  // }
  //
  // if (openToolsSection === "recurring") {
  //   return (
  //     <RecurringExpenses
  //       setOpenToolsSection={setOpenToolsSection}
  //       userPreferences={userPreferences}
  //       expenseArray={expenseArray}
  //       budgetArray={budgetArray}
  //       groupArray={groupArray}
  //       categoryToIconAndColourMap={categoryToIconAndColourMap}
  //       recurringExpenseArray={recurringExpenseArray}
  //     />
  //   );
  // }
  //
  // return <ToolsHome userPreferences={userPreferences} setOpenToolsSection={setOpenToolsSection} />;
  return <></>;
}
