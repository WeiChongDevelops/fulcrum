import { AuthError, createClient, PostgrestError } from "@supabase/supabase-js";
import { Database } from "database.types.ts";
import {
  BlacklistedExpenseItemEntity,
  BudgetItemEntity,
  ExpenseItemEntity,
  GroupItemEntity,
  RecurringExpenseItemEntity,
  UserPreferences,
} from "@/utility/types.ts";
import { budgetSort, DEFAULT_CATEGORY_GROUP, DEFAULT_CATEGORY_ICON, expenseSort, groupSort } from "@/utility/util.ts";

export const checkEnv = () => {
  console.log(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
};

export const supabaseClient = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export function consolePostgrestError(postgrestError: PostgrestError): void {
  console.error(
    "Postgrest error encountered:",
    postgrestError.code,
    postgrestError.message,
    postgrestError.details,
    postgrestError.hint,
  );
}
export function consoleAuthError(postgrestError: AuthError): void {
  console.error("Postgrest error encountered:", postgrestError.code, postgrestError.status, postgrestError.message);
}

export async function getActiveUserId(): Promise<string> {
  const user = await supabaseClient.auth.getUser();
  if (!user.data.user) {
    throw new Error("User was not found when retrieving UID.");
  }
  return user.data.user.id;
}

/**
 * Retrieves the email address of the active user, or null if no user is currently authenticated.
 * @return - The active email, or null if there is no active user
 */
export async function getSessionEmailOrNullDirect(): Promise<string | null> {
  const user = await supabaseClient.auth.getUser();
  if (!user.data.user) {
    console.error("User was not found when retrieving user email.");
    return null;
  }
  if (!user.data.user.email) {
    console.error("Email was not found when retrieving user email.");
    return null;
  }
  return user.data.user.email;
}
