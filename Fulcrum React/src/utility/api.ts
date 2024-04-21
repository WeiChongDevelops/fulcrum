// Expense API //

import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "./types.ts";
import { budgetSort, DEFAULT_CATEGORY_GROUP, DEFAULT_CATEGORY_ICON, expenseSort, groupSort } from "./util.ts";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired or not valid, redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/**
 * Handles the creation of a new expense item.
 * @param newExpenseItem - The new expense item to be added.
 */
export async function handleExpenseCreation(newExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    const response = await apiClient.post("/createExpense", {
      expenseId: newExpenseItem.expenseId,
      category: newExpenseItem.category,
      amount: newExpenseItem.amount,
      timestamp: newExpenseItem.timestamp,
      recurringExpenseId: newExpenseItem.recurringExpenseId,
    });

    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw Error(`Error encountered when requesting expense creation: ${error.message}`);
    } else {
      throw Error("Error encountered when requesting expense creation.");
    }
  }
}

/**
 * Handles the creation of multiple expense items in a batch operation.
 * @param expensesToCreate - An array of expenses to be created.
 */
export async function handleBatchExpenseCreation(expensesToCreate: ExpenseItemEntity[]): Promise<void> {
  try {
    const response = await apiClient.post("/batchCreateExpenses", {
      expensesToCreate: expensesToCreate,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting batch expense creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting batch expense creation.");
    }
  }
}

/**
 * Retrieves the list of expense items from the server.
 * @returns A sorted array of expense items, or an empty array in case of an error.
 */
export async function getExpenseList(): Promise<ExpenseItemEntity[]> {
  try {
    const response = await apiClient.get("/getExpenses");
    console.log({ Expense_List_Retrieved: response.data.sort(expenseSort) });
    return response.data.sort(expenseSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the expense list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered when requesting expense list retrieval.");
    }
  }
}

/**
 * Handles the updating of an existing expense item.
 * @param updatedExpenseItem - The updated data for the expense item.
 */
export async function handleExpenseUpdating(updatedExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    const response = await apiClient.put("/updateExpense", {
      expenseId: updatedExpenseItem.expenseId,
      category: updatedExpenseItem.category,
      amount: updatedExpenseItem.amount,
      timestamp: updatedExpenseItem.timestamp,
      recurringExpenseId: updatedExpenseItem.recurringExpenseId,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting expense update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting expense update.");
    }
  }
}

/**
 * Handles the deletion of a specific expense item.
 * @param expenseId - The ID of the expense to be deleted.
 */
export async function handleExpenseDeletion(expenseId: string): Promise<void> {
  try {
    const response = await apiClient.delete("/deleteExpense", {
      data: { expenseId: expenseId },
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting expense deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting expense deletion.");
    }
  }
}

/**
 * Handles the deletion of multiple expense items in a batch operation.
 * @param expenseIdsToDelete - An array of IDs of the expenses to be deleted.
 */
export async function handleBatchExpenseDeletion(expenseIdsToDelete: string[]): Promise<void> {
  try {
    const response = await apiClient.delete("/batchDeleteExpenses", {
      data: { expenseIdsToDelete: expenseIdsToDelete },
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting batch expense deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting batch expense deletion.");
    }
  }
}

// Budget API //

/**
 * Creates a new budget item and updates the budget array state.
 * @param newBudgetItem - The new budget item to be added.u
 */
export async function handleBudgetCreation(newBudgetItem: BudgetItemEntity): Promise<void> {
  try {
    console.log(`Found path: ${newBudgetItem.iconPath}`);
    const response = await apiClient.post("/createBudget", {
      category: newBudgetItem.category.trim(),
      amount: newBudgetItem.amount ? newBudgetItem.amount : 0,
      iconPath: newBudgetItem.iconPath != "" ? newBudgetItem.iconPath : DEFAULT_CATEGORY_ICON,
      group: newBudgetItem.group ? newBudgetItem.group.trim() : DEFAULT_CATEGORY_GROUP,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget creation.");
    }
  }
}

/**
 * Retrieves the list of budget items from the server.
 * @returns A sorted array of budget items, or an empty array in case of an error.
 */
export async function getBudgetList(): Promise<BudgetItemEntity[]> {
  try {
    const response = await apiClient.get("/getBudget");
    console.log({ Budget_List_Retrieved: response.data.sort(budgetSort) });
    return response.data.sort(budgetSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the budget list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered when requesting budget list retrieval.");
    }
  }
}

/**
 * Updates an existing budget item based on the provided form data.
 * @param originalCategory - The category of the budget item to update.
 * @param updatedBudgetItem - The updated data for the budget item.
 */
export async function handleBudgetUpdating(originalCategory: string, updatedBudgetItem: BudgetItemEntity): Promise<void> {
  try {
    const response = await apiClient.put("/updateBudget", {
      category: originalCategory,
      newCategoryName: updatedBudgetItem.category.trim(),
      amount: updatedBudgetItem.amount,
      group: updatedBudgetItem.group.trim(),
      iconPath: updatedBudgetItem.iconPath,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget updating: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget updating.");
    }
  }
}

/**
 * Deletes a budget item.
 * @param category - The category of the budget item to be deleted.
 */
export async function handleBudgetDeletion(category: string): Promise<void> {
  try {
    const response = await apiClient.delete("/deleteBudget", {
      data: { category: category },
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget deletion.");
    }
  }
}

// Group API //

/**
 * Creates a new budget category group.
 * @param newGroupItem - The new group item data.
 */
export async function handleGroupCreation(newGroupItem: GroupItemEntity): Promise<void> {
  try {
    const response = await apiClient.post("/createGroup", {
      group: newGroupItem.group,
      colour: newGroupItem.colour,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting group creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting group creation.");
    }
  }
}

/**
 * Retrieves the list of groups from the server.
 * @returns A sorted array of group items, or an empty array in case of an error.
 */
export async function getGroupList(): Promise<GroupItemEntity[]> {
  try {
    const response = await apiClient.get("/getGroups");
    console.log({ Groups_Retrieved: response.data.sort(groupSort) });
    return response.data.sort(groupSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the group list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered when requesting group list retrieval.");
    }
  }
}

/**
 * Updates an existing budget category group.
 * @param originalGroupName - The original name of the group being updated.
 * @param updatedGroupItem - The new data for the group.
 */
export async function handleGroupUpdating(originalGroupName: string, updatedGroupItem: GroupItemEntity): Promise<void> {
  try {
    await apiClient.put("/updateGroup", {
      originalGroupName: originalGroupName,
      newGroupName: updatedGroupItem.group.trim(),
      newColour: updatedGroupItem.colour ? updatedGroupItem.colour : "",
    });
    console.log("Group successfully updated.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting group update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting group update.");
    }
  }
}

/**
 * Handles the deletion of a group and optionally keeps the contained budgets.
 * @param groupName - The name of the group to be deleted.
 * @param keepContainedBudgets - Flag to keep or delete budgets contained within the group.
 */
export async function handleGroupDeletion(groupName: string, keepContainedBudgets: boolean): Promise<void> {
  try {
    const response = await apiClient.delete("/deleteGroup", {
      data: {
        group: groupName,
        keepContainedBudgets: keepContainedBudgets,
      },
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting group deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting group deletion.");
    }
  }
}

/// Recurring Expense API //

/**
 * Handles the creation of a new recurring expense.
 * @param newRecurringExpenseItem - The data for the new recurring expense.
 */
export async function handleRecurringExpenseCreation(newRecurringExpenseItem: RecurringExpenseItemEntity): Promise<void> {
  try {
    const response = await apiClient.post("/createRecurringExpense", {
      recurringExpenseId: newRecurringExpenseItem.recurringExpenseId,
      category: newRecurringExpenseItem.category,
      amount: newRecurringExpenseItem.amount,
      timestamp: newRecurringExpenseItem.timestamp,
      frequency: newRecurringExpenseItem.frequency as string,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting recurring expense creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting recurring expense creation.");
    }
  }
}

/**
 * Retrieves the list of recurring expenses from the server.
 * @returns A sorted array of recurring expense items, or an empty array in case of an error.
 */
export async function getRecurringExpenseList(): Promise<RecurringExpenseItemEntity[]> {
  try {
    const response = await apiClient.get("/getRecurringExpenses");
    console.log({ Recurring_Expenses_Retrieved: response.data.sort(expenseSort) });
    return response.data.sort(expenseSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the recurring expense list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered while fetching the recurring expense list.");
    }
  }
}

/**
 * Updates the details of an existing recurring expense.
 * @param updatedRecurringExpenseItem - The updated recurring expense item.
 */
export async function handleRecurringExpenseUpdating(
  updatedRecurringExpenseItem: RecurringExpenseItemEntity,
): Promise<void> {
  try {
    const response = await apiClient.put("/updateRecurringExpense", {
      recurringExpenseId: updatedRecurringExpenseItem.recurringExpenseId,
      category: updatedRecurringExpenseItem.category,
      amount: updatedRecurringExpenseItem.amount,
      timestamp: updatedRecurringExpenseItem.timestamp,
      frequency: updatedRecurringExpenseItem.frequency,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting recurring expense update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting recurring expense update.");
    }
  }
}

/**
 * Deletes a specified recurring expense.
 * @param recurringExpenseId - The ID of the recurring expense to delete.
 */
export async function handleRecurringExpenseDeletion(recurringExpenseId: string): Promise<void> {
  try {
    const response = await apiClient.delete("/deleteRecurringExpense", {
      data: { recurringExpenseId: recurringExpenseId },
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting recurring expense deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting recurring expense deletion.");
    }
  }
}

// Blacklist API //

/**
 * Creates a record for a removed instance of a recurring expense, for blacklist purposes.
 * @param recurringExpenseId - The ID of the recurring expense from which an instance is removed.
 * @param timestampOfRemovedInstance - The timestamp of the removed expense instance.
 */
export async function handleBlacklistedExpenseCreation(
  recurringExpenseId: string,
  timestampOfRemovedInstance: Date,
): Promise<void> {
  try {
    const response = await apiClient.post("/createBlacklistedExpense", {
      recurringExpenseId: recurringExpenseId,
      timestampOfRemovedInstance: timestampOfRemovedInstance,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting blacklist entry creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting blacklist entry creation.");
    }
  }
}

/**
 * Handles the deletion of multiple expense items in a batch operation.
 * @param recurringExpenseId - The recurring expense ID shared by the new blacklist entries.
 * @param timestampsToBlacklist - A set of Dates to include in blacklist entries.
 */
export async function handleBatchBlacklistedExpenseCreation(
  recurringExpenseId: string,
  timestampsToBlacklist: Date[],
): Promise<void> {
  try {
    const response = await apiClient.post("/batchCreateBlacklistedExpenses", {
      recurringExpenseId: recurringExpenseId,
      timestampsToBlacklist: timestampsToBlacklist,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting batch blacklist entry creation: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting batch blacklist entry creation.");
    }
  }
}

/**
 * Retrieves the list of removed recurring expense instances from the server, for blacklist purposes.
 * @returns An array of removed recurring expense instances.
 */
export async function getBlacklistedExpenses(): Promise<BlacklistedExpenseItemEntity[]> {
  try {
    const response = await apiClient.get("/getBlacklistedExpenses");
    console.log({ Blacklisted_Expenses_Retrieved: response.data });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting blacklist retrieval: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting blacklist retrieval.");
    }
  }
}

// Total Income API //

/**
 * Retrieves the total income from the server.
 * @returns The total income as a number, or the default of $1,000 in case of an error.
 */
export async function getTotalIncome(): Promise<number> {
  try {
    const response = await apiClient.get("/getTotalIncome");
    console.log(response.data);
    return response.data.totalIncome;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting total income retrieval: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting total income retrieval.");
    }
  }
}

/**
 * Updates the total income value on the server.
 * @param newTotalIncome - The new total income value.
 */
export async function handleTotalIncomeUpdating(newTotalIncome: number): Promise<void> {
  try {
    const response = await apiClient.put("/updateTotalIncome", {
      totalIncome: newTotalIncome,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting total income update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting total income update.");
    }
  }
}

// Broad Destructive API //

/**
 * Deletes all user expense records.
 */
export async function handleWipeExpenses(): Promise<void> {
  try {
    const response = await apiClient.delete("/wipeExpenses");
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting expense wipe: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting expense wipe.");
    }
  }
}

/**
 * Deletes all user budget records.
 */
export async function handleWipeBudget(): Promise<void> {
  try {
    const response = await apiClient.delete("/wipeBudget");
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting budget wipe: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting budget wipe.");
    }
  }
}

/**
 * Resets all budget records to default settings.
 */
export async function handleRestoreDefaultBudget(): Promise<void> {
  try {
    const response = await apiClient.post("/restoreDefaultBudget");
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting budget default restore: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting budget default restore.");
    }
  }
}

// Auth API //

/**
 * Attempts to register a new user with the provided email and password.
 * Redirects to the login page on successful registration.
 */
export async function handleUserRegistration(email: string, password: string): Promise<void> {
  try {
    const response = await apiClient.post("/register", {
      email: email,
      password: password,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting user registration: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting user registration.");
    }
  }
}

/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 */
export async function handleUserLogin(email: string, password: string): Promise<void> {
  try {
    const response = await apiClient.post("/login", {
      email: email,
      password: password,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting login.");
    }
  }
}

/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 */
export async function handleUserOAuthLoginPrompt(provider: string): Promise<void> {
  try {
    const response = await apiClient.post("/oAuthLoginPrompt", {
      provider: provider,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting oauth login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting oauth login.");
    }
  }
}

/**
 * Attempts to log in a user with the provided email and password.
 * Redirects to the budget page on successful login.
 */
export async function handleUserOAuthLoginAttempt(accessToken: string, refreshToken: string): Promise<void> {
  try {
    const response = await apiClient.post("/oAuthLoginAttempt", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting oauth login: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting oauth login.");
    }
  }
}

export async function handleUserOAuthInit(): Promise<void> {
  try {
    const response = await apiClient.post("/oAuthDataInitialisation");
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting oauth init: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting oauth init.");
    }
  }
}

/**
 * Logs out the current user and redirects to the login page.
 */
export async function handleUserLogout(): Promise<void> {
  try {
    sessionStorage.removeItem("email");
    window.location.href = "/login";
    await apiClient.post("/logout", {
      jwt: localStorage.getItem("jwt"),
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting logout: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting logout.");
    }
  }
}

/**
 * Retrieves the email address of the active user, or null if no user is currently authenticated.
 * @return - The active email, or null if there is no active user
 */
export async function getSessionEmailOrNull(): Promise<string | null> {
  try {
    const response = await apiClient.get("/getActiveUserEmailOrNull");
    return response.data.email;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting session email: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting session email.");
    }
  }
}

// Public User Data API //

/**
 * Retrieves public user data.
 */
export async function getPublicUserData(): Promise<PublicUserData> {
  try {
    const response = await apiClient.get("/getPublicUserData");
    console.log("Public User Data:");
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching public user data: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered while fetching public user data.");
    }
  }
}

/**
 * Updates public user data with the specified settings.
 * @param updatedPublicUserData - The updated public user data.
 */
export async function handlePublicUserDataUpdating(updatedPublicUserData: PublicUserData): Promise<void> {
  try {
    const response = await apiClient.put("/updatePublicUserData", {
      currency: updatedPublicUserData.currency,
      darkModeEnabled: updatedPublicUserData.darkModeEnabled,
      accessibilityEnabled: updatedPublicUserData.accessibilityEnabled,
      profileIconFileName: updatedPublicUserData.profileIconFileName,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting public user data update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting public user data update.");
    }
  }
}
