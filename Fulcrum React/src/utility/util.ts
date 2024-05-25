import { ChangeEvent, createContext, Dispatch, RefObject, SetStateAction, useContext } from "react";
import { v4 as uuid } from "uuid";
import { UseMutateFunction } from "@tanstack/react-query";
import {
  BasicGroupData,
  BlacklistedExpenseItemEntity,
  BudgetCreationFormData,
  BudgetItemEntity,
  BudgetModalVisibility,
  BudgetUpdatingFormData,
  CategoryToIconGroupAndColourMap,
  DayExpenseGroupEntity,
  ExpenseCreationFormData,
  ExpenseItemEntity,
  ExpenseUpdatingFormData,
  FormVisibility,
  GroupItemEntity,
  ModalVisibility,
  MonthExpenseGroupEntity,
  RecurringExpenseFrequency,
  RecurringExpenseItemEntity,
  SelectorOptionsFormattedData,
  SetFormVisibility,
  SetModalVisibility,
} from "./types.ts";
import {
  HandHeart,
  Drop,
  PiggyBank,
  Martini,
  CarProfile,
  Money,
  Lightning,
  Gift,
  Heartbeat,
  HouseLine,
  FilmStrip,
  MusicNotes,
  PawPrint,
  GasPump,
  AirplaneTilt,
  TShirt,
  Wrench,
  Train,
  Orange,
  ShoppingCart,
  FireExtinguisher,
  BowlFood,
  Barbell,
  Pill,
  Users,
  Devices,
  Volleyball,
  Television,
  ForkKnife,
  WifiHigh,
  Coin,
} from "@phosphor-icons/react";
import { Location } from "react-router-dom";

// GLOBAL VARIABLES //

export const expenseStartDate = new Date("2020-01-01T00:00:00Z");
export const DEFAULT_GROUP_COLOUR = "#3f4240";
// export const DEFAULT_CATEGORY_ICON = "category-default-icon.svg";
export const DEFAULT_CATEGORY_ICON = "Coin";
export const DEFAULT_CATEGORY_GROUP = "Miscellaneous";

// CONTEXT //

export const EmailContext = createContext<string>("");
export const useEmail = () => useContext(EmailContext);
export const LocationContext = createContext<Location | null>(null);
export const useLocation = () => useContext(LocationContext);

export const SideBarIsOpenContext = createContext<boolean>(true);
export const useSideBarIsOpen = () => useContext(SideBarIsOpenContext);

// export const SetBudgetModalStateContext = createContext<BudgetModalVisibility>({
//   showChooseDeleteGroupOptionModal: false,
//   showConfirmDeleteGroupModal: false,
//   showConfirmDeleteCategoryModal: false,
//   showDataVisModal: false,
// });
export const SetBudgetModalVisibilityContext = createContext<Dispatch<SetStateAction<BudgetModalVisibility>> | undefined>(
  undefined,
);

export const useSetBudgetModalVisibility = () => useContext(SetBudgetModalVisibilityContext);

// SELECTOR CONTENT ARRAYS //

export const groupColourArray = [
  "#fee2e2",
  "#ffedd5",
  "#fef3c7",
  "#fef9c3",
  "#ecfccb",
  "#dcfce7",
  "#d1fae5",
  "#ccfbf1",
  "#cffafe",
  "#e0f2fe",
  "#dbeafe",
  "#e0e7ff",
  "#ede9fe",
  "#f3e8ff",
  "#fae8ff",
  "#e3e3e3",
];

export const categoryIconArray = [
  "category-bank-icon.svg",
  "category-water-icon.svg",
  "category-pig-icon.svg",
  "category-beer-icon.svg",
  "category-car-icon.svg",
  "category-cash-icon.svg",
  "category-electricity-icon.svg",
  "category-gift-icon.svg",
  "category-health-icon.svg",
  "category-house-icon.svg",
  "category-movie-icon.svg",
  "category-music-icon.svg",
  "category-pet-icon.svg",
  "category-petrol-icon.svg",
  "category-plane-icon.svg",
  "category-shirt-icon.svg",
  "category-tool-icon.svg",
  "category-train-icon.svg",
  "category-apple-icon.svg",
  "category-cart-icon.svg",
  "category-emergency-icon.svg",
  "category-fastfood-icon.svg",
  "category-gym-icon.svg",
  "category-meds-icon.svg",
  "category-people-icon.svg",
  "category-phone-icon.svg",
  "category-soccer-icon.svg",
  "category-tv-icon.svg",
  "category-utensils-icon.svg",
  "category-wifi-icon.svg",
];

export const profileIconArray = [
  "profile-icon-default.svg",
  "profile-icon-partners.svg",
  "profile-icon-family.svg",
  "profile-icon-household.svg",
  "profile-icon-business.svg",
  "profile-icon-country.svg",
];

// FORMATTING FUNCTIONS //

/**
 * Capitalises the first letter of a given string.
 * @param str - The string to capitalise.
 * @returns The string with the first letter capitalised.
 */
export function capitaliseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Retrieves the currency symbol for a given currency code.
 * @param currency - The currency code (e.g., "USD", "AUD", "GBP").
 * @returns The symbol associated with the given currency code.
 */
