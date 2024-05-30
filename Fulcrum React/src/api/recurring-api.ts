import { RecurringExpenseItemEntity } from "@/utility/types.ts";
import { expenseSort } from "@/utility/util.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Handles the creation of a new recurring expense.
 * @param newRecurringExpenseItem - The data for the new recurring expense.
 */
export async function handleRecurringExpenseCreationDirect(
  newRecurringExpenseItem: RecurringExpenseItemEntity,
): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("recurring_expenses")
      .insert({
        userId: activeUserId,
        recurringExpenseId: newRecurringExpenseItem.recurringExpenseId,
        category: newRecurringExpenseItem.category,
        amount: newRecurringExpenseItem.amount,
        timestamp: newRecurringExpenseItem.timestamp,
        frequency: newRecurringExpenseItem.frequency as string,
      })
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ insertedRecurringExpense: data });
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
export async function getRecurringExpenseListDirect(): Promise<RecurringExpenseItemEntity[]> {
  try {
    // const response = await apiClient.get("/getRecurringExpenses");
    // console.log({ Recurring_Expenses_Retrieved: response.data.sort(expenseSort) });
    // return response.data.sort(expenseSort);

    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("recurring_expenses")
      .select("recurringExpenseId, category, amount, timestamp, frequency")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ Recurring_Expenses_Retrieved: data.sort(expenseSort) });
    return data.sort(expenseSort);
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
export async function handleRecurringExpenseUpdatingDirect(
  updatedRecurringExpenseItem: RecurringExpenseItemEntity,
): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("recurring_expenses")
      .update({
        category: updatedRecurringExpenseItem.category,
        amount: updatedRecurringExpenseItem.amount,
        timestamp: updatedRecurringExpenseItem.timestamp,
        frequency: updatedRecurringExpenseItem.frequency,
      })
      .eq("userId", activeUserId)
      .eq("recurringExpenseId", updatedRecurringExpenseItem.recurringExpenseId)
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    if (data === null) {
      console.error("No change was made when updating recurring expense - unnecessary network request.");
    }
    console.log({ updatedRecurringExpenseItem: data });
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
export async function handleRecurringExpenseDeletionDirect(recurringExpenseId: string): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { error } = await supabaseClient
      .from("recurring_expenses")
      .delete()
      .eq("userId", activeUserId)
      .eq("recurringExpenseId", recurringExpenseId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Recurring expense deletion successful.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting recurring expense deletion: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting recurring expense deletion.");
    }
  }
}
