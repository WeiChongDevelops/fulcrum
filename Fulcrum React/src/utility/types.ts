//  EXPENSE ENTITIES //
import { Dispatch, SetStateAction } from "react";

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

// FORM AND MODAL VISIBILITY ENTITIES //

export interface BudgetFormVisibility {
  isCreateBudgetVisible: boolean;
  isUpdateBudgetVisible: boolean;
  isCreateGroupVisible: boolean;
  isUpdateGroupVisible: boolean;
}

export interface BudgetModalVisibility {
  showChooseDeleteGroupOptionModal: boolean;
  showConfirmDeleteGroupModal: boolean;
  showConfirmDeleteCategoryModal: boolean;
  showDataVisModal: boolean;
}

export interface ExpenseFormVisibility {
  isCreateExpenseVisible: boolean;
  isUpdateExpenseVisible: boolean;
  isUpdateRecurringExpenseInstanceVisible: boolean;
}

export interface ExpenseModalVisibility {
  isConfirmExpenseDeletionModalVisible: boolean;
}

// TOOLS ENTITIES //

export type OpenToolsSection = "home" | "settings" | "recurring";

export type RecurringExpenseFrequency = "never" | "daily" | "weekly" | "fortnightly" | "monthly" | "annually";

export interface RecurringExpenseItemEntity {
  recurringExpenseId: string;
  category: string;
  amount: number;
  timestamp: Date;
  frequency: RecurringExpenseFrequency;
}

export interface RecurringExpenseModalVisibility {
  isConfirmRecurringExpenseDeletionModalVisible: boolean;
  isSelectRecurringExpenseDeletionTypeModalVisible: boolean;
}

export interface RecurringExpenseFormVisibility {
  isCreateExpenseVisible: boolean;
  isUpdateRecurringExpenseVisible: boolean;
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

export interface SettingsModalVisibility {
  isConfirmExpenseWipeModalVisible: boolean;
  isConfirmBudgetWipeModalVisible: boolean;
  isConfirmAllDataWipeModalVisible: boolean;
  isConfirmBudgetResetModalVisible: boolean;
}

export interface SettingsFormVisibility {
  typeDeleteMyExpensesForm: boolean;
  typeDeleteMyBudgetForm: boolean;
  typeDeleteMyDataForm: boolean;
  typeResetMyAccountForm: boolean;
}

export interface BlacklistedExpenseItemEntity {
  recurringExpenseId: string;
  timestampOfRemovedInstance: Date;
}

export interface ProfileIconUpdatingFormData {
  iconPath: string;
}

export interface ToolsFormVisibility {
  isUpdateProfileIconFormVisible: boolean;
}

// MISCELLANEOUS ENTITIES //

export type ModalVisibility =
  | BudgetModalVisibility
  | ExpenseModalVisibility
  | RecurringExpenseModalVisibility
  | SettingsModalVisibility;

export type SetModalVisibility<T extends ModalVisibility> = Dispatch<SetStateAction<T>>;

export type FormVisibility =
  | BudgetFormVisibility
  | ExpenseFormVisibility
  | RecurringExpenseFormVisibility
  | SettingsFormVisibility
  | ToolsFormVisibility;

export type SetFormVisibility<T extends FormVisibility> = Dispatch<SetStateAction<T>>;

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PublicUserData {
  currency: string;
  createdAt: Date;
  darkModeEnabled: boolean;
  accessibilityEnabled: boolean;
  profileIconFileName: string;
}

export type CategoryToIconGroupAndColourMap = Map<string, { iconPath: string; group: string; colour: string }>;

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