export function getCurrencySymbol(currency: string): string {
  let currencySymbol;
  switch (currency) {
    case "USD":
      currencySymbol = "$";
      break;
    case "AUD":
      currencySymbol = "$";
      break;
    case "GBP":
      currencySymbol = "£";
      break;
    case "KRW":
      currencySymbol = "₩";
      break;
    case "JPY":
      currencySymbol = "¥";
      break;
    case "CNY":
      currencySymbol = "¥";
      break;
    default:
      currencySymbol = "$";
      break;
  }
  return currencySymbol;
}

/**
 * Formats a numeric amount into a currency string in manner friendly to static displays & unfriendly to dynamic inputs
 * @param amount - The numeric amount to format.
 * @param currency - The currency code to use for determining the currency symbol.
 * @returns A formatted string representing the amount in the specified currency.
 */
export function formatDollarAmountStatic(amount: number, currency: string): string {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  let currencySymbol = getCurrencySymbol(currency);
  return currencySymbol + formattedNumber;
}

/**
 * Formats a numeric amount into a currency string in manner friendly to dynamic input fields
 * @param amount - The numeric amount to format.
 * @returns A formatted string representing the amount without a currency symbol
 */
export function formatDollarAmountDynamic(amount: string): string {
  // Remove anything not a number or '.'
  const cleanedValue = amount.replace(/[^\d.]/g, "");

  const splitValue = cleanedValue.split(".");
  if (splitValue.length >= 2 && splitValue[1].length > 2) {
    splitValue[1] = splitValue[1].substring(0, 2);
  }
  return splitValue.join(".");
}

/**
 * Determines the ordinal suffix for a given day of the month.
 * @param day - The day of the month.
 * @returns The ordinal suffix ('st', 'nd', 'rd', 'th') appropriate for the given day.
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Formats a Date object into a human-readable string following Australian conventions.
 * @param date - The Date object to format.
 * @returns A string representing the formatted date, including the day of the week,
 *          the ordinal day of the month, the month name, and the year.
 */
export function formatDate(date: Date): string {
  const formattedDayOfWeek = new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
  }).format(date);
  const formattedDayOfMonth = date.getDate();
  const formattedMonth = new Intl.DateTimeFormat("en-AU", {
    month: "long",
  }).format(date);
  const formattedYear = new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
  }).format(date);

  const ordinalSuffix = getOrdinalSuffix(formattedDayOfMonth);

  return `${formattedDayOfWeek}, ${formattedDayOfMonth}${ordinalSuffix} ${formattedMonth} ${formattedYear}`;
}

// ICON AND COLOUR SELECTOR IMPLEMENTATIONS //

/**
 * Adds click event listeners to icon elements for icon selection functionality.
 * @template T - A generic type extending an object that optionally includes an iconPath property.
 * @param setFormData - Dispatch function that updates state for selected icon.
 * @param selectorType - The base part of the class name used to select icon elements.
 * @return - A cleanup function for the event listeners
 */
export function addIconSelectionFunctionality<T extends { iconPath?: string }>(
  setFormData: Dispatch<SetStateAction<T>>,
  selectorType: string,
): () => void {
  // Get array of icons and initialise array of listeners (for later cleanup)
  const icons: NodeListOf<HTMLImageElement> = document.querySelectorAll(`.${selectorType}-icon-selectable`);
  const listeners: Array<{ element: Element; handler: (event: any) => void }> = [];

  // Iterate over each icon to add click event listeners
  icons.forEach((icon): void => {
    const eventHandler = (e: MouseEvent) => {
      e.preventDefault(); // Prevent default action

      // Retrieve the icon's path from its data-value attribute
      const iconPath = icon.getAttribute("data-value")!;
      if (!iconPath) return; // Exit if iconPath is null or undefined

      // Update the form data with the selected icon's path
      setFormData((currentFormData) => ({
        ...currentFormData,
        iconPath: iconPath,
      }));

      // Visual feedback for icon selection
      icons.forEach((icon2) => icon2.classList.remove("selected-icon"));
      icon.classList.add("selected-icon");
      console.log(`iconPath: ${iconPath}`);
    };
    icon.addEventListener("click", eventHandler);
    listeners.push({ element: icon, handler: eventHandler });
  });
  return () => {
    listeners.forEach(({ element, handler }) => {
      element.removeEventListener("click", handler);
    });
  };
}

/**
 * Adds click event listeners to colour selection elements for group colour selection functionality.
 * @param setFormData - Dispatch function to update state for the selected colour.
 */
