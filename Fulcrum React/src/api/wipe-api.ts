//
// /**
//  * Deletes all user expense records.
//  */
// export async function handleWipeExpenses(): Promise<void> {
//   try {
//     const response = await apiClient.delete("/wipeExpenses");
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting expense wipe: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting expense wipe.");
//     }
//   }
// }
//
// /**
//  * Deletes all user budget records.
//  */
// export async function handleWipeBudget(): Promise<void> {
//   try {
//     const response = await apiClient.delete("/wipeBudget");
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting budget wipe: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting budget wipe.");
//     }
//   }
// }
//
// /**
//  * Resets all budget records to default settings.
//  */
// export async function handleResetAccountData(): Promise<void> {
//   try {
//     const response = await apiClient.post("/resetAccountData");
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when attempting default reset: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when attempting default reset.");
//     }
//   }
// }
//
