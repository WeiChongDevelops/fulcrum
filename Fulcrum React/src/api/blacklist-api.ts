import { BlacklistedExpenseItemEntity } from "@/utility/types.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Creates a record for a removed instance of a recurring expense, for blacklist purposes.
 * @param recurringExpenseId - The ID of the recurring expense from which an instance is removed.
 * @param timestampOfRemovedInstance - The timestamp of the removed expense instance.
 */
export async function handleBlacklistedExpenseCreationDirect(
  recurringExpenseId: string,
  timestampOfRemovedInstance: Date,
): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("removed_recurring_expenses")
      .insert({
        userId: activeUserId,
        recurringExpenseId: recurringExpenseId,
        timestampOfRemovedInstance: timestampOfRemovedInstance,
      })
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ insertedExpense: data });
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
export async function handleBatchBlacklistedExpenseCreationDirect(
  recurringExpenseId: string,
  timestampsToBlacklist: Date[],
): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const blacklistEntries = timestampsToBlacklist.map((timestamp) => ({
      userId: activeUserId,
      recurringExpenseId: recurringExpenseId,
      timestampOfRemovedInstance: timestamp,
    }));
    const { data, error } = await supabaseClient.from("removed_recurring_expenses").insert(blacklistEntries).select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    if (data === null) {
      console.log("No entries were added during batch blacklist entry creation.");
    }
    console.log({ batchCreatedBlacklistEntries: data });
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
export async function getBlacklistedExpensesDirect(): Promise<BlacklistedExpenseItemEntity[]> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("removed_recurring_expenses")
      .select("recurringExpenseId, timestampOfRemovedInstance")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ Blacklisted_Expenses_Retrieved: data });
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting blacklist retrieval: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting blacklist retrieval.");
    }
  }
}