export function addColourSelectionFunctionality(setFormData: Dispatch<SetStateAction<BasicGroupData>>): () => void {
  // Query all colour selection containers
  const colourElementList: NodeListOf<HTMLImageElement> = document.querySelectorAll(".group-colour-selectable-container");
  const listeners: Array<{ element: Element; handler: (event: any) => void }> = [];

  // Iterate over each colour selection container to add click event listeners
  colourElementList.forEach((colourSelectable) => {
    const eventHandler = (e: MouseEvent) => {
      // Prevent the default action of the event
      e.preventDefault();

      // Update form data with the selected colour's value
      const triangleElement = colourSelectable.firstChild as HTMLDivElement;
      setFormData((current: BasicGroupData) => ({
        ...current,
        ["colour"]: triangleElement.getAttribute("data-value"), // Extract colour value
      }));

      // Visual feedback
      colourElementList.forEach((colourSelectable) => {
        const triangle = colourSelectable.firstChild as HTMLDivElement;
        triangle.classList.remove("selectedColour");
      });
      triangleElement.classList.add("selectedColour");
    };
    colourSelectable.addEventListener("click", eventHandler);
    listeners.push({ element: colourSelectable, handler: eventHandler });
  });
  return () => {
    listeners.forEach(({ element, handler }) => {
      element.removeEventListener("click", handler);
    });
  };
}

// SORTING FUNCTIONS //

/**
 * Sorts group items based on custom indexing, placing the default category group at the end.
 * @param a - The first group item for comparison.
 * @param b - The second group item for comparison.
 * @returns Sorting order value.
 */
export function groupSort(a: GroupItemEntity, b: GroupItemEntity): number {
  // if (a.group === DEFAULT_CATEGORY_GROUP) return 1;
  // if (b.group === DEFAULT_CATEGORY_GROUP) return -1;
  // return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  return a.id < b.id ? -1 : 1;
}

/**
 * Sorts expense items by their timestamps in descending order.
 * @param expenseItemA - The first expense item for comparison.
 * @param expenseItemB - The second expense item for comparison.
 * @returns Sorting order value.
 */
export function expenseSort(expenseItemA: ExpenseItemEntity, expenseItemB: ExpenseItemEntity): number {
  return new Date(expenseItemB.timestamp).getTime() - new Date(expenseItemA.timestamp).getTime();
}

/**
 * Sorts budget items by their timestamps in ascending order.
 * Logs errors to console if timestamps are invalid.
 * @param budgetItemA - The first budget item for comparison.
 * @param budgetItemB - The second budget item for comparison.
 * @returns Sorting order value, or logs error if timestamp conversion fails.
 */
export function budgetSort(budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity): number {
  return new Date(budgetItemA.timestamp!).getTime() - new Date(budgetItemB.timestamp!).getTime();
}

/**
 * Groups category options in the selector, by group.
 */
export function categoryOptionSort(
  optionA: { value: string; label: string; colour: string },
  optionB: { value: string; label: string; colour: string },
) {
  if (!!optionA.colour && !!optionB.colour) {
    if (optionA.colour > optionB.colour) {
      return -1;
    }
    if (optionA.colour < optionB.colour) {
      return 1;
    }
  }
  return 0;
}

// SELECTOR OPTIONS AND STYLING //

export const faqData = [
  {
    question: "How do I sign up for Fulcrum?",
    answer: "You can sign up through our website by clicking on the 'Sign Up for Free' button!",
  },
  {
    question: "What is Fulcrum used for?",
    answer:
      "Fulcrum offers budget construction and organisation, as well as expense logging, for one-time and recurring expenses.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team through the contact form on our website.",
  },
  {
    question: "Is there a mobile app available?",
    answer: "No, Fulcrum doesn't have a mobile app available yet - development of an iOS app for the App Store is underway!",
  },
  {
    question: "How do I delete my account?",
    answer:
      "To delete your account, please contact our customer support team directly through our contact form on the website.",
  },
];

export const recurringFrequencyOptions = [
  {
    value: "never",
    label: "Never",
    colour: "black",
  },
  {
    value: "daily",
    label: "Daily",
    colour: "black",
  },
  {
    value: "weekly",
    label: "Weekly",
    colour: "black",
  },
  {
    value: "fortnightly",
    label: "Fortnightly",
    colour: "black",
  },
  {
    value: "monthly",
    label: "Monthly",
    colour: "black",
  },
  {
    value: "annually",
    label: "Annually",
    colour: "black",
  },
];

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

export const colourStyles = {
  control: (styles: any) => ({
    ...styles,
    fontSize: 12,
    fontWeight: "medium",
    backgroundColor: "white",
    maxHeight: "0.5rem",
    borderRadius: "calc(var(--radius) - 2px)",
    borderWidth: "0.5px",
  }),
  option: (styles: any, { data }: any) => {
    return {
      ...styles,
      color: data.colour,
      fontSize: 12,
      fontWeight: "medium",
      filter: "brightness(65%)",
    };
  },
  input: (styles: any) => ({ ...styles, ...dot() }),
  placeholder: (styles: any) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles: any, { data }: any) => ({
    ...styles,
    ...dot(data.colour),
  }),
  valueContainer: (styles: any) => ({ ...styles, padding: 0, margin: 0 }),
};

/**
 * Converts an array of budget category groups into the selector options format.
 * @param groupArray - The array of budget category groups to convert.
 */
export function groupListAsOptions(groupArray: GroupItemEntity[]): SelectorOptionsFormattedData[] {
  return groupArray.map((groupItemEntity) => {
    return {
      value: groupItemEntity.group,
      label: groupItemEntity.group,
      colour: groupItemEntity.colour,
    };
  });
}

