import {ChangeEvent, Dispatch, SetStateAction} from "react";

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

export function capitaliseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCurrencySymbol(currency: string) {
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

export function formatDollarAmountStatic(amount: number, currency: string) {
    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    let currencySymbol = getCurrencySymbol(currency);
    return currencySymbol + formattedNumber;
}

export function formatDollarAmountDynamic(amount: string) {
    const cleanedValue = amount.replace(/[^\d.]/g, "");
    const splitValue = cleanedValue.split(".");
    if (splitValue.length >= 2 && splitValue[1].length > 2) {
        splitValue[1] = splitValue[1].substring(0, 2);
    }
    return splitValue.join(".");
}

function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function formatDate(date: Date) {
    const formattedDayOfWeek = new Intl.DateTimeFormat('en-AU', { weekday: "long" }).format(date);
    const formattedDayOfMonth = date.getDate();
    const formattedMonth = new Intl.DateTimeFormat('en-AU', { month: "long" }).format(date);
    const formattedYear = new Intl.DateTimeFormat('en-AU', { year: "numeric" }).format(date);

    const ordinalSuffix = getOrdinalSuffix(formattedDayOfMonth);

    return `${formattedDayOfWeek}, ${formattedDayOfMonth}${ordinalSuffix} ${formattedMonth} ${formattedYear}`
}


// EXPENSE API CALL FUNCTIONS //

export async function handleExpenseCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            newExpenseItem: ExpenseItemEntity) {
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


export async function getExpenseList() {
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
    }
}


