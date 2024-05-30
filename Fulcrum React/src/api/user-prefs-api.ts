import { UserPreferences } from "@/utility/types.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Retrieves user preferences.
 */
export async function getUserPreferencesDirect(): Promise<UserPreferences> {
  try {
    // const response = await apiClient.get("/getUserPreferences");
    // console.log({ userPreferences: response.data });
    // return response.data;
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("user_preferences")
      .select("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    return data[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching user preferences: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered while fetching user preferences.");
    }
  }
}

/**
 * Updates user preferences with the specified settings.
 * @param updatedUserPreferences - The updated user preferences.
 */
export async function handleUserPreferencesUpdatingDirect(updatedUserPreferences: UserPreferences): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("user_preferences")
      .update({
        currency: updatedUserPreferences.currency,
        darkModeEnabled: updatedUserPreferences.darkModeEnabled,
        accessibilityEnabled: updatedUserPreferences.accessibilityEnabled,
        profileIconFileName: updatedUserPreferences.profileIconFileName,
      })
      .eq("userId", activeUserId)
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ updatedUserPrefs: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting user preferences update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting user preferences update.");
    }
  }
}