/**
 * Converts an array of budget categories into the selector options format, with colour data derived from their group.
 * @param budgetArray - The array of budget categories to convert.
 * @param groupArray - The array of budget category groups.
 */
export function categoryListAsOptions(budgetArray: BudgetItemEntity[], groupArray: GroupItemEntity[]) {
  return budgetArray
    .map((budgetItemEntity) => {
      const groupOfCategory = getGroupOfCategory(budgetArray, budgetItemEntity.category);
      return {
        value: budgetItemEntity.category,
        label: budgetItemEntity.category,
        colour: groupOfCategory ? getColourOfGroup(groupOfCategory, groupArray) : "#17423f",
      };
    })
    .sort(categoryOptionSort);
}

export const currencyOptions = [
  { label: "$AUD", value: "AUD" },
  { label: "$USD", value: "USD" },
  { label: "£GBP", value: "GBP" },
  { label: "₩KRW", value: "KRW" },
  { label: "¥JPY", value: "JPY" },
  { label: "¥CNY", value: "CNY" },
];

export const queryTypeOptions = [
  {
    value: "reportIssue",
    label: "Report Issue",
    colour: "black",
  },
  {
    value: "accountInquiry",
    label: "Account Inquiry",
    colour: "black",
  },
  {
    value: "deleteAccount",
    label: "Account Deletion Request",
    colour: "black",
  },
  {
    value: "generalInquiry",
    label: "General Inquiry",
    colour: "black",
  },
];

export const categoryIconComponentMap: { [key: string]: React.FC } = {
  HandHeart,
  Drop,
  PiggyBank,
  Martini,
  CarProfile,
  Money,
  Lightning,
  Gift,
  Heartbeat,
  HouseLine,
  FilmStrip,
  MusicNotes,
  PawPrint,
  GasPump,
  AirplaneTilt,
  TShirt,
  Wrench,
  Train,
  Orange,
  ShoppingCart,
  FireExtinguisher,
  BowlFood,
  Barbell,
  Pill,
  Users,
  Devices,
  Volleyball,
  Television,
  ForkKnife,
  WifiHigh,
  Coin,
};

// DYNAMIC SIZING FUNCTIONS //

/**
 * Dynamically sizes the font of budget name displays based on their length.
 */
export function dynamicallySizeBudgetNameDisplays(): void {
  const budgetNameElements = document.querySelectorAll(".budget-name") as NodeListOf<HTMLElement>;
  budgetNameElements.forEach((budgetNameElement) => {
    const budgetNameText = budgetNameElement.textContent;

    let dynamicFontSize = "";
    const budgetNameLength = budgetNameText?.length!;

    if (budgetNameLength <= 5) {
      dynamicFontSize = "1.4rem";
    } else if (budgetNameLength <= 9) {
      dynamicFontSize = "1.2rem";
    } else if (budgetNameLength <= 14) {
      dynamicFontSize = "1.1rem";
    } else if (budgetNameLength <= 18) {
      dynamicFontSize = "1rem";
    }
    budgetNameElement.style.fontSize = dynamicFontSize;

    if (budgetNameText?.split(" ")[0].length! >= 12) {
      budgetNameElement.textContent = budgetNameText!.slice(0, 11) + "\n...";
    }
  });
}

/**
 * Dynamically sizes the font of budget number displays based on their length.
 */
export function dynamicallySizeBudgetNumberDisplays(): void {
  const budgetNumberElements = document.querySelectorAll(".budgeting-values-container") as NodeListOf<HTMLElement>;
  budgetNumberElements.forEach((budgetNumberElement) => {
    let dynamicFontSize = "0.6rem";
    const budgetNumberFirstLine = budgetNumberElement.firstChild! as HTMLElement;
    const budgetNumberLength = budgetNumberFirstLine.textContent?.length;
    if (budgetNumberLength) {
      if (budgetNumberLength <= 28) {
        dynamicFontSize = "0.875rem";
      } else if (budgetNumberLength <= 32) {
        dynamicFontSize = "0.78rem";
      } else if (budgetNumberLength <= 40) {
        dynamicFontSize = "0.68rem";
      }
    }
    budgetNumberElement.style.fontSize = dynamicFontSize;
  });
}

// OTHER UTILITY FUNCTIONS AND DATA //

export const monthStringArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Determines if a recurring expense lands on a specified day.
 * @param timestamp - The timestamp of the recurring expense.
 * @param frequency - The frequency of the recurring expense.
 * @param dateToAnalyseForExpenseLanding - The date to check for expense landing.
 * @returns True if the expense lands on the given day, false otherwise.
 */
