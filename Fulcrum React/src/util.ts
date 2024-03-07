import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {v4 as uuid} from "uuid";

//  EXPENSE ENTITIES //
export interface ExpenseItemEntity {
    expenseId: string
    category: string
    amount: number
    timestamp: Date
    recurringExpenseId: string | null
}

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface ExpenseCreationFormData {
    category: string,
    amount: number
    timestamp: Value,
    frequency: RecurringExpenseFrequency
}

export interface ExpenseUpdatingFormData {
    category: string;
    amount: number;
    timestamp: Value;
}

export interface RecurringExpenseInstanceUpdatingFormData {
    category: string,
    amount: number
}


export interface PreviousExpenseBeingEdited {
    expenseId: string;
    recurringExpenseId: string | null;
    oldCategory: string;
    oldAmount: number;
    oldTimestamp: Date;
}

export interface MonthExpenseGroupEntity {
    monthIndex: number,
    year: number,
    // monthsFromToday: number,
    monthExpenseArray: DayExpenseGroupEntity[]
}

export interface DayExpenseGroupEntity {
    calendarDate: Date,
    dayExpenseArray: ExpenseItemEntity[]
}

// BUDGET ENTITIES //

export interface BudgetItemEntity {
    category: string
    amount: number
    iconPath: string
    group: string
    timestamp: Date | null;
}

export interface PreviousBudgetBeingEdited {
    oldAmount: number;
    oldCategory: string;
    oldGroup: string;
}
export interface BudgetCreationFormData {
    category: string,
    amount: number,
    iconPath: string,
    group: string
}

export interface BudgetUpdatingFormData {
    category: string;
    amount: number;
    group: string;
    iconPath: string;
}


// GROUP ENTITIES

export interface GroupItemEntity {
    group: string;
    colour: string;
    timestamp: Date;
}

export interface BasicGroupData {
    group: string;
    colour: string | null;
}

export interface PreviousGroupBeingEdited  {
    oldColour: string;
    oldGroupName: string;
}

// FORM AND MODAL VISIBILITY ENTITIES //

export interface BudgetFormVisibility {
    isCreateBudgetVisible: boolean,
    isUpdateBudgetVisible: boolean,
    isCreateGroupVisible: boolean,
    isUpdateGroupVisible: boolean,
}

export interface BudgetModalVisibility {
    isDeleteOptionsModalVisible: boolean;
    isConfirmGroupDestructionModalVisible: boolean;
    isConfirmCategoryDestructionModalVisible: boolean;
}

export interface ExpenseFormVisibility {
    isCreateExpenseVisible: boolean;
    isUpdateExpenseVisible: boolean;
    isUpdateRecurringExpenseInstanceVisible: boolean
}

export interface ExpenseModalVisibility {
    isConfirmExpenseDestructionModalVisible: boolean;
}

// TOOLS ENTITIES //

export type OpenToolsSection = "home" | "settings" | "recurring"

export type RecurringExpenseFrequency = "never" | "daily" | "weekly" | "fortnightly" | "monthly" | "annually"

export interface RecurringExpenseItemEntity {
    recurringExpenseId: string
    category: string
    amount: number
    timestamp: Date
    frequency: RecurringExpenseFrequency;
}

export interface RecurringExpenseModalVisibility {
    isConfirmRecurringExpenseDestructionModalVisible: boolean;
}

export interface RecurringExpenseFormVisibility {
    isCreateExpenseVisible: boolean,
    isUpdateRecurringExpenseVisible: boolean
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
}

export interface SettingsFormVisibility {
    typeDeleteMyExpensesForm: boolean;
    typeDeleteMyBudgetForm: boolean;
    typeDeleteMyDataForm: boolean;
}

export interface RemovedRecurringExpenseItem {
    recurringExpenseId: string,
    timestampOfRemovedInstance: Date
}

export interface ProfileIconUpdatingFormData {
    iconPath: string
}

export interface ToolsFormVisibility {
    isUpdateProfileIconFormVisible: boolean
}

// MISCELLANEOUS ENTITIES //

export interface SelectorOptionsFormattedData {
    value: string;
    label: string;
    colour: string | null;
}

export interface PublicUserData {
    currency: string;
    createdAt: Date;
    darkModeEnabled: boolean;
    accessibilityEnabled: boolean;
    profileIconFileName: string;
}

export interface PublicUserDataUpdate {
    currency: string;
    darkModeEnabled: boolean;
    accessibilityEnabled: boolean;
    profileIconFileName: string;
}

export type CategoryToIconGroupAndColourMap = Map<string, {iconPath: string, group: string, colour:string}>;

export const loaderCssOverride = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

// SELECTOR CONTENT ARRAYS //

export const groupColourArray = [
    '#fbb39a',
    '#fbdee0',
    '#f8b2bc',
    '#f1afa1',
    '#fbf5ab',
    '#e6eda0',
    '#9fd5be',
    '#c3e6df',
    '#9dc7b9',
    '#acbfa1',
    '#c6e2ba',
    '#a6c7ea',
    '#7c86bf',
    '#b2b4da',
    '#dfcde3',
    '#ceb4d9'
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
    "category-utencils-icon.svg",
    "category-wifi-icon.svg"
];

export const profileIconArray = [
    "profile-icon-default.svg",
    "profile-icon-partners.svg",
    "profile-icon-family.svg",
    "profile-icon-household.svg",
    "profile-icon-business.svg",
    "profile-icon-country.svg",
]

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
        case ("USD"):
            currencySymbol = "$";
            break;
        case ("AUD"):
            currencySymbol = "$";
            break;
        case ("GBP"):
            currencySymbol = "£";
            break;
        case ("KRW"):
            currencySymbol = "₩";
            break;
        case ("JPY"):
            currencySymbol = "¥";
            break;
        case ("CNY"):
            currencySymbol = "¥";
            break;
        default:
            currencySymbol = "$"
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

    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

/**
 * Formats a Date object into a human-readable string following Australian conventions.
 * @param date - The Date object to format.
 * @returns A string representing the formatted date, including the day of the week,
 *          the ordinal day of the month, the month name, and the year.
 */
