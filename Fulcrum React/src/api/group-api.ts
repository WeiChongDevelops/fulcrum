import { GroupItemEntity } from "@/utility/types.ts";
import { groupSort } from "@/utility/util.ts";
import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

// /**
//  * Creates a new budget category group.
//  * @param newGroupItem - The new group item data.
//  */
// export async function handleGroupCreation(newGroupItem: GroupItemEntity): Promise<void> {
//   try {
//     const response = await apiClient.post("/createGroup", {
//       group: newGroupItem.group,
//       colour: newGroupItem.colour,
//       id: newGroupItem.id,
//     });
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting group creation: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting group creation.");
//     }
//   }
// }
//

/**
 * Retrieves the list of groups from the server.
 * @returns A sorted array of group items, or an empty array in case of an error.
 */
export async function getGroupListDirect(): Promise<GroupItemEntity[]> {
  try {
    // const response = await apiClient.get("/getGroups");
    // console.log({ Groups_Retrieved: response.data.sort(groupSort) });
    // return response.data.sort(groupSort);
    const activeUserId = await getActiveUserId();
    const { data, error } = await supabaseClient
      .from("groups")
      .select("group, colour, timestamp, id")
      .eq("userId", activeUserId);
    if (error) {
      consolePostgrestError(error);
      throw new Error(error.message);
    }
    console.log({ Groups_Retrieved: data.sort(groupSort) });
    return data.sort(groupSort);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`An error occurred while fetching the group list: ${error.message}.`);
    } else {
      throw new Error("Unknown error encountered when requesting group list retrieval.");
    }
  }
}
//
// /**
//  * Updates an existing budget category group.
//  * @param originalGroupName - The original name of the group being updated.
//  * @param updatedGroupItem - The new data for the group.
//  */
// export async function handleGroupUpdating(originalGroupName: string, updatedGroupItem: GroupItemEntity): Promise<void> {
//   try {
//     await apiClient.put("/updateGroup", {
//       originalGroupName: originalGroupName,
//       newGroupName: updatedGroupItem.group.trim(),
//       newColour: updatedGroupItem.colour ? updatedGroupItem.colour : "",
//     });
//     console.log("Group successfully updated.");
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting group update: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting group update.");
//     }
//   }
// }
//
// /**
//  * Reorders the groups by reassigning their sort indexes.
//  * @param reorderedGroupArray - The array of the groups with updated sort indexes.
//  */
// export async function handleGroupReorder(reorderedGroupArray: GroupItemEntity[]) {
//   try {
//     await apiClient.put("/reorderGroups", {
//       reorderedGroupArray: reorderedGroupArray.map((groupItem) => ({
//         group: groupItem.group,
//         id: groupItem.id,
//       })),
//     });
//     console.log("Groups successfully reordered.");
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting group reorder: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting group reorder.");
//     }
//   }
// }
//
// /**
//  * Handles the deletion of a group and optionally keeps the contained budgets.
//  * @param groupName - The name of the group to be deleted.
//  * @param keepContainedBudgets - Flag to keep or delete budgets contained within the group.
//  */
// export async function handleGroupDeletion(groupName: string, keepContainedBudgets: boolean): Promise<void> {
//   try {
//     const response = await apiClient.delete("/deleteGroup", {
//       data: {
//         group: groupName,
//         keepContainedBudgets: keepContainedBudgets,
//       },
//     });
//     console.log(response.data);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw new Error(`Error encountered when requesting group deletion: ${error.message}`);
//     } else {
//       throw new Error("Unknown error encountered when requesting group deletion.");
//     }
//   }
// }
//