export function recurringExpenseLandsOnDay(
  timestamp: Date,
  frequency: RecurringExpenseFrequency,
  dateToAnalyseForExpenseLanding: Date,
): boolean {
  const creationDate = new Date(timestamp);
  creationDate.setHours(0, 0, 0, 0);
  dateToAnalyseForExpenseLanding.setHours(0, 0, 0, 0);

  // Calculate the difference in days between the dates
  const diffTime = Math.abs(dateToAnalyseForExpenseLanding.getTime() - creationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  // Determine if the expense lands on the given day based on its frequency
  switch (frequency) {
    case "daily":
      return true;
    case "weekly":
      return diffDays % 7 === 0;
    case "fortnightly":
      return diffDays % 14 === 0;
    case "monthly":
      return creationDate.getDate() === dateToAnalyseForExpenseLanding.getDate();
    case "annually":
      return (
        creationDate.getDate() === dateToAnalyseForExpenseLanding.getDate() &&
        creationDate.getMonth() === dateToAnalyseForExpenseLanding.getMonth()
      );
    default:
      return false;
  }
}

/**
 * Retrieves the next instance of a recurring expense.
 * @param timestamp - The timestamp of the recurring expense.
 * @param frequency - The frequency of the recurring expense.
 */
export function getNextRecurringInstance(timestamp: Date, frequency: RecurringExpenseFrequency): Date | null {
  const [startDate, endDate] = [new Date(), new Date()];
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 366);

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    if (recurringExpenseLandsOnDay(timestamp, frequency, date)) {
      return date;
    }
  }
  return null;
}

/**
 * Get random colour for a budget category group.
 * @returns A random colour from the groupColourArray.
 */
export function getRandomGroupColour(): string {
  const randomColourIndex = Math.floor(Math.random() * groupColourArray.length);
  return groupColourArray[randomColourIndex];
}

/**
 * Get the total budget for a budget category group.
 * @param filteredBudgetArray - An array of the budget items in a given group.
 * @returns The total budget within the group.
 */
export function getGroupBudgetTotal(filteredBudgetArray: BudgetItemEntity[]): number {
  return filteredBudgetArray.map((budgetItem) => budgetItem.amount).reduce((acc, amountSpent) => acc + amountSpent, 0);
}

/**
 * Checks if a given timestamp falls in the current month.
 * @param timestamp - The date to check against the current month.
 * @returns true if the date is within the current month.
 */
export function isCurrentMonth(timestamp: Date): boolean {
  return (
    new Date(timestamp).getMonth() === new Date().getMonth() &&
    new Date(timestamp).getFullYear() === new Date().getFullYear()
  );
}

/**
 * Identifies the highest group sorting index excluding Miscellaneous.
 * @param groupArray - The group array.
 * @returns The largest sort index.
 */
export function getHighestGroupSortIndex(groupArray: GroupItemEntity[]) {
  return maxNumber(groupArray.map((groupItem) => groupItem.id));
}

/**
 * Returns the largest numerical value in a specified array, given that the value is below 999.
 * @param numArray - The array in which to search for the largest value.
 * @returns The largest value
 */
function maxNumber(numArray: number[]) {
  return numArray.reduce((max, num) => (num > max && num < 999 ? num : max), numArray[0]);
}

/**
 * Get the total expenditure within a budget category group.
 * @param expenseArray - An array of expense items within a given group.
 * @param filteredBudgetArray - An array of the budget items in a given group.
 * @returns The total expenditure within the group.
 */
export function getGroupExpenditureTotal(
  expenseArray: ExpenseItemEntity[],
  filteredBudgetArray: BudgetItemEntity[],
): number {
  const categoriesInGroup = filteredBudgetArray.map((expenseItem) => expenseItem.category);
  const filteredExpenseArray = expenseArray.filter((expenseItem) => categoriesInGroup.includes(expenseItem.category));
  return filteredExpenseArray.reduce(
    (acc, expenseItem) => acc + (isCurrentMonth(expenseItem.timestamp) ? expenseItem.amount : 0),
    0,
  );
}

/**
 * Get the group of a given category.
 * @param budgetArray - The array of budget items.
 * @param category - The category to search for.
 * @returns The group of the given category, or null if not found.
 */
export function getGroupOfCategory(budgetArray: BudgetItemEntity[], category: string): string | null {
  const budgetItem = budgetArray.filter((budgetItemEntity) => budgetItemEntity.category === category)[0];
  return budgetItem.group ? budgetItem.group : null;
}

/**
 * Get the colour of a given group.
 * @param groupName - The name of the group to search for.
 * @param groupArray - The array of group items.
 * @returns The colour of the given group, or null if not found.
 */
export function getColourOfGroup(groupName: string, groupArray: GroupItemEntity[]): string | null {
  const group = groupArray.find((groupItemEntity) => groupItemEntity.group === groupName);
  return !!group ? group.colour : null;
}

/**
 * Get the total amount budgeted across all categories in all groups.
 * @param budgetArray - The array of budget items.
 * @returns The total amount budgeted across all categories in all groups.
 */
