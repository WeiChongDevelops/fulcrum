import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

/**
 * Retrieves the total income from the server.
 * @returns The total income as a number, or the default of $1,000 in case of an error.
 */
export async function getTotalIncomeDirect(): Promise<number> {
  try {
    // const response = await apiClient.get("/getTotalIncome");
    //     // console.log(response.data);
    //     // return response.data.totalIncome;
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient.from("total_income").select("totalIncome").eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log(data);
    return data[0].totalIncome;
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
export async function handleTotalIncomeUpdatingDirect(newTotalIncome: number): Promise<void> {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("total_income")
      .update({
        totalIncome: newTotalIncome,
      })
      .eq("userId", activeUserId)
      .select();
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    if (data === null) {
      console.error("No change was made when updating total income - unnecessary network request.");
    }
    console.log({ updatedIncome: data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when requesting total income update: ${error.message}`);
    } else {
      throw new Error("Unknown error encountered when requesting total income update.");
    }
  }
}
