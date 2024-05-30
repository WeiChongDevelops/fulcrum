import { ExpenseItemEntity } from "@/utility/types.ts";
import { expenseSort } from "@/utility/util.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Handles the creation of a new expense item.
 * @param newExpenseItem - The new expense item to be added.
 */
export async function handleExpenseCreationDirect(newExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    // const response = await apiClient.post("/createExpense", {
    //   expenseId: newExpenseItem.expenseId,
    //   category: newExpenseItem.category,
    //   amount: newExpenseItem.amount,
    //   timestamp: newExpenseItem.timestamp,
    //   recurringExpenseId: newExpenseItem.recurringExpenseId,
    // });
    // console.log(response.data);
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("expenses")
      .insert({
        userId: activeUserId,
        expenseId: newExpenseItem.expenseId,
        category: newExpenseItem.category,
        timestamp: newExpenseItem.timestamp,
        amount: newExpenseItem.amount,
        recurringExpenseId: newExpenseItem.recurringExpenseId,
      })
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ insertedExpense: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting expense creation: ${error.message}`);
    } else {
      throw new Error("Error encountered when attempting expense creation.");
    }
  }
}

/**
 * Handles the creation of multiple expense items in a batch operation.
 * @param expensesToCreate - An array of expenses to be created.
 */
export async function handleBatchExpenseCreationDirect(expensesToCreate: ExpenseItemEntity[]): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const expensesWithId = expensesToCreate.map((expenseItem) => ({ ...expenseItem, userId: activeUserId }));
    const { data, error } = await supabaseClient.from("expenses").insert(expensesWithId).select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    if (data === null) {
      console.log("No expenses were added during batch expense creation.");
    }
    console.log({ batchCreatedExpenses: data });
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
export async function getExpenseListDirect(): Promise<ExpenseItemEntity[]> {
  try {
    // const response = await apiClient.get("/getExpenses");
    // console.log({ Expense_List_Retrieved: response.data.sort(expenseSort) });
    // return response.data.sort(expenseSort);
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("expenses")
      .select("expenseId, amount, timestamp, category, recurringExpenseId")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ Expense_List_Retrieved: data.sort(expenseSort) });
    return data.sort(expenseSort);
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
export async function handleExpenseUpdatingDirect(updatedExpenseItem: ExpenseItemEntity): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("expenses")
      .update({
        category: updatedExpenseItem.category,
        amount: updatedExpenseItem.amount,
        timestamp: updatedExpenseItem.timestamp,
        recurringExpenseId: updatedExpenseItem.recurringExpenseId,
      })
      .eq("userId", activeUserId)
      .eq("expenseId", updatedExpenseItem.expenseId)
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ updatedExpenseItem: data });
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
export async function handleExpenseDeletionDirect(expenseId: string): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { error } = await supabaseClient.from("expenses").delete().eq("userId", activeUserId).eq("expenseId", expenseId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Expense deletion successful.");
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
export async function handleBatchExpenseDeletionDirect(expenseIdsToDelete: string[]): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { error } = await supabaseClient
      .from("expenses")
      .delete()
      .eq("userId", activeUserId)
      .in("expenseId", expenseIdsToDelete);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Batch expense deletion successful.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting batch expense deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting batch expense deletion.");
    }
  }
}