export function getTotalAmountBudgeted(budgetArray: BudgetItemEntity[]): number {
  const amountArray = budgetArray.map((budgetItem) => budgetItem.amount);
  return amountArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

/**
 * Get the data map for category to icon, group, and colour.
 * @param budgetArray - The array of budget items.
 * @param groupArray - The array of group items.
 * @returns The map of category to icon, group, and colour.
 */
export async function getGroupAndColourMap(budgetArray: BudgetItemEntity[], groupArray: GroupItemEntity[]) {
  const categoryToGroupAndColourMap: CategoryToIconGroupAndColourMap = new Map();
  budgetArray.forEach((budgetItem) => {
    categoryToGroupAndColourMap.set(budgetItem.category, {
      iconPath: budgetItem.iconPath,
      group: budgetItem.group,
      colour: groupArray.find((groupItem) => groupItem.group === budgetItem.group)!.colour,
    });
  });
  return categoryToGroupAndColourMap;
}

/**
 * Get the line angle of the Fulcrum scale animation.
 * @param amountLeftToBudget - The amount of income yet to be budgeted.
 * @param totalIncome - The total monthly income of the user.
 * @returns The line angle of the animation.
 */
export function getLineAngle(amountLeftToBudget: number, totalIncome: number): number {
  const percentageIncomeRemaining = (amountLeftToBudget / totalIncome) * 100;

  const functionalPercentageIncomeRemaining =
    percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining;
  return functionalPercentageIncomeRemaining === -100
    ? 14.5
    : functionalPercentageIncomeRemaining === 100
      ? -14.5
      : functionalPercentageIncomeRemaining / (-100 / 14.5);
}

/**
 * Handle the input change on a form with a formatted amount input field.
 * @param e - The input change event.
 * @param setFormData - The state update function.
 */
export function handleInputChangeOnFormWithAmount(
  e: ChangeEvent<HTMLInputElement>,
  setFormData: Dispatch<SetStateAction<any>>,
): void {
  let newFormValue: string;
  if (e.target.name === "amount") {
    if (e.target.value === "") {
      newFormValue = "";
    } else {
      newFormValue = formatDollarAmountDynamic(e.target.value);
    }
  } else {
    newFormValue = e.target.value;
  }
  if (
    e.target.name != "amount" ||
    e.target.value == "" ||
    (e.target.name === "amount" && parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 9999999.99)
  ) {
    setFormData(
      (
        currentFormData: BudgetCreationFormData | BudgetUpdatingFormData | ExpenseCreationFormData | ExpenseUpdatingFormData,
      ) => {
        return { ...currentFormData, [e.target.name]: newFormValue };
      },
    );
  }
}

/**
 * Check if any modal or form is open.
 * @param  formVisibility - The visibility of the expense form.
 * @param  modalVisibility - The visibility of the expense modal.
 * @returns True if any modal or form is open, false otherwise.
 */
export function checkForOpenModalOrForm(formVisibility: FormVisibility, modalVisibility: ModalVisibility) {
  return Object.values(formVisibility).includes(true) || Object.values(modalVisibility).includes(true);
}

/**
 * Gets the end of the window location url
 * @returns The end of the open url.
 */
export function getWindowLocation(): string {
  const urlArray = window.location.href.split("/");
  return urlArray[urlArray.length - 1];
}

/**
 * Checks if there is a matching blacklist record for a recurring expense on a given date.
 * @param blacklistedExpenseInstances - The blacklist.
 * @param recurringExpenseItem - The recurring expense item to check.
 * @param date - The date to check for a matching blacklist record.
 * @returns True if a matching blacklist record is found, false otherwise.
 */
export function matchingBlacklistEntryFound(
  blacklistedExpenseInstances: BlacklistedExpenseItemEntity[],
  recurringExpenseItem: RecurringExpenseItemEntity,
  date: Date,
): boolean {
  const checkResult = blacklistedExpenseInstances.find((blacklistedExpense) => {
    return (
      blacklistedExpense.recurringExpenseId === recurringExpenseItem.recurringExpenseId &&
      new Date(blacklistedExpense.timestampOfRemovedInstance).toLocaleDateString() === new Date(date).toLocaleDateString()
    );
  });
  return checkResult !== undefined;
}

/**
 * Gets the number of months from a given month and year to the current month and year.
 * @param month - The month to compare.
 * @param year - The year to compare.
 * @returns The number of months from the given month and year to the current month and year.
 */
export function getMonthsFromToday(month: number, year: number): number {
  const dateToday = new Date();
  const currentMonth = dateToday.getMonth();
  const currentYear = dateToday.getFullYear();
  return 12 * (currentYear - year) + currentMonth - month;
}

/**
 * Creates the structured expense data using the data from the expense array.
 * @param expenseArray - The array of expense items.
 * @returns The structured expense data.
 */
export async function getStructuredExpenseData(expenseArray: ExpenseItemEntity[]) {
  const structuredExpenseData = await initialiseStructuredExpenseData();
  return populateStructuredExpenseData(expenseArray, structuredExpenseData);
}

/**
 * Initialises the stratified expense data structure from expenseStartDate to a year from today; no expense data is populated.
 * @returns The initialised structured expense data.
 */
async function initialiseStructuredExpenseData(): Promise<MonthExpenseGroupEntity[]> {
  let newStructuredExpenseData: MonthExpenseGroupEntity[] = [];

  const y2KMonth = expenseStartDate.getMonth();
  const y2KYear = expenseStartDate.getFullYear();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);

  for (let i = -monthsFromY2KToNow; i <= 12; i++) {
    const monthIndex = (currentMonth + i + 1200) % 12;
    const yearAdjustment = Math.floor((currentMonth + i) / 12);
    const year = currentYear + yearAdjustment;

    const newMonthExpenseGroup: MonthExpenseGroupEntity = {
      monthIndex: monthIndex,
      year: year,
      monthExpenseArray: [],
    };
    newStructuredExpenseData = [...newStructuredExpenseData, newMonthExpenseGroup];
  }
  return newStructuredExpenseData;
}

