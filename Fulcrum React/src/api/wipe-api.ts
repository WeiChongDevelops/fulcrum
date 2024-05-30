import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";
import {
  initialiseDefaultCategories,
  initialiseDefaultIncome,
  initialiseDefaultUserPreferences,
  rowsExistFor,
} from "@/api/init-api.ts";

async function wipeExpenses() {
  const activeUserId = await getActiveUserId();
  if (await rowsExistFor("expenses")) {
    const { error } = await supabaseClient.from("expenses").delete().eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Successfully wiped expense data.");
  } else {
    console.log("No expenses found when wiping expense data.");
  }
}
async function wipeRecurringExpenses() {
  const activeUserId = await getActiveUserId();
  if (await rowsExistFor("recurring_expenses")) {
    const { error } = await supabaseClient.from("recurring_expenses").delete().eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log("Successfully wiped recurring expense data.");
  } else {
    console.log("No recurring expenses found when wiping expense data.");
  }
}

/**
 * Deletes all user expense records.
 */
export async function handleWipeExpensesDirect(): Promise<void> {
  try {
    await wipeExpenses();
    await wipeRecurringExpenses();
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
export async function handleWipeDataDirect(): Promise<void> {
  try {
    console.log("Successfully wiped data.");
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
export async function handleResetAccountDataDirect(): Promise<void> {
  try {
    await initialiseDefaultCategories();
    await initialiseDefaultUserPreferences();
    await initialiseDefaultIncome();
    console.log("Successfully reset account data.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when attempting default reset: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when attempting default reset.");
    }
  }
}
