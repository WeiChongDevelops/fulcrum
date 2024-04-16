// EXPENSE API CALL FUNCTIONS //

import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  PublicUserData,
  RecurringExpenseItemEntity,
} from "./types.ts";
import { budgetSort, DEFAULT_CATEGORY_GROUP, DEFAULT_CATEGORY_ICON, expenseSort, groupSort } from "./util.ts";

/**
 * Handles the creation of a new expense item.
 * @param newExpenseItem - The new expense item to be added.
 */
export async function handleExpenseCreation(newExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/createExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenseId: newExpenseItem.expenseId,
        category: newExpenseItem.category,
        amount: newExpenseItem.amount,
        timestamp: newExpenseItem.timestamp,
        recurringExpenseId: newExpenseItem.recurringExpenseId,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting expense creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting expense creation: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting expense creation: ${e}`);
    throw e;
  }
}

/**
 * Handles the deletion of multiple expense items in a batch operation.
 * @param expensesToCreate - An array of the expenses to be deleted.
 */
export async function handleBatchExpenseCreation(expensesToCreate: ExpenseItemEntity[]): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/batchCreateExpenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expensesToCreate: expensesToCreate,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting batch expense creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting batch expense creation: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting batch expense creation: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      console.error("JWT token expiry detected. Logging out.");
      logoutOnClick().then(() => {
        window.location.href !== "/login" && (window.location.href = "/login");
      });
    }
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting expense list retrieval: ${response.status}`);
      throw new Error(`A HTTP error occurred while fetching the expense list.`);
    }
    const responseData = await response.json();
    console.log({ Expense_List_Retrieved: responseData.sort(expenseSort) });
    return responseData.sort(expenseSort);
  } catch (e) {
    console.error(`Exception encountered when requesting expense list retrieval: ${e}`);
    throw new Error(`An error occurred while fetching the expense list: ${e}.`);
  }
}

/**
 * Handles the updating of an existing expense item.
 * @param updatedExpenseItem - The updated data for the expense item.
 */
export async function handleExpenseUpdating(updatedExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/updateExpense", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenseId: updatedExpenseItem.expenseId,
        category: updatedExpenseItem.category,
        amount: updatedExpenseItem.amount,
        timestamp: updatedExpenseItem.timestamp,
        recurringExpenseId: updatedExpenseItem.recurringExpenseId,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting expense update: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting expense update: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting expense update: ${e}`);
    throw e;
  }
}

/**
 * Handles the deletion of a specific expense item.
 * @param expenseId - The ID of the expense to be deleted.
 */
export async function handleExpenseDeletion(expenseId: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/deleteExpense", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenseId: expenseId,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting expense deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting expense deletion: ${response.status}`);
    } else {
      console.log(await response.json());
    }
  } catch (e) {
    console.error(`Exception encountered when requesting expense deletion: ${e}`);
    throw e;
  }
}

/**
 * Handles the deletion of multiple expense items in a batch operation.
 * @param expenseIdsToDelete - An array of IDs of the expenses to be deleted.
 */
export async function handleBatchExpenseDeletion(expenseIdsToDelete: string[]): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/batchDeleteExpenses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expenseIdsToDelete: expenseIdsToDelete,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when performing batch expense deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when performing batch expense deletion: ${response.status}`);
    }
    console.log(await response.json());
  } catch (e) {
    console.error(`Exception encountered when requesting batch expense deletion: ${e}`);
    throw e;
  }
}

// BUDGET API CALL FUNCTIONS //

/**
 * Creates a new budget item and updates the budget array state.
 * @param newBudgetItem - The new budget item to be added.u
 */
export async function handleBudgetCreation(newBudgetItem: BudgetItemEntity): Promise<void> {
  try {
    console.log(`Found path: ${newBudgetItem.iconPath}`);
    const response = await fetch("http://localhost:8080/api/createBudget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: newBudgetItem.category.trim(),
        amount: newBudgetItem.amount ? newBudgetItem.amount : 0,
        iconPath: newBudgetItem.iconPath != "" ? newBudgetItem.iconPath : DEFAULT_CATEGORY_ICON,
        group: newBudgetItem.group ? newBudgetItem.group.trim() : DEFAULT_CATEGORY_GROUP,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting budget creation: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting budget creation: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      console.error("JWT token expiry detected. Logging out.");
      logoutOnClick().then(() => {
        window.location.href !== "/login" && (window.location.href = "/login");
      });
    } else if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget list retrieval: ${response.status}`);
      throw new Error(`A HTTP error occurred while fetching the budget list.`);
    }
    const responseData = await response.json();
    console.log({ Budget_List_Retrieved: responseData.sort(budgetSort) });
    return responseData.sort(budgetSort);
  } catch (e) {
    console.error(`Exception encountered when requesting budget list retrieval: ${e}`);
    throw e;
  }
}