/**
 * Populates the initialised expense data structure with expense data.
 * @param expenseArray - The array of expenses used for data population.
 * @param newStructuredExpenseData - The initialised data structure to populate.
 * @returns The populated expense data structure.
 */
function populateStructuredExpenseData(
  expenseArray: ExpenseItemEntity[],
  newStructuredExpenseData: MonthExpenseGroupEntity[],
): MonthExpenseGroupEntity[] {
  if (!!expenseArray && expenseArray.length !== 0) {
    for (const expenseItem of expenseArray) {
      for (let monthExpenseGroupItem of newStructuredExpenseData) {
        if (
          monthExpenseGroupItem.monthIndex === new Date(expenseItem.timestamp).getMonth() &&
          monthExpenseGroupItem.year === new Date(expenseItem.timestamp).getFullYear()
        ) {
          let matchingDayGroupExists = false;
          for (let dayExpenseGroupItem of monthExpenseGroupItem.monthExpenseArray) {
            if (
              new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString() ===
              new Date(expenseItem.timestamp).toLocaleDateString()
            ) {
              // console.log(`Adding expense to old group on ${new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString()}`);
              dayExpenseGroupItem.dayExpenseArray = [...dayExpenseGroupItem.dayExpenseArray, expenseItem];
              matchingDayGroupExists = true;
              break;
            }
          }
          if (matchingDayGroupExists) {
            break;
          }
          // Otherwise, make a new DayExpenseGroupEntity for the expenseItem's day and add it in.
          // console.log(`Adding expense item to new group on ${new Date(expenseItem.timestamp).toLocaleDateString()}`);
          const startOfDayCalendarDate = new Date(expenseItem.timestamp);
          startOfDayCalendarDate.setHours(0, 0, 0, 0);

          const newDayExpenseGroup: DayExpenseGroupEntity = {
            calendarDate: startOfDayCalendarDate,
            dayExpenseArray: [expenseItem],
          };
          monthExpenseGroupItem.monthExpenseArray = [...monthExpenseGroupItem.monthExpenseArray, newDayExpenseGroup];
        }
      }
    }
  }
  return newStructuredExpenseData;
}

/**
 * Retrieves all instances of a recurring expense present in the expense array on a specified date.
 * @param expenseArray - The array of expense items to search.
 * @param recurringExpenseId - The ID of the recurring expense item to search for.
 * @param date - The date to search for expense instances.
 * @returns An array of expense items that are instances of the recurring expense on the given date, or null if none found.
 */
export function getRecurringExpenseInstancesOrNull(
  expenseArray: ExpenseItemEntity[],
  recurringExpenseId: string,
  date: Date,
): ExpenseItemEntity[] | null {
  const recurringExpenseInstances = expenseArray.filter((expenseItem: ExpenseItemEntity) => {
    return (
      expenseItem.recurringExpenseId === recurringExpenseId &&
      new Date(expenseItem.timestamp).toLocaleDateString() === new Date(date).toLocaleDateString()
    );
  });
  return recurringExpenseInstances.length > 0 ? recurringExpenseInstances : null;
}

/**
 * Updates the expenseArray's recurring expense instances, adding, removing or leaving instances as necessary.
 * @param recurringExpenseArray - The array of recurring expense items.
 * @param expenseArray - The array of expense items.
 * @param blacklistedExpenseArray - The array of blacklisted (removed) recurring expense instances.
 * @param batchDeleteExpenses - The mutation that batch deletes expenses.
 * @param batchCreateExpenses - The mutation that batch creates expenses.
 * @param expenseCreationIsSuccess - Whether the expense creation has completed without error.
 */
export function updateRecurringExpenseInstances(
  recurringExpenseArray: RecurringExpenseItemEntity[],
  expenseArray: ExpenseItemEntity[],
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[],
  batchDeleteExpenses: UseMutateFunction<unknown, Error, string[], { expenseArrayBeforeOptimisticUpdate: unknown }>,
  batchCreateExpenses: UseMutateFunction<
    unknown,
    Error,
    ExpenseItemEntity[],
    { expenseArrayBeforeOptimisticUpdate: unknown }
  >,
  expenseCreationIsSuccess: boolean,
): void {
  const { misplacedExpensesToRemove, newExpensesToAdd } = processRecurringExpenseInstances(
    recurringExpenseArray,
    expenseArray,
    blacklistedExpenseArray,
  );
  newExpensesToAdd.length !== 0 && batchCreateExpenses(newExpensesToAdd);
  (expenseCreationIsSuccess || newExpensesToAdd.length === 0) &&
    misplacedExpensesToRemove.size !== 0 &&
    batchDeleteExpenses(Array.from(misplacedExpensesToRemove));
}

/**
 * Takes a recurring expense, checks dates from its creation to today, then performs creation and deletion on instances as needed.
 * @param recurringExpenseArray - The array of recurring expenses.
 * @param expenseArray - The array of expenses.
 * @param blacklistedExpenseInstances - The array of blacklisted recurring expense instances (manually user-deleted).
 */