export async function handleExpenseUpdating(expenseId: string, formData: ExpenseUpdatingFormData) {
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

export async function handleRecurringExpenseInstanceUpdating(expenseId: string, formData: RecurringExpenseInstanceUpdatingFormData) {
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


export async function handleExpenseDeletion(expenseId: string,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
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

export async function handleBatchExpenseDeletion(expenseIdArray: string[]) {
    try {
        const response = await fetch("http://localhost:8080/api/batchDeleteExpenses", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseIdsToDelete: expenseIdArray
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

export async function handleBudgetCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>, newBudgetItem: BudgetItemEntity) {
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


export async function getBudgetList() {
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
    }
}


export async function handleBudgetUpdating(category: string | null, formData: BudgetUpdatingFormData) {
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


export async function handleBudgetDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
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

export async function handleGroupCreation(group: string, colour: string, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, newGroupItem: GroupItemEntity) {
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


export async function getGroupList() {
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
        } else if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        } else {
            const responseData = await response.json();
            console.log(responseData)
            return responseData.sort(groupSort);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleGroupUpdating(originalGroupName: string, originalColour: string, formData: BasicGroupData, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, groupArray: GroupItemEntity[]) {
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

export async function handleGroupDeletion(groupName: string,
                                          setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>,
                                          setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                          keepContainedBudgets: boolean) {
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

export async function handleRecurringExpenseCreation(newRecurringExpenseItem: RecurringExpenseItemEntity, setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>) {
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

export async function getRecurringExpenseList() {
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
    }
}

export async function handleRecurringExpenseUpdating(recurringExpenseId: string, formData: RecurringExpenseUpdatingFormData) {
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


export async function handleRecurringExpenseDeletion(recurringExpenseId: string,
                                                     setRecurringExpenseArray: Dispatch<SetStateAction<RecurringExpenseItemEntity[]>>) {
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

export async function handleRemovedRecurringExpenseCreation(recurringExpenseId: string | null,
                                                            timestampOfRemovedInstance: Date,
                                                            setRemovedRecurringExpenseInstances: Dispatch<SetStateAction<RemovedRecurringExpenseItem[]>>) {
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

export async function getRemovedRecurringExpenses() {
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
    }
}


// TOTAL INCOME API CALLS //

export async function getTotalIncome() {
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
        } else {
            const totalIncome = await response.json();
            console.log(totalIncome);
            return(totalIncome.totalIncome);
        }
    } catch (e) {
        console.error(`Failed to execute total income retrieval - ${e}`)
    }
}

export async function handleTotalIncomeUpdating(newTotalIncome: number) {
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

export async function handleWipeExpenses() {
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

export async function handleWipeBudget() {
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

export async function handleWipeData() {
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


// ICON AND COLOUR SELECTOR IMPLEMENTATIONS //

export function addIconSelectionFunctionality(setFormData:
                                                  Dispatch<SetStateAction<BudgetUpdatingFormData>>
                                                  | Dispatch<SetStateAction<BudgetCreationFormData>>
                                                  | Dispatch<SetStateAction<ProfileIconUpdatingFormData>>,
                                              selectorType: string) {
    const icons: NodeListOf<HTMLImageElement> = document.querySelectorAll(`.${selectorType}-icon-selectable`);
    icons.forEach((icon): void => {
        icon.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            const iconPath = icon.getAttribute("data-value")!;

            setFormData((currentFormData: any) => {
                return {...currentFormData, ["iconPath"]: iconPath}
            });
            console.log(`iconPath: ${iconPath}`)

            icons.forEach(icon2 => icon2.classList.remove("selected-icon"));
            icon.classList.add("selected-icon");
        });
    });
}

export function addColourSelectionFunctionality(setFormData: Dispatch<SetStateAction<BasicGroupData>>) {
    const colourElementList: NodeListOf<HTMLImageElement> = document.querySelectorAll(".group-colour-selectable-container");
    colourElementList.forEach(colourSelectable => {
        colourSelectable.addEventListener("click", (e: MouseEvent) => {
            const triangleElement = colourSelectable.firstChild as HTMLDivElement;

            e.preventDefault();
            setFormData((current: BasicGroupData) => {
                return {...current, ["colour"]: triangleElement.getAttribute("data-value")}
            });

            colourElementList.forEach(colourSelectable => {
                const triangle = colourSelectable.firstChild as HTMLDivElement;
                triangle.classList.remove("selectedColour")
            });
            triangleElement.classList.add("selectedColour");
        })
    })
}


// AUTH API CALL FUNCTIONS //

export async function handleUserRegistration(email: string, password: string) {
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

export async function handleUserLogin(email: string, password: string) {
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

export async function logoutOnClick() {
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

export async function checkForUser() {
    try {
        const response = await fetch("http://localhost:8080/api/checkForUser", {
            method: "GET",
        });
        if (response.status === 400) {
            console.error("Failed to check for user status.")
        } else if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.");
            window.alert("Login expired. Please login again.");
            const userStatus = { loggedIn: "false"}
            logoutOnClick()
                .then(() => {
                    console.log(`window.location.href: ${window.location.href}`)
                    window.location.href !== "/login" && (window.location.href = "/login")
                } )
            return userStatus;
        } else {
            const userStatus = await response.json();
            console.log(userStatus)
            return userStatus;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


export async function getSessionEmail() {
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


// SORTING FUNCTIONS //

function groupSort (a: GroupItemEntity, b: GroupItemEntity){
    if (a.group === "Miscellaneous") return 1;
    if (b.group === "Miscellaneous") return -1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
}

function expenseSort(a: ExpenseItemEntity, b: ExpenseItemEntity) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
}

function budgetSort(budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity) {
    try {
        return new Date(budgetItemA.timestamp!).getTime() - new Date(budgetItemB.timestamp!).getTime();
    } catch (e) {
        console.error("Failed to perform budget sort. Below is budgetItemA and B.")
        console.log(budgetItemA);
        console.log(budgetItemB);
    }
}

// PUBLIC USER DATA API CALLS //


export async function getPublicUserData() {
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


// REACT SELECTOR OPTIONS AND STYLING

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

// CURRENCY //

export const currencyOptions = [
    { symbol: '$AUD', code: 'AUD' },
    { symbol: '$USD', code: 'USD' },
    { symbol: '£GBP', code: 'GBP' },
    { symbol: '₩KRW', code: 'KRW' },
    { symbol: '¥JPY', code: 'JPY' },
    { symbol: '¥CNY', code: 'CNY' },
];

// DYNAMIC SIZING FUNCTIONS //


export function dynamicallySizeBudgetNameDisplays() {
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

export function dynamicallySizeBudgetNumberDisplays() {
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

export function recurringExpenseLandsOnDay(recurringExpenseItem: RecurringExpenseItemEntity, dateToAnalyseForExpenseLanding: Date) {
    const creationDate = new Date(recurringExpenseItem.timestamp);
    const frequency = recurringExpenseItem.frequency;

    creationDate.setHours(0, 0, 0, 0);
    dateToAnalyseForExpenseLanding.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(dateToAnalyseForExpenseLanding.getTime() - creationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

export function getRecurringExpenseInstanceOrNull(expenseArray: ExpenseItemEntity[], recurringExpenseItem: RecurringExpenseItemEntity, date: Date) {
    const expenseIdOfInstance = expenseArray.find((expenseItem: ExpenseItemEntity) => {
        return (expenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
            && new Date(expenseItem.timestamp).getTime() === new Date(date).getTime())
    })
    return expenseIdOfInstance ? expenseIdOfInstance : null;
}


export function getRandomGroupColour() {
    const randomColourIndex = Math.floor(Math.random() * groupColourArray.length);
    return groupColourArray[randomColourIndex];
}

export function getGroupBudgetTotal(filteredBudgetArray: BudgetItemEntity[]) {
    return filteredBudgetArray.map(budgetItem => budgetItem.amount)
        .reduce( (acc, amountSpent) => acc + amountSpent, 0)
}

export function getGroupExpenditureTotal(expenseArray: ExpenseItemEntity[], filteredBudgetArray: BudgetItemEntity[]) {
    const categoriesInGroup = filteredBudgetArray.map(expenseItem => expenseItem.category)
    const filteredExpenseArray = expenseArray.filter(expenseItem => categoriesInGroup.includes(expenseItem.category));
    return filteredExpenseArray.reduce((acc, expenseItem) => acc + expenseItem.amount, 0);
}

export function getGroupOfCategory(budgetArray: BudgetItemEntity[], category: string) {
    try {
        return budgetArray.filter(budgetItemEntity => budgetItemEntity.category === category)[0].group
    } catch (e) {
        console.log(`Failed to retrieve the group of category ${category}. Temporarily assuming Miscellaneous.`)
        return "Miscellaneous";
    }
}

export function getColourOfGroup(groupName: string, groupArray: GroupItemEntity[]) {
    const groupOption = groupArray.filter(groupItemEntity => groupItemEntity.group === groupName)[0];
    return groupOption.colour ? groupOption.colour : null;
}

export function getTotalAmountBudgeted(budgetArray: BudgetItemEntity[]) {
    const amountArray = budgetArray.map( budgetItem => (
        budgetItem.amount
    ))
    return amountArray.reduce((accumulator, currentValue) => (
        accumulator + currentValue
    ), 0)
}

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

export function getLineAngle(percentageIncomeRemaining: number) {
    console.log(`Received percentageIncomeRemaining: ${percentageIncomeRemaining}`)
    const functionalPercentageIncomeRemaining = percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining
    console.log(`Received functionalPercentageIncomeRemaining: ${functionalPercentageIncomeRemaining}`)
    return functionalPercentageIncomeRemaining <= -100 ? 14.5 :
        functionalPercentageIncomeRemaining === 100 ? -14.5 :
            functionalPercentageIncomeRemaining / (-100 / 14.5);
}

export function handleInputChangeOnFormWithAmount(e: ChangeEvent<HTMLInputElement>, setFormData: Dispatch<SetStateAction<any>>) {
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

export function checkForOpenModalOrForm(expenseFormVisibility: ExpenseFormVisibility
                                            | BudgetFormVisibility
                                            | RecurringExpenseFormVisibility
                                            | SettingsFormVisibility,
                                        expenseModalVisibility: ExpenseModalVisibility
                                            | BudgetModalVisibility
                                            | RecurringExpenseModalVisibility
                                            | SettingsModalVisibility) {
    return Object.values(expenseFormVisibility).includes(true) || Object.values(expenseModalVisibility).includes(true)
}

export function getWindowLocation() {
    const urlArray = window.location.href.split("/");
    return urlArray[urlArray.length - 1];
}

export function matchingRemovedRecurringExpenseFound(removedRecurringExpenseInstances: RemovedRecurringExpenseItem[], recurringExpenseItem: RecurringExpenseItemEntity, date: Date) {
    const checkResult = removedRecurringExpenseInstances.find(removedRecurringExpenseItem => {
        return removedRecurringExpenseItem.recurringExpenseId === recurringExpenseItem.recurringExpenseId
            && new Date(removedRecurringExpenseItem.timestampOfRemovedInstance).toLocaleDateString() === new Date(date).toLocaleDateString()
    })
    return checkResult !== undefined;
}


export function getMonthsFromToday(month: number, year: number) {
    const dateToday = new Date();
    const currentMonth = dateToday.getMonth();
    const currentYear = dateToday.getFullYear();
    return 12 * (currentYear - year) + currentMonth - month;
}