/**
 * Updates an existing budget item based on the provided form data.
 * @param originalCategory - The category of the budget item to update.
 * @param updatedBudgetItem - The updated data for the budget item.
 */
export async function handleBudgetUpdating(originalCategory: string, updatedBudgetItem: BudgetItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/updateBudget", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: originalCategory,
        newCategoryName: updatedBudgetItem.category.trim(),
        amount: updatedBudgetItem.amount,
        group: updatedBudgetItem.group.trim(),
        iconPath: updatedBudgetItem.iconPath,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget updating: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting budget updating: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting budget updating: ${e}`);
    throw e;
  }
}

/**
 * Deletes a budget item.
 * @param category - The category of the budget item to be deleted.
 */
export async function handleBudgetDeletion(category: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/deleteBudget", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: category,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting budget deletion: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting budget deletion: ${e}`);
    throw e;
  }
}

// GROUP API CALL FUNCTIONS //

/**
 * Creates a new budget category group.
 * @param newGroupItem - The new group item data.
 */
export async function handleGroupCreation(newGroupItem: GroupItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/createGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group: newGroupItem.group,
        colour: newGroupItem.colour,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting group creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting group creation: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting group creation: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      console.error("JWT token expiry detected. Logging out.");
      logoutOnClick().then(() => {
        window.location.href !== "/login" && (window.location.href = "/login");
      });
    } else if (!response.ok) {
      console.error(`HTTP error when attempting group list retrieval: ${response.status}`);
      throw new Error(`A HTTP error occurred while fetching the group list.`);
    }
    const responseData = await response.json();
    console.log({ Groups_Retrieved: responseData.sort(groupSort) });
    return responseData.sort(groupSort);
  } catch (e) {
    console.error(`Exception encountered when requesting group list retrieval: ${e}`);
    throw e;
  }
}

/**
 * Updates an existing budget category group.
 * @param originalGroupName - The original name of the group being updated.
 * @param updatedGroupItem - The new data for the group.
 */
export async function handleGroupUpdating(originalGroupName: string, updatedGroupItem: GroupItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/updateGroup", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalGroupName: originalGroupName,
        newGroupName: updatedGroupItem.group.trim(),
        newColour: updatedGroupItem.colour ? updatedGroupItem.colour : "",
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error when attempting group update: ${response.status}`);
      throw new Error(`HTTP error when attempting group update: ${response.status}`);
    } else {
      console.log("Group successfully updated.");
    }
  } catch (e) {
    console.error(`Exception encountered when requesting group update: ${e}`);
    throw e;
  }
}

/**
 * Handles the deletion of a group and optionally keeps the contained budgets.
 * @param groupName - The name of the group to be deleted.
 * @param keepContainedBudgets - Flag to keep or delete budgets contained within the group.
 */
export async function handleGroupDeletion(groupName: string, keepContainedBudgets: boolean): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/deleteGroup", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group: groupName,
        keepContainedBudgets: keepContainedBudgets,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting group deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting group deletion: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting group deletion: ${e}`);
    throw e;
  }
}

/// RECURRING EXPENSES API CALL FUNCTIONS //

/**
 * Handles the creation of a new recurring expense.
 * @param newRecurringExpenseItem - The data for the new recurring expense.
 */