export function formatDate(date: Date): string {

    const formattedDayOfWeek = new Intl.DateTimeFormat('en-AU', { weekday: "long" }).format(date);
    const formattedDayOfMonth = date.getDate();
    const formattedMonth = new Intl.DateTimeFormat('en-AU', { month: "long" }).format(date);
    const formattedYear = new Intl.DateTimeFormat('en-AU', { year: "numeric" }).format(date);

    const ordinalSuffix = getOrdinalSuffix(formattedDayOfMonth);

    return `${formattedDayOfWeek}, ${formattedDayOfMonth}${ordinalSuffix} ${formattedMonth} ${formattedYear}`
}


// EXPENSE API CALL FUNCTIONS //

/**
 * Handles the creation of a new expense item.
 * @param setBudgetArray - Dispatch function from useState hook for setting the budget items array.
 * @param setExpenseArray - Dispatch function from useState hook for setting the expense items array.
 * @param newExpenseItem - The new expense item to be added.
 */
export async function handleExpenseCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            newExpenseItem: ExpenseItemEntity): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/createExpense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseId: newExpenseItem.expenseId,
                category: newExpenseItem.category,
                amount: newExpenseItem.amount,
                timestamp: newExpenseItem.timestamp,
                recurringExpenseId: newExpenseItem.recurringExpenseId
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Expense entry invalid.")
            setExpenseArray(current => {
                const indexOfInvalidItem = current.map(item => item.expenseId).lastIndexOf(newExpenseItem.expenseId)
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json();
        console.log(responseData);
        setExpenseArray(await getExpenseList());
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Retrieves the list of expense items from the server.
 * @returns A sorted array of expense items, or an empty array in case of an error.
 */
export async function getExpenseList(): Promise<ExpenseItemEntity[]> {
    try {
        const response = await fetch("http://localhost:8080/api/getExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            logoutOnClick()
                .then(() => {
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
        }
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData.sort(expenseSort)

    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}


/**
 * Handles the updating of an existing expense item.
 * @param expenseId - The ID of the expense to update.
 * @param formData - The updated data for the expense item.
 */
export async function handleExpenseUpdating(expenseId: string, formData: ExpenseUpdatingFormData): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/updateExpense", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expenseId": expenseId,
                "category": formData.category,
                "amount": formData.amount,
                "timestamp": formData.timestamp
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Updates a specific instance of a recurring expense.
 * @param expenseId - The ID of the expense instance to update.
 * @param formData - The updated data for the expense instance.
 */
export async function handleRecurringExpenseInstanceUpdating(expenseId: string, formData: RecurringExpenseInstanceUpdatingFormData): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/updateRecurringExpenseInstance", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {
                "expenseId": expenseId,
                "amount": formData.amount,
                "category": formData.category,
                "recurringExpenseId": null
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Handles the deletion of a specific expense item.
 * @param expenseId - The ID of the expense to be deleted.
 * @param setExpenseArray - Dispatch function to update the expense array state.
 * @param setBudgetArray - Dispatch function to update the budget array state.
 */
export async function handleExpenseDeletion(expenseId: string,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>): Promise<void> {
    setExpenseArray(expenseArray => expenseArray.filter( expenseItem => {
        return expenseItem.expenseId !== expenseId
        }
    ))
    try {
        const response = await fetch("http://localhost:8080/api/deleteExpense", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expenseId": expenseId,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        console.log(await response.json());

    } catch(error) {
        console.error("Error:", error);
    }
    getExpenseList().then( expenseList => setExpenseArray(expenseList))
    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}

/**
 * Handles the deletion of multiple expense items in a batch operation.
 * @param expenseIdsToDelete - A set of IDs of the expenses to be deleted.
 */
export async function handleBatchExpenseDeletion(expenseIdsToDelete: Set<string>): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/batchDeleteExpenses", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseIdsToDelete: Array.from(expenseIdsToDelete)
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        console.log(await response.json());
    } catch (error) {
        console.error("Error:", error);
    }
}


// BUDGET API CALL FUNCTIONS //

/**
 * Creates a new budget item and updates the budget array state.
 * @param setBudgetArray - Dispatch function to update the budget array state.
 * @param newBudgetItem - The new budget item to be added.
 */
export async function handleBudgetCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>, newBudgetItem: BudgetItemEntity): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/createBudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: newBudgetItem.category.trim(),
                amount: newBudgetItem.amount ? newBudgetItem.amount : 0,
                iconPath: newBudgetItem.iconPath != "" ? newBudgetItem.iconPath : "category-default-icon.svg",
                group: newBudgetItem.group ? newBudgetItem.group.trim() : "Miscellaneous"
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Category name is invalid or already has assigned budget; or $999,999,999 limit exceeded.")
            setBudgetArray(current => {
                const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Retrieves the list of budget items from the server.
 * @returns A sorted array of budget items, or an empty array in case of an error.
 */
export async function getBudgetList(): Promise<BudgetItemEntity[]> {
    try {
        const response = await fetch("http://localhost:8080/api/getBudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            logoutOnClick()
                .then(() => {
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
        }
        else if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData.sort(budgetSort));
        return responseData.sort(budgetSort)

    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}


/**
 * Updates an existing budget item based on the provided form data.
 * @param category - The category of the budget item to update.
 * @param formData - The updated data for the budget item.
 */
export async function handleBudgetUpdating(category: string, formData: BudgetUpdatingFormData): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/updateBudget", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
                "newCategoryName": formData.category.trim(),
                "amount": formData.amount,
                "group": formData.group.trim(),
                "iconPath": formData.iconPath
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            const responseData = await response.json();
            console.log(responseData);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Deletes a budget item.
 * @param category - The category of the budget item to be deleted.
 * @param setBudgetArray - Dispatch function to update the budget array state.
 */
export async function handleBudgetDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>): Promise<void> {
    setBudgetArray(prevState => prevState.filter(budgetItem => budgetItem.category !== category))
    try {
        const response = await fetch("http://localhost:8080/api/deleteBudget", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}


// GROUP API CALL FUNCTIONS //

/**
 * Creates a new budget category group.
 * @param group - The name of the group to create.
 * @param colour - The color associated with the group.
 * @param setGroupArray - Dispatch function to update the group array state.
 * @param newGroupItem - The new group item data.
 */
export async function handleGroupCreation(group: string, colour: string, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, newGroupItem: GroupItemEntity): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: group.trim(),
                colour: colour.trim()
            })
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Group name is invalid or already exists.")
            setGroupArray((currentGroupArray) => {
                const indexOfInvalidItem = currentGroupArray.map(item => item.group).lastIndexOf(newGroupItem.group);
                if (indexOfInvalidItem !== -1) {
                    return [...currentGroupArray.slice(0, indexOfInvalidItem), ...currentGroupArray.slice(indexOfInvalidItem + 1)]
                }
                return currentGroupArray;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setGroupArray(await getGroupList());
    } catch (error) {
        console.error("Failed to create group:", error);
    }
}


/**
 * Retrieves the list of groups from the server.
 * @returns A sorted array of group items, or an empty array in case of an error.
 */
export async function getGroupList(): Promise<GroupItemEntity[]> {
    try {
        const response = await fetch("http://localhost:8080/api/getGroups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            logoutOnClick()
                .then(() => {
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
        }
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData)
        return responseData.sort(groupSort);
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

/**
 * Updates an existing budget category group.
 * @param originalGroupName - The original name of the group being updated.
 * @param originalColour - The original color of the group being updated.
 * @param formData - The new data for the group.
 * @param setGroupArray - Dispatch function to update the group array state.
 * @param groupArray - The current array of group items.
 */
export async function handleGroupUpdating(originalGroupName: string, originalColour: string, formData: BasicGroupData, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, groupArray: GroupItemEntity[]): Promise<void> {
    if (originalGroupName === formData.group || !groupArray.map(groupItem => groupItem.group).includes(formData.group)) {
        setGroupArray(currentGroupArray => {
            return currentGroupArray.map(groupItem => groupItem.group == originalGroupName ? {
                colour: formData.colour ? formData.colour : groupItem.colour,
                group: formData.group,
                timestamp: groupItem.timestamp
            } : groupItem)
        })
        try {
            const response = await fetch("http://localhost:8080/api/updateGroup", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {
                    originalGroupName: originalGroupName,
                    newGroupName: formData.group.trim(),
                    newColour: formData.colour ? formData.colour : ""
                })
            });
            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`)
                window.alert("Updated group is invalid.")
                setGroupArray(currentGroupArray => {

                    const revertedGroupOptions = [...currentGroupArray]
                    const indexOfInvalidlyEditedOption = currentGroupArray.map(groupItem => groupItem.group).lastIndexOf(formData.group);
                    if (indexOfInvalidlyEditedOption !== -1) {
                        revertedGroupOptions[indexOfInvalidlyEditedOption] = {
                            group: originalGroupName,
                            colour: originalColour,
                            timestamp: revertedGroupOptions[indexOfInvalidlyEditedOption].timestamp
                        }
                    }
                    return revertedGroupOptions;
                })
            } else {
                console.log("Group successfully updated.")
                setGroupArray(await getGroupList());
            }
        } catch (error) {
            console.error("Failed to update group:", error)
        }
    } else {
        console.error("Selected group name already taken.")
        window.alert("Selected group name already taken.")
    }
}


/**
 * Handles the deletion of a group and optionally keeps the contained budgets.
 * @param groupName - The name of the group to be deleted.
 * @param setGroupArray - Dispatch function to update the group array state.
 * @param setBudgetArray - Dispatch function to update the budget array state.
 * @param keepContainedBudgets - Flag to keep or delete budgets contained within the group.
 */
export async function handleGroupDeletion(groupName: string,
                                          setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>,
                                          setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                          keepContainedBudgets: boolean): Promise<void> {
    setGroupArray(prevState => prevState.filter(groupItem => groupItem.group !== groupName))
    try {
        const response = await fetch("http://localhost:8080/api/deleteGroup", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: groupName,
                keepContainedBudgets: keepContainedBudgets
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    await getGroupList()
        .then( options => setGroupArray(options))
        .then( () => getBudgetList().then( budgets => setBudgetArray(budgets)))
}


/// RECURRING EXPENSES API CALL FUNCTIONS //

/**
 * Handles the creation of a new recurring expense.
 * @param newRecurringExpenseItem - The data for the new recurring expense.
 * @param setRecurringExpenseArray - Dispatch function to update the recurring expense array state.
 */
export async function handleRecurringExpenseCreation(newRecurringExpenseItem: RecurringExpenseItemEntity, setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/createRecurringExpense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recurringExpenseId: newRecurringExpenseItem.recurringExpenseId,
                category: newRecurringExpenseItem.category,
                amount: newRecurringExpenseItem.amount,
                timestamp: newRecurringExpenseItem.timestamp,
                frequency: newRecurringExpenseItem.frequency as String
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Expense entry invalid.")
        }
        const responseData = await response.json();
        setRecurringExpenseArray(await getRecurringExpenseList());
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Retrieves the list of recurring expenses from the server.
 * @returns A sorted array of recurring expense items, or an empty array in case of an error.
 */
export async function getRecurringExpenseList(): Promise<RecurringExpenseItemEntity[]> {
    try {
        const response = await fetch("http://localhost:8080/api/getRecurringExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            logoutOnClick()
                .then(() => {
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
        }
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData.sort(expenseSort)

    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

/**
 * Updates the details of an existing recurring expense.
 * @param recurringExpenseId - The ID of the recurring expense to update.
 * @param formData - The new data for the recurring expense.
 */
export async function handleRecurringExpenseUpdating(recurringExpenseId: string, formData: RecurringExpenseUpdatingFormData): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/updateRecurringExpense", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "recurringExpenseId": recurringExpenseId,
                "category": formData.category,
                "amount": formData.amount,
                "timestamp": formData.timestamp,
                "frequency": formData.frequency
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Deletes a specified recurring expense.
 * @param recurringExpenseId - The ID of the recurring expense to delete.
 * @param setRecurringExpenseArray - Dispatch function to update the recurring expense array state.
 */
export async function handleRecurringExpenseDeletion(recurringExpenseId: string, setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>): Promise<void> {
    setRecurringExpenseArray(recurringExpenseArray => recurringExpenseArray.filter( recurringExpenseItem => {
            return recurringExpenseItem.recurringExpenseId !== recurringExpenseId
        }
    ))
    try {
        const response = await fetch("http://localhost:8080/api/deleteRecurringExpense", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "recurringExpenseId": recurringExpenseId,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }
    getRecurringExpenseList().then(recurringExpenseList => setRecurringExpenseArray(recurringExpenseList))
}


/**
 * Creates a record for a removed instance of a recurring expense, for blacklist purposes.
 * @param recurringExpenseId - The ID of the recurring expense from which an instance is removed.
 * @param timestampOfRemovedInstance - The timestamp of the removed expense instance.
 * @param setRemovedRecurringExpenseInstances - Dispatch function to update the state of removed recurring expense instances.
 */
export async function handleRemovedRecurringExpenseCreation(recurringExpenseId: string | null, timestampOfRemovedInstance: Date, setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItem[]>>): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/createRemovedRecurringExpense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recurringExpenseId: recurringExpenseId!,
                timestampOfRemovedInstance: timestampOfRemovedInstance
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        } else {
            const responseData = await response.json();
            console.log(responseData);
            setRemovedRecurringExpenseInstances(await getRemovedRecurringExpenses());
        }
    } catch (error) {
        console.error("Error creating removed recurring expense:", error);
    }
}


/**
 * Retrieves the list of removed recurring expense instances from the server.
 * @returns An array of removed recurring expense instances, or an empty array in case of an error.
 */
export async function getRemovedRecurringExpenses(): Promise<RemovedRecurringExpenseItem[]> {
    try {
        const response = await fetch("http://localhost:8080/api/getRemovedRecurringExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const removedRecurringExpenses = await response.json();
        console.log("Below, removedRecurringExpenses")
        console.log(removedRecurringExpenses);
        return removedRecurringExpenses;
    } catch (error) {
        console.error("Error getting removed recurring expenses:", error);
        return [];
    }
}


// TOTAL INCOME API CALLS //

/**
 * Retrieves the total income from the server.
 * @returns The total income as a number, or the default of $1,000 in case of an error.
 */
export async function getTotalIncome(): Promise<number> {
    try {
        const response = await fetch("http://localhost:8080/api/getTotalIncome",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        if (!response.ok) {
            console.error(`HTTP error when getting total income - ${response.status}`)
        }
        const totalIncome = await response.json();
        console.log(totalIncome);
        return(totalIncome.totalIncome);
    } catch (e) {
        console.error(`Failed to execute total income retrieval - ${e}`)
        return 1000;
    }
}


/**
 * Updates the total income value on the server.
 * @param newTotalIncome - The new total income value.
 */
export async function handleTotalIncomeUpdating(newTotalIncome: number): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/updateTotalIncome", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                totalIncome: newTotalIncome
            })
        })
        if (!response.ok) {
            console.error(`HTTP error when updating total income - ${response.status}`)
        } else {
            console.log(await response.json());
        }
    } catch (e) {
        console.error(`Failed to execute total income update - ${e}`)
    }
}


// BROADER DESTRUCTIVE API CALL FUNCTIONS //

/**
 * Deletes all user expense records.
 */
export async function handleWipeExpenses(): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/wipeExpenses", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.error(`HTTP error when wiping expenses - status: ${response.status}`);
        } else {
            console.log(await response.json());
        }
    } catch (e) {
        console.error(`Failed to wipe expenses - ${e}`);
    }
}


/**
 * Deletes all user budget records.
 */
export async function handleWipeBudget(): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/wipeBudget", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.error(`HTTP error when wiping budget - status: ${response.status}`);
        } else {
            console.log(await response.json());
        }
    } catch (e) {
        console.error(`Failed to wipe budget - ${e}`);
    }
}


/**
 * Deletes all user data (expenses, budgets, recurring expenses).
 */
export async function handleWipeData(): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/wipeData", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.error(`HTTP error when wiping data - status: ${response.status}`);
        } else {
            console.log(await response.json());
        }
    } catch (e) {
        console.error(`Failed to wipe data - ${e}`);
    }
}


// AUTH API CALL FUNCTIONS //

/**
 * Attempts to register a new user with the provided email and password.
 * Redirects to the login page on successful registration.
 */
export async function handleUserRegistration(email: string, password: string): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            console.log(await response.json())
            window.alert("Registration failed - user may already exist.")
        } else {
            console.log("Successful registration.");
            console.log(await response.json());
            window.location.href = "/login";
        }

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 */
export async function handleUserLogin(email: string, password: string): Promise<void> {
    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        });
        if (response.status === 500) {
            console.error(`HTTP error - status: ${response.status}`);
            console.error("User not found.")
            window.alert("User not found - please check your credentials.")
        } else {
            if (response.status === 400) {
                console.error(`HTTP error - status: ${response.status}`);
                console.error("User already logged in.")
                window.location.href = "/budget"
            } else {
                console.log("Successful login.");
                console.log(response.json());
                window.location.href = "/budget";
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}


/**
 * Logs out the current user and redirects to the login page.
 */
export async function logoutOnClick(): Promise<void> {
    try {
        sessionStorage.removeItem("email");
        await fetch("http://localhost:8080/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({jwt: localStorage.getItem("jwt")})
        })
            .then( () => window.location.href = "/login")
            .catch( error => console.error(error))
    } catch {
        console.error("Error: Logout failed")
    }
}


/**
 * Checks if a user is currently logged in and handles session status accordingly.
 * Redirects to the login page if the session is expired or not found.
 */
export async function checkForUser(): Promise<{ loggedIn: boolean }> {
    try {
        const response = await fetch("http://localhost:8080/api/checkForUser", {
            method: "GET",
        });
        if (response.status === 400) {
            console.error("Failed to check for user status.")
        } else if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.");
            window.alert("Login expired. Please login again.");
            const userStatus = { loggedIn: false}
            logoutOnClick()
                .then(() => {
                    console.log(`window.location.href: ${window.location.href}`)
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
            return userStatus;
        }
        const userStatus = await response.json();
        console.log(userStatus)
        return userStatus;
    } catch (error) {
        console.error("Error:", error);
        return {loggedIn: false};
    }
}


/**
 * Retrieves the email address of the currently logged-in user.
 * @returns {void}
 */
export async function getSessionEmail(): Promise<any> {

    try {
        const response = await fetch("http://localhost:8080/api/getUserEmailIfLoggedIn", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.error(`Email retrieval failed - no user logged in.: ${response.status}`);
        } else {
            const responseData = await response.json();
            console.log(responseData);
            return responseData
        }
    } catch (error) {
        console.error(`Email retrieval api query failed: ${error}`);
    }
}


// ICON AND COLOUR SELECTOR IMPLEMENTATIONS //

/**
 * Adds click event listeners to icon elements for icon selection functionality.
 * @template T - A generic type extending an object that optionally includes an iconPath property.
 * @param {Dispatch<SetStateAction<T>>} setFormData - Dispatch function that updates state for selected icon.
 * @param {string} selectorType - The base part of the class name used to select icon elements.
 */
export function addIconSelectionFunctionality<T extends { iconPath?: string }>(
    setFormData: Dispatch<SetStateAction<T>>,
    selectorType: string
): void {
    // Get array of icons
    const icons: NodeListOf<HTMLImageElement> = document.querySelectorAll(`.${selectorType}-icon-selectable`);

    // Iterate over each icon to add click event listeners
    icons.forEach((icon): void => {
        icon.addEventListener("click", (e: MouseEvent) => {
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
            icons.forEach(icon2 => icon2.classList.remove("selected-icon"));
            icon.classList.add("selected-icon");
            console.log(`iconPath: ${iconPath}`);
        });
    });
}


/**
 * Adds click event listeners to colour selection elements for group colour selection functionality.
 * @param {Dispatch<SetStateAction<BasicGroupData>>} setFormData - Dispatch function to update state for the selected colour.
 */
export function addColourSelectionFunctionality(setFormData: Dispatch<SetStateAction<BasicGroupData>>): void {
    // Query all colour selection containers
    const colourElementList: NodeListOf<HTMLImageElement> = document.querySelectorAll(".group-colour-selectable-container");

    // Iterate over each colour selection container to add click event listeners
    colourElementList.forEach(colourSelectable => {
        colourSelectable.addEventListener("click", (e: MouseEvent) => {
            // Prevent the default action of the event
            e.preventDefault();

            // Update form data with the selected colour's value
            const triangleElement = colourSelectable.firstChild as HTMLDivElement;
            setFormData((current: BasicGroupData) => ({
                ...current,
                ["colour"]: triangleElement.getAttribute("data-value") // Extract colour value
            }));

            // Visual feedback
            colourElementList.forEach(colourSelectable => {
                const triangle = colourSelectable.firstChild as HTMLDivElement;
                triangle.classList.remove("selectedColour");
            });
            triangleElement.classList.add("selectedColour");
        });
    });
}


// SORTING FUNCTIONS //

/**
 * Sorts group items, placing "Miscellaneous" at the end and others by their timestamps in ascending order.
 * @param {GroupItemEntity} a - The first group item for comparison.
 * @param {GroupItemEntity} b - The second group item for comparison.
 * @returns {number} - Sorting order value.
 */
function groupSort(a: GroupItemEntity, b: GroupItemEntity): number {
    if (a.group === "Miscellaneous") return 1;
    if (b.group === "Miscellaneous") return -1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}


/**
 * Sorts expense items by their timestamps in descending order.
 * @param {ExpenseItemEntity} a - The first expense item for comparison.
 * @param {ExpenseItemEntity} b - The second expense item for comparison.
 * @returns {number} - Sorting order value.
 */
function expenseSort(a: ExpenseItemEntity, b: ExpenseItemEntity): number {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}


/**
 * Sorts budget items by their timestamps in ascending order.
 * Logs errors to console if timestamps are invalid.
 * @param {BudgetItemEntity} budgetItemA - The first budget item for comparison.
 * @param {BudgetItemEntity} budgetItemB - The second budget item for comparison.
 * @returns {number} - Sorting order value, or logs error if timestamp conversion fails.
 */
function budgetSort(budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity): number {
    return new Date(budgetItemA.timestamp!).getTime() - new Date(budgetItemB.timestamp!).getTime();
}


// PUBLIC USER DATA API CALLS //

/**
 * Retrieves public user data.
 */
export async function getPublicUserData(): Promise<any> {
    try {
        const response = await fetch("http://localhost:8080/api/getPublicUserData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            logoutOnClick()
                .then(() => {
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
        } else if (!response.ok) {
            console.error(`HTTP error when getting public user data - ${response.status}`)
        } else {
            const publicUserData = await response.json();
            console.log(publicUserData);
            return(publicUserData);
        }
    } catch (e) {
        console.error(`Failed to execute public data retrieval - ${e}`)
    }
}


/**
 * Updates public user data with the specified settings.
 * @param {PublicUserData} updatedPublicUserData - The updated public user data.
 */
export async function handlePublicUserDataUpdating(updatedPublicUserData: PublicUserDataUpdate){
    try {
        const response = await fetch("http://localhost:8080/api/updatePublicUserData", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                currency: updatedPublicUserData.currency,
                darkModeEnabled: updatedPublicUserData.darkModeEnabled,
                accessibilityEnabled: updatedPublicUserData.accessibilityEnabled,
                profileIconFileName: updatedPublicUserData.profileIconFileName
            })
        })
        if (!response.ok) {
            console.error(`HTTP error when updating public user data - ${response.status}`)
        } else {
            const publicUserData = await response.json();
            console.log(publicUserData);
            return(publicUserData);
        }
    } catch (e) {
        console.error(`Failed to execute public user data update - ${e}`)
    }
}


// SELECTOR OPTIONS AND STYLING //

export const recurringFrequencyOptions = [
    {
        value: "never",
        label: "Never",
        colour: "black"
    },
    {
        value: "daily",
        label: "Daily",
        colour: "black"
    },
    {
        value: "weekly",
        label: "Weekly",
        colour: "black"
    },
    {
        value: "fortnightly",
        label: "Fortnightly",
        colour: "black"
    },
    {
        value: "monthly",
        label: "Monthly",
        colour: "black"
    },
    {
        value: "annually",
        label: "Annually",
        colour: "black"
    }
]


const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

export const colourStyles = {
    control: (styles: any) => ({ ...styles, fontWeight: "bold", backgroundColor: "white"}),
    option: (styles: any, {data}: any) => {
        return {
            ...styles,
            color: data.colour,
            fontWeight: "bold",
            filter: "brightness(65%)"
        };
    },
    input: (styles: any) => ({ ...styles, ...dot() }),
    placeholder: (styles: any) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles: any, {data}: any) => ({ ...styles, ...dot(data.colour) }),
};


export function groupListAsOptions(groupArray: GroupItemEntity[]): SelectorOptionsFormattedData[] {
    return groupArray.map( groupItemEntity => {
        return { value: groupItemEntity.group, label: groupItemEntity.group, colour: groupItemEntity.colour }
    });
}

export function categoryListAsOptions(budgetArray: BudgetItemEntity[], groupArray: GroupItemEntity[]) {
    return budgetArray.map( budgetItemEntity => {
        const groupOfCategory = getGroupOfCategory(budgetArray, budgetItemEntity.category)
        return {
            value: budgetItemEntity.category,
            label: budgetItemEntity.category,
            colour: groupOfCategory ? getColourOfGroup(groupOfCategory, groupArray) : "#17423f"
        }
    })
}

export const currencyOptions = [
    { symbol: '$AUD', code: 'AUD' },
    { symbol: '$USD', code: 'USD' },
    { symbol: '£GBP', code: 'GBP' },
    { symbol: '₩KRW', code: 'KRW' },
    { symbol: '¥JPY', code: 'JPY' },
    { symbol: '¥CNY', code: 'CNY' },
];

// DYNAMIC SIZING FUNCTIONS //


/**
 * Dynamically sizes the font of budget name displays based on their length.
 */
export function dynamicallySizeBudgetNameDisplays(): void {
    const budgetNameElements = document.querySelectorAll(".budget-name") as NodeListOf<HTMLElement>;
    budgetNameElements.forEach(budgetNameElement => {
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

        if (budgetNameText?.split(" ")[0].length!  >= 12) {
            budgetNameElement.textContent = (budgetNameText!.slice(0,11) + "\n...")
        }
    })
}

/**
 * Dynamically sizes the font of budget number displays based on their length.
 */
export function dynamicallySizeBudgetNumberDisplays(): void {
    const budgetNumberElements = document.querySelectorAll(".budgeting-values-container") as NodeListOf<HTMLElement>;
    budgetNumberElements.forEach(budgetNumberElement => {
        let dynamicFontSize = "";
        const budgetNumberFirstLine = budgetNumberElement.firstChild! as HTMLElement
        const budgetNumberLength = budgetNumberFirstLine.innerText.length;
        if (budgetNumberLength <= 28) {
            dynamicFontSize = "0.875rem"
        } else if (budgetNumberLength <= 32) {
            dynamicFontSize = "0.78rem"
        } else if (budgetNumberLength <= 40) {
            dynamicFontSize = "0.68rem"
        }
        budgetNumberElement.style.fontSize = dynamicFontSize;
    })
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
    "December"
];


/**
 * Determines if a recurring expense lands on a specified day.
 * @param {Date} timestamp - The timestamp of the recurring expense.
 * @param {RecurringExpenseFrequency} frequency - The frequency of the recurring expense.
 * @param {Date} dateToAnalyseForExpenseLanding - The date to check for expense landing.
 * @returns True if the expense lands on the given day, false otherwise.
 */
export function recurringExpenseLandsOnDay(timestamp: Date, frequency: RecurringExpenseFrequency, dateToAnalyseForExpenseLanding: Date): boolean {
    const creationDate = new Date(timestamp);
    creationDate.setHours(0, 0, 0, 0);
    dateToAnalyseForExpenseLanding.setHours(0, 0, 0, 0);

    // Calculate the difference in days between the dates
    const diffTime = Math.abs(dateToAnalyseForExpenseLanding.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Determine if the expense lands on the given day based on its frequency
    switch (frequency) {
        case 'daily':
            return true;
        case 'weekly':
            return diffDays % 7 === 0;
        case 'fortnightly':
            return diffDays % 14 === 0;
        case 'monthly':
            return creationDate.getDate() === dateToAnalyseForExpenseLanding.getDate();
        case 'annually':
            return creationDate.getDate() === dateToAnalyseForExpenseLanding.getDate() &&
                creationDate.getMonth() === dateToAnalyseForExpenseLanding.getMonth();
        default:
            return false;
    }
}


/**
 * Retrieves the next instance of a recurring expense.
 * @param {Date} timestamp - The timestamp of the recurring expense.
 * @param {RecurringExpenseFrequency} frequency - The frequency of the recurring expense.
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
 * Retrieves all instances of a recurring expense present in the expense array on a specified date.
 * @param {ExpenseItemEntity[]} expenseArray - The array of expense items to search.
 * @param {RecurringExpenseItemEntity} recurringExpenseItem - The recurring expense item to search for.
 * @param date - The date to search for expense instances.
 * @returns An array of expense items that are instances of the recurring expense on the given date, or null if none found.
 */
export function getRecurringExpenseInstancesOrNull(expenseArray: ExpenseItemEntity[],
                                                   recurringExpenseItem: RecurringExpenseItemEntity,
                                                   date: Date): ExpenseItemEntity[] | null {
    const recurringExpenseInstances = expenseArray.filter((expenseItem: ExpenseItemEntity) => {
        return (expenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
            && new Date(expenseItem.timestamp).getTime() === new Date(date).getTime())
    })
    return recurringExpenseInstances.length > 0 ? recurringExpenseInstances : null;
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
 * @param {BudgetItemEntity[]} filteredBudgetArray - An array of the budget items in a given group.
 * @returns The total budget within the group.
 */
export function getGroupBudgetTotal(filteredBudgetArray: BudgetItemEntity[]): number {
    return filteredBudgetArray.map(budgetItem => budgetItem.amount)
        .reduce( (acc, amountSpent) => acc + amountSpent, 0)
}


/**
 * Get the total expenditure within a budget category group.
 * @param {ExpenseItemEntity[]} expenseArray - An array of expense items within a given group.
 * @param {BudgetItemEntity[]} filteredBudgetArray - An array of the budget items in a given group.
 * @returns The total expenditure within the group.
 */
export function getGroupExpenditureTotal(expenseArray: ExpenseItemEntity[],
                                         filteredBudgetArray: BudgetItemEntity[]): number {
    const categoriesInGroup = filteredBudgetArray.map(expenseItem => expenseItem.category)
    const filteredExpenseArray = expenseArray.filter(expenseItem => categoriesInGroup.includes(expenseItem.category));
    return filteredExpenseArray.reduce((acc, expenseItem) => acc + expenseItem.amount, 0);
}


/**
 * Get the group of a given category.
 * @param {BudgetItemEntity[]} budgetArray - The array of budget items.
 * @param {string} category - The category to search for.
 * @returns The group of the given category, or null if not found.
 */
export function getGroupOfCategory(budgetArray: BudgetItemEntity[], category: string): string | null {
    const budgetItem = budgetArray.filter(budgetItemEntity => budgetItemEntity.category === category)[0];
    return budgetItem.group ? budgetItem.group : null;
}


/**
 * Get the colour of a given group.
 * @param {string} groupName - The name of the group to search for.
 * @param {GroupItemEntity[]} groupArray - The array of group items.
 * @returns The colour of the given group, or null if not found.
 */
export function getColourOfGroup(groupName: string, groupArray: GroupItemEntity[]): string | null {
    const group = groupArray.filter(groupItemEntity => groupItemEntity.group === groupName)[0];
    return group.colour ? group.colour : null;
}


/**
 * Get the total amount budgeted across all categories in all groups.
 * @param {BudgetItemEntity[]} budgetArray - The array of budget items.
 * @returns The total amount budgeted across all categories in all groups.
 */
export function getTotalAmountBudgeted(budgetArray: BudgetItemEntity[]): number {
    const amountArray = budgetArray.map( budgetItem => (
        budgetItem.amount
    ))
    return amountArray.reduce((accumulator, currentValue) => (
        accumulator + currentValue
    ), 0)
}


/**
 * Get the data map for category to icon, group, and colour.
 * @param {BudgetItemEntity[]} budgetArray - The array of budget items.
 * @param {GroupItemEntity[]} groupArray - The array of group items.
 * @returns The map of category to icon, group, and colour.
 */
export async function getGroupAndColourMap(budgetArray: BudgetItemEntity[], groupArray: GroupItemEntity[]) {
    const categoryToGroupAndColourMap: CategoryToIconGroupAndColourMap = new Map();
    budgetArray.forEach( budgetItem => {
        categoryToGroupAndColourMap.set(budgetItem.category, {
            iconPath: budgetItem.iconPath,
            group: budgetItem.group,
            colour: groupArray.find(groupItem => groupItem.group === budgetItem.group)!.colour
        })
    })
    return categoryToGroupAndColourMap;
}


/**
 * Get the line angle of the Fulcrum scale animation.
 * @param {number} percentageIncomeRemaining - The percentage of income remaining.
 * @returns The line angle of the animation.
 */
export function getLineAngle(percentageIncomeRemaining: number): number {
    const functionalPercentageIncomeRemaining = percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining
    return functionalPercentageIncomeRemaining <= -100 ? 14.5 :
        functionalPercentageIncomeRemaining === 100 ? -14.5 :
            functionalPercentageIncomeRemaining / (-100 / 14.5);
}


/**
 * Handle the input change on a form with a formatted amount input field.
 * @param {ChangeEvent<HTMLInputElement>} e - The input change event.
 * @param {Dispatch<SetStateAction<any>>} setFormData - The state update function.
 */
export function handleInputChangeOnFormWithAmount(e: ChangeEvent<HTMLInputElement>, setFormData: Dispatch<SetStateAction<any>>): void {
    let newFormValue: string;
    if (e.target.name === "amount") {
        if (e.target.value === "") {
            newFormValue = "";
        } else {
            newFormValue = formatDollarAmountDynamic(e.target.value);
        }
    } else {
        console.log("not amount")
        newFormValue = e.target.value;
    }
    if (e.target.name != "amount" || e.target.value == "" || (e.target.name === "amount" && parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 9999999.99)) {
        setFormData((currentFormData: BudgetCreationFormData | BudgetUpdatingFormData | ExpenseCreationFormData | ExpenseUpdatingFormData) => {
            return {...currentFormData, [e.target.name]: newFormValue}
        });
    }
}


/**
 * Check if any modal or form is open.
 * @param {Record<string, boolean>} formVisibility - The visibility of the expense form.
 * @param {Record<string, boolean>} modalVisibility - The visibility of the expense modal.
 * @returns True if any modal or form is open, false otherwise.
 */
export function checkForOpenModalOrForm(formVisibility: ExpenseFormVisibility
                                            | BudgetFormVisibility
                                            | RecurringExpenseFormVisibility
                                            | SettingsFormVisibility,
                                        modalVisibility: ExpenseModalVisibility
                                            | BudgetModalVisibility
                                            | RecurringExpenseModalVisibility
                                            | SettingsModalVisibility) {
    return Object.values(formVisibility).includes(true) || Object.values(modalVisibility).includes(true)
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
 * @param {RemovedRecurringExpenseItem[]} removedRecurringExpenseInstances - The blacklist.
 * @param {RecurringExpenseItemEntity} recurringExpenseItem - The recurring expense item to check.
 * @param {Date} date - The date to check for a matching blacklist record.
 * @returns True if a matching blacklist record is found, false otherwise.
 */
export function matchingRemovedRecurringExpenseFound(removedRecurringExpenseInstances: RemovedRecurringExpenseItem[], recurringExpenseItem: RecurringExpenseItemEntity, date: Date): boolean {
    const checkResult = removedRecurringExpenseInstances.find(removedRecurringExpenseItem => {
        return removedRecurringExpenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
            && new Date(removedRecurringExpenseItem.timestampOfRemovedInstance).toLocaleDateString() === new Date(date).toLocaleDateString()
    })
    return checkResult !== undefined;
}


/**
 * Gets the number of months from a given month and year to the current month and year.
 * @param {number} month - The month to compare.
 * @param {number} year - The year to compare.
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
 * @param {ExpenseItemEntity[]} expenseArray - The array of expense items.
 * @param {Dispatch<SetStateAction<MonthExpenseGroupEntity[]>>} setStructuredExpenseData - The state update function.
 * @returns The structured expense data.
 */
export function getStructuredExpenseData(expenseArray: ExpenseItemEntity[], setStructuredExpenseData: (value: (((prevState: MonthExpenseGroupEntity[]) => MonthExpenseGroupEntity[]) | MonthExpenseGroupEntity[])) => void) {
    // Initialise structure from the dawn of y2k to 12 months into the future from today
    let newStructuredExpenseData: MonthExpenseGroupEntity[] = [];

    const dateToday = new Date();
    const currentMonth = dateToday.getMonth();
    const currentYear = dateToday.getFullYear();

    const y2K = new Date('2000-01-01T00:00:00Z');
    const y2KMonth = y2K.getMonth();
    const y2KYear = y2K.getFullYear();

    const monthsFromY2KToNow = getMonthsFromToday(y2KMonth, y2KYear);

    for (let i = -monthsFromY2KToNow; i <= 12; i++) {
        const monthIndex = (currentMonth + i + 1200) % 12;
        const yearAdjustment = Math.floor((currentMonth + i) / 12);
        const year = currentYear + yearAdjustment;

        const newMonthExpenseGroup: MonthExpenseGroupEntity = {
            monthIndex: monthIndex,
            year: year,
            monthExpenseArray: []
        }
        newStructuredExpenseData = [...newStructuredExpenseData, newMonthExpenseGroup]
    }

    for (const expenseItem of expenseArray) {
        for (let monthExpenseGroupItem of newStructuredExpenseData) {
            if (monthExpenseGroupItem.monthIndex === new Date(expenseItem.timestamp).getMonth()
                && monthExpenseGroupItem.year === new Date(expenseItem.timestamp).getFullYear()) {
                // Execution here occurs where a monthExpenseGroupItem's month and year (day) match to this iteration's expenseItem's day.
                // Here, if a DayExpenseGroupEntity exists for the expenseItem's day, add the expenseItem in.
                let matchingDayGroupExists = false;
                for (let dayExpenseGroupItem of monthExpenseGroupItem.monthExpenseArray) {
                    if (new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString() === new Date(expenseItem.timestamp).toLocaleDateString()) {

                        console.log(`Adding an expense item to existing group on ${new Date(dayExpenseGroupItem.calendarDate).toLocaleDateString()}`)
                        dayExpenseGroupItem.dayExpenseArray = [...dayExpenseGroupItem.dayExpenseArray, expenseItem];
                        matchingDayGroupExists = true;
                        break;
                    }
                }
                if (matchingDayGroupExists) {
                    break;
                }

                // Otherwise, make a new DayExpenseGroupEntity for the expenseItem's day and add it in.
                console.log(`Adding an expense item to newly created group on ${new Date(expenseItem.timestamp).toLocaleDateString()}`)

                const startOfDayCalendarDate = new Date(expenseItem.timestamp);
                startOfDayCalendarDate.setHours(0, 0, 0, 0);

                const newDayExpenseGroup: DayExpenseGroupEntity = {
                    calendarDate: startOfDayCalendarDate,
                    dayExpenseArray: [expenseItem]
                }
                monthExpenseGroupItem.monthExpenseArray = [...monthExpenseGroupItem.monthExpenseArray, newDayExpenseGroup];
            }
        }
    }
    setStructuredExpenseData(newStructuredExpenseData);
}


/**
 * Updates the expenseArray's recurring expense instances, adding, removing or leaving instances as necessary.
 * @param {RecurringExpenseItemEntity[]} recurringExpenseArray - The array of recurring expense items.
 * @param {ExpenseItemEntity[]} expenseArray - The array of expense items.
 * @param {RemovedRecurringExpenseItem[]} removedRecurringExpenseInstances - The array of removed recurring expense instances.
 * @param {Dispatch<SetStateAction<BudgetItemEntity[]>>} setBudgetArray - The state update function for the budget array.
 * @param {Dispatch<SetStateAction<ExpenseItemEntity[]>>} setExpenseArray - The state update function for the expense array.
 */
export async function updateRecurringExpenseInstances(recurringExpenseArray: RecurringExpenseItemEntity[],
                                                          expenseArray: ExpenseItemEntity[],
                                                          removedRecurringExpenseInstances: RemovedRecurringExpenseItem[],
                                                          setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                                          setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>, ): Promise<void> {
    const today = new Date();
    const misplacedExpensesToRemove = new Set<string>();

    // For each recurring expense...
    recurringExpenseArray.forEach(recurringExpenseItem => {

        // We check each of the dates between when it was added and today.
        for (let date = new Date(recurringExpenseItem.timestamp); date <= today; date.setTime(date.getDate() + 1)) {
            console.log(`Looking at date: ${date.toLocaleDateString()}`)

            const expenseInstances = getRecurringExpenseInstancesOrNull(expenseArray, recurringExpenseItem, date);
            const isFrequencyMatch = recurringExpenseLandsOnDay(recurringExpenseItem.timestamp, recurringExpenseItem.frequency, date);
            const expenseInstanceIsBlacklisted = removedRecurringExpenseInstances ?
                matchingRemovedRecurringExpenseFound(removedRecurringExpenseInstances, recurringExpenseItem, date)
                : false;

            // If recurring instance already exists on a day
            if (expenseInstances != null) {
                let keepFirstInstance = true;

                // And this instance shouldn't have landed on this day (can happen when freq is changed),
                // Queue this and any duplicate instances on this day for removal
                if (!isFrequencyMatch) {
                    keepFirstInstance = false;
                }

                // Otherwise only queue the duplicate instances on this day for removal
                for (let i = keepFirstInstance ? 1 : 0; i < expenseInstances.length ; i++) {
                    misplacedExpensesToRemove.add(expenseInstances[i].expenseId);
                }
            } else {
                // If: (1) There is no instance on this day, (2) It matches freq patterns, (3) not blacklisted,
                // Create an instance of this recurrence expense in the expense array
                if (isFrequencyMatch && !expenseInstanceIsBlacklisted) {
                    const newExpenseItemLanded: ExpenseItemEntity = {
                        expenseId: uuid(),
                        category: recurringExpenseItem.category,
                        amount: recurringExpenseItem.amount,
                        timestamp: date,
                        recurringExpenseId: recurringExpenseItem.recurringExpenseId
                    }
                    handleExpenseCreation(setBudgetArray, setExpenseArray, newExpenseItemLanded)
                }
            }
        }
    })
    if (misplacedExpensesToRemove.size !== 0) {
        await handleBatchExpenseDeletion(misplacedExpensesToRemove);
        setExpenseArray(await getExpenseList());
    }
}