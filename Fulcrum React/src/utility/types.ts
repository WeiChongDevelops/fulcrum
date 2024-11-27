//  EXPENSE ENTITIES //

export interface ExpenseItemEntity {
  expenseId: string;
  category: string;
  amount: number;
  timestamp: Date;
  recurringExpenseId: string | null;
}

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface ExpenseCreationFormData {
  category: string;
  amount: number;
  timestamp: Value;
  frequency: RecurringExpenseFrequency;
}

export interface ExpenseUpdatingFormData {
  category: string;
  amount: number;
  timestamp: Value;
}

export interface RecurringExpenseInstanceUpdatingFormData {
  category: string;
  amount: number;
}

export interface PreviousExpenseBeingEdited {
  expenseId: string;
  recurringExpenseId: string | null;
  oldCategory: string;
  oldAmount: number;
  oldTimestamp: Date;
}

export interface MonthExpenseGroupEntity {
  monthIndex: number;
  year: number;
  monthExpenseArray: DayExpenseGroupEntity[];
}

export interface DayExpenseGroupEntity {
  calendarDate: Date;
  dayExpenseArray: ExpenseItemEntity[];
}

// BUDGET ENTITIES //

export interface BudgetItemEntity {
  category: string;
  amount: number;
  iconPath: string;
  group: string;
  timestamp: Date | null;
  id: number;
}

export interface PreviousBudgetBeingEdited {
  oldAmount: number;
  oldCategory: string;
  oldGroup: string;
  oldIconPath: string;
  id: number;
}
export interface BudgetCreationFormData {
  category: string;
  amount: number;
  iconPath: string;
  group: string;
}

export interface BudgetUpdatingFormData {
  category: string;
  amount: number | string;
  group: string;
  iconPath: string;
}

// GROUP ENTITIES

export interface GroupItemEntity {
  group: string;
  colour: string;
  timestamp: Date;
  id: number;
}

export interface BasicGroupData {
  group: string;
  colour: string | null;
}

export interface PreviousGroupBeingEdited {
  oldColour: string;
  oldGroupName: string;
  oldId: number;
}

// TOOLS ENTITIES //

export type RecurringExpenseFrequency = "never" | "daily" | "weekly" | "fortnightly" | "monthly" | "annually";

export interface RecurringExpenseItemEntity {
  recurringExpenseId: string;
  category: string;
  amount: number;
  timestamp: Date;
  frequency: RecurringExpenseFrequency;
}

export interface PreviousRecurringExpenseBeingEdited {
  recurringExpenseId: string;
  oldCategory: string;
  oldAmount: number;
  oldTimestamp: Date;
  oldFrequency: RecurringExpenseFrequency;
}

export interface RecurringExpenseUpdatingFormData {
  category: string;
  amount: number;
  timestamp: Value;
  frequency: RecurringExpenseFrequency;
}

export interface BlacklistedExpenseItemEntity {
  recurringExpenseId: string;
  timestampOfRemovedInstance: Date;
}

export interface ToolsFormVisibility {
  isUpdateProfileIconFormVisible: boolean;
}

// MISCELLANEOUS ENTITIES //

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserPreferences {
  currency: string;
  createdAt: Date;
  darkModeEnabled: boolean;
  accessibilityEnabled: boolean;
  profileIconFileName: string;
  prefersUploadedAvatar: boolean;
}

export type CategoryToIconAndColourMap = Map<string, { iconPath: string; colour: string }>;

export const loaderCssOverride = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export interface ContactFormData {
  queryType: string;
  subject: string;
  description: string;
  firstName: string;
  email: string;
}

export interface DropdownSelectorOption {
  value: string;
  label: string;
  colour: string;
}

export type ActiveChart = "categoryPieChart" | "groupPieChart" | "groupRadarChart";