export async function handleRecurringExpenseCreation(newRecurringExpenseItem: RecurringExpenseItemEntity): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/createRecurringExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurringExpenseId: newRecurringExpenseItem.recurringExpenseId,
        category: newRecurringExpenseItem.category,
        amount: newRecurringExpenseItem.amount,
        timestamp: newRecurringExpenseItem.timestamp,
        frequency: newRecurringExpenseItem.frequency as String,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting recurring expense creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting recurring expense creation: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting recurring expense creation: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      console.error("JWT token expiry detected. Logging out.");
      logoutOnClick().then(() => {
        window.location.href !== "/login" && (window.location.href = "/login");
      });
    }
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting recurring expense list retrieval: ${response.status}`);
      throw new Error(`A HTTP error occurred while fetching the recurring expense list}.`);
    }
    const responseData = await response.json();
    console.log({ Recurring_Expenses_Retrieved: responseData.sort(expenseSort) });
    return responseData.sort(expenseSort);
  } catch (e) {
    console.error(`Exception encountered when requesting recurring expense list retrieval: ${e}`);
    throw e;
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
    const response = await fetch("http://localhost:8080/api/updateRecurringExpense", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurringExpenseId: updatedRecurringExpenseItem.recurringExpenseId,
        category: updatedRecurringExpenseItem.category,
        amount: updatedRecurringExpenseItem.amount,
        timestamp: updatedRecurringExpenseItem.timestamp,
        frequency: updatedRecurringExpenseItem.frequency,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting recurring expense deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting recurring expense deletion: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting recurring expense deletion: ${e}`);
    throw e;
  }
}

/**
 * Deletes a specified recurring expense.
 * @param recurringExpenseId - The ID of the recurring expense to delete.
 */
export async function handleRecurringExpenseDeletion(recurringExpenseId: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/deleteRecurringExpense", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurringExpenseId: recurringExpenseId,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting recurring expense deletion: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting recurring expense deletion: ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
  } catch (e) {
    console.error(`Exception encountered when requesting recurring expense deletion: ${e}`);
    throw e;
  }
}

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
    const response = await fetch("http://localhost:8080/api/createBlacklistedExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurringExpenseId: recurringExpenseId!,
        timestampOfRemovedInstance: timestampOfRemovedInstance,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting blacklist entry creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting blacklist entry creation: ${response.status}`);
    } else {
      const responseData = await response.json();
      console.log(responseData);
    }
  } catch (e) {
    console.error(`Exception encountered when requesting blacklist entry creation: ${e}`);
    throw e;
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
    const response = await fetch("http://localhost:8080/api/batchCreateBlacklistedExpenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurringExpenseId: recurringExpenseId,
        timestampsToBlacklist: timestampsToBlacklist,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting batch blacklist entry creation: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting batch blacklist entry creation: ${response.status}`);
    }
    console.log(await response.json());
  } catch (e) {
    console.error(`Exception encountered when requesting batch blacklist entry creation: ${e}`);
    throw e;
  }
}

/**
 * Retrieves the list of removed recurring expense instances from the server, for blacklist purposes.
 * @returns An array of removed recurring expense instances.
 */
export async function getBlacklistedExpenses(): Promise<BlacklistedExpenseItemEntity[]> {
  try {
    const response = await fetch("http://localhost:8080/api/getBlacklistedExpenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`HTTP error encountered when attempting blacklist retrieval: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting blacklist retrieval: ${response.status}`);
    }
    const blacklistedExpenses = await response.json();
    console.log({ Blacklisted_Expenses_Retrieved: blacklistedExpenses });
    return blacklistedExpenses;
  } catch (e) {
    console.error(`Exception encountered when requesting blacklist retrieval: ${e}`);
    throw e;
  }
}

// TOTAL INCOME API CALLS //

/**
 * Retrieves the total income from the server.
 * @returns The total income as a number, or the default of $1,000 in case of an error.
 */
export async function getTotalIncome(): Promise<number> {
  try {
    const response = await fetch("http://localhost:8080/api/getTotalIncome", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting total income retrieval: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting total income retrieval: ${response.status}`);
    }
    const totalIncome = await response.json();
    console.log(totalIncome);
    return totalIncome.totalIncome;
  } catch (e) {
    console.error(`Exception encountered when requesting total income retrieval: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalIncome: newTotalIncome,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting total income wipe: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting total income wipe: ${response.status}`);
    } else {
      console.log(await response.json());
    }
  } catch (e) {
    console.error(`Exception encountered when requesting total income wipe: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`HTTP error when attempting expense wipe: ${response.status}`);
      throw new Error(`HTTP error when attempting expense wipe: ${response.status}`);
    }
    console.log(await response.json());
  } catch (e) {
    console.error(`Exception encountered when requesting expense wipe: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget wipe: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting budget wipe: ${response.status}`);
    }
    console.log(await response.json());
  } catch (e) {
    console.error(`Exception encountered when requesting budget wipe: ${e}`);
    throw e;
  }
}

/**
 * Resets all budget records to default settings.
 */
export async function handleRestoreDefaultBudget(): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080/api/restoreDefaultBudget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting budget default restore: ${response.status}`);
      throw new Error(`HTTP error encountered when attempting budget default restore: ${response.status}`);
    }
    console.log(await response.json());
  } catch (e) {
    console.error(`Exception encountered when requesting budget default restore: ${e}`);
    throw e;
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      console.error(
        `User with given email may already exist. HTTP error encountered when attempting user registration: ${response.status}`,
      );
      throw new Error(
        `User with given email may already exist. HTTP error encountered when attempting user registration: ${response.status}`,
      );
    }
  } catch (e) {
    console.error("Error:", e);
    throw e;
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (response.status === 400) {
      console.error(`Credentials may be incorrect. HTTP error encountered when attempting login: ${response.status}`);
      throw new Error(`Credentials may be incorrect. HTTP error encountered when attempting login: ${response.status}`);
    }
  } catch (e) {
    console.error(`Exception encountered when requesting user login: ${e}`);
    throw e;
  }
}

/**
 * Logs out the current user and redirects to the login page.
 */
export async function logoutOnClick(): Promise<void> {
  try {
    sessionStorage.removeItem("email");
    const response = await fetch("http://localhost:8080/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting logout: ${response.status}`);
    }
    window.location.href = "/login";
  } catch (e) {
    console.error(`Exception encountered when requesting logout: ${e}`);
  }
}

/**
 * Retrieves the email address of the active user, or null if no user is currently authenticated.
 * @return - The active email, or null if there is no active user
 */
export async function getSessionEmailOrNull(): Promise<any> {
  try {
    const response = await fetch("http://localhost:8080/api/getActiveUserEmailOrNull", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when requesting session email: ${response.status}`);
    } else {
      const responseData = await response.json();
      console.log(responseData);
      return responseData.email;
    }
  } catch (e) {
    console.error(`Exception encountered when requesting session email: ${e}`);
    return null;
  }
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
        "Content-Type": "application/json",
      },
    });
    if (response.status === 401) {
      console.error("JWT token expiry detected. Logging out.");
      logoutOnClick().then(() => {
        window.location.href !== "/login" && (window.location.href = "/login");
      });
    } else if (!response.ok) {
      console.error(`HTTP error encountered when attempting public user data retrieval: ${response.status}`);
      throw new Error(`A HTTP error occurred while fetching public user data.`);
    } else {
      const publicUserData = await response.json();
      console.log("Public User Data:");
      console.log(publicUserData);
      return publicUserData;
    }
  } catch (e) {
    console.error(`Exception encountered when requesting public user data retrieval: ${e}`);
    throw new Error(`An error occurred while fetching public user data: ${e}.`);
  }
}

/**
 * Updates public user data with the specified settings.
 * @param updatedPublicUserData - The updated public user data.
 */
export async function handlePublicUserDataUpdating(updatedPublicUserData: PublicUserData) {
  try {
    const response = await fetch("http://localhost:8080/api/updatePublicUserData", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: updatedPublicUserData.currency,
        darkModeEnabled: updatedPublicUserData.darkModeEnabled,
        accessibilityEnabled: updatedPublicUserData.accessibilityEnabled,
        profileIconFileName: updatedPublicUserData.profileIconFileName,
      }),
    });
    if (!response.ok) {
      console.error(`HTTP error encountered when attempting public user data update: ${response.status}`);
    } else {
      const publicUserData = await response.json();
      console.log(publicUserData);
      return publicUserData;
    }
  } catch (e) {
    console.log(`Exception encountered when requesting public user data retrieval: ${e}`);
  }
}