function processRecurringExpenseInstances(
  recurringExpenseArray: RecurringExpenseItemEntity[],
  expenseArray: ExpenseItemEntity[],
  blacklistedExpenseInstances: BlacklistedExpenseItemEntity[],
): {
  misplacedExpensesToRemove: Set<string>;
  newExpensesToAdd: ExpenseItemEntity[];
} {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  const misplacedExpensesToRemove = new Set<string>();
  const newExpensesToAdd = new Array<ExpenseItemEntity>();

  !!recurringExpenseArray &&
    recurringExpenseArray.forEach((recurringExpenseItem) => {
      let date = new Date(recurringExpenseItem.timestamp);

      while (date < today) {
        const expenseInstances = getRecurringExpenseInstancesOrNull(
          expenseArray,
          recurringExpenseItem.recurringExpenseId,
          date,
        );
        const isFrequencyMatch = recurringExpenseLandsOnDay(
          recurringExpenseItem.timestamp,
          recurringExpenseItem.frequency,
          date,
        );
        const expenseInstanceIsBlacklisted = blacklistedExpenseInstances
          ? matchingBlacklistEntryFound(blacklistedExpenseInstances, recurringExpenseItem, date)
          : false;
        // If recurring instance already exists on a day,
        if (expenseInstances != null) {
          let keepFirstInstance = true;
          // And this instance shouldn't have landed on this day (can happen when freq is changed),
          // Queue this and any duplicate instances on this day for removal
          if (!isFrequencyMatch) {
            keepFirstInstance = false;
          }
          // Otherwise only queue the duplicate instances on this day for removal
          for (let i = keepFirstInstance ? 1 : 0; i < expenseInstances.length; i++) {
            misplacedExpensesToRemove.add(expenseInstances[i].expenseId);
          }
        } else {
          // If: (1) There is no instance on this day, (2) it matches frequency patterns, and (3) it's not blacklisted,
          // Create an instance of this recurrence expense in the expense array
          if (isFrequencyMatch && !expenseInstanceIsBlacklisted) {
            const newExpenseItemLanded: ExpenseItemEntity = {
              expenseId: uuid(),
              category: recurringExpenseItem.category,
              amount: recurringExpenseItem.amount,
              timestamp: date,
              recurringExpenseId: recurringExpenseItem.recurringExpenseId,
            };
            newExpensesToAdd.push({
              ...newExpenseItemLanded,
              timestamp: new Date(newExpenseItemLanded.timestamp.getTime()),
            });
          }
        }
        date.setDate(date.getDate() + 1);
      }
    });
  return {
    misplacedExpensesToRemove,
    newExpensesToAdd,
  };
}

/**
 * Retrieves all of a given recurring expense's instances from a given date onwards.
 * @param recurringExpenseId - The ID of the recurringExpense to retrieve instances of.
 * @param expenseArray - The array of expense items.
 * @param startingFrom - The date from which instances are retrieved onwards.
 * @return An array of the requested expenses.
 */
export async function getRecurringExpenseInstancesAfterDate(
  recurringExpenseId: string,
  expenseArray: ExpenseItemEntity[],
  startingFrom: Date,
): Promise<ExpenseItemEntity[]> {
  const requestedExpenseList = new Set<ExpenseItemEntity>();
  for (const expenseItem of expenseArray) {
    if (
      expenseItem.recurringExpenseId === recurringExpenseId &&
      new Date(expenseItem.timestamp).getTime() >= new Date(startingFrom).getTime()
    ) {
      requestedExpenseList.add(expenseItem);
    }
  }
  return Array.from(requestedExpenseList);
}

/**
 * Changes the visibility of a particular form or modal, hiding or showing it.
 * @param setVisibility - The state updating function used to change visibility.
 * @param visibilityAttribute - The form/modal-specific identifier.
 * @param showNotHide - True if the caller wishes to show the form or modal, false if they wish to hide it.
 */
export function changeFormOrModalVisibility<T extends FormVisibility, U extends ModalVisibility>(
  setVisibility: SetFormVisibility<T> | SetModalVisibility<U>,
  visibilityAttribute: string,
  showNotHide: boolean,
): void {
  setVisibility((prevVisibility: any) => ({ ...prevVisibility, [visibilityAttribute]: showNotHide }));
}

/**
 * Enables form exit on 'Esc' keystroke or click outside form.
 * @param hideForm - The function that hides the form.
 * @param formRef - The reference of the form.
 * @returns The cleanup function that dismounts added event listeners.
 */
export function addFormExitListeners(hideForm: () => void, formRef: RefObject<HTMLDivElement>) {
  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  const handleEscPress = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      hideForm();
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscPress);

  return () => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscPress);
  };
}

/**
 * Provides given parameter values from the url given.
 * Function presumes url has fragment symbol.
 * @param url - The url from which to extract parameter values
 * @param paramKey - The parameter key, of which to find the value
 * @returns Request parameter.
 */
export function getParamFromFragmentURL(url: string, paramKey: string): string | null {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return null;

  const params = new URLSearchParams(url.slice(hashIndex + 1));
  return params.get(paramKey);
}
