package com.example.plugins

import com.example.SupabaseClient.supabase
import com.example.entities.budget.*
import com.example.getActiveUserId
import com.example.respondAuthError
import com.example.respondError
import com.example.respondSuccess
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.lang.IllegalStateException

fun Application.configureBudgetRouting() {

    routing {

        // BUDGET API //

        post("/api/createBudget") {
            try {
                val budgetCreateRequest = call.receive<BudgetCreateRequestReceived>()

                val itemToInsert = BudgetCreateRequestSent(
                    userId = getActiveUserId(),
                    category = budgetCreateRequest.category,
                    amount = budgetCreateRequest.amount,
                    iconPath = budgetCreateRequest.iconPath,
                    group = budgetCreateRequest.group
                )
                val insertedItem = supabase.postgrest["budgets"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respondError("Budget not added.")
                } else {
                    call.respondSuccess("Budget added successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating budget", e)
                call.respondError("Budget not added.")
            }
        }

        get("/api/getBudget") {
            try {
                val budgetList = supabase.postgrest["budgets"].select() {
                    eq("userId", getActiveUserId())
                }
                    .decodeList<BudgetItemResponse>()
                call.respond(HttpStatusCode.OK, budgetList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading budget", e)
                call.respondError("Budget not read.")
            }
        }

        put("/api/updateBudget") {
            try {
                val budgetUpdateRequest = call.receive<BudgetUpdateRequestReceived>()

                val categoryToChange = budgetUpdateRequest.category

                val updatedItemNoIconOrGroup = supabase.postgrest["budgets"].update(
                    {
                        set("amount", budgetUpdateRequest.amount)
                        set("category", budgetUpdateRequest.newCategoryName)
                    }
                ) {
                    eq("category", categoryToChange)
                    eq("userId", getActiveUserId())
                }

                if (updatedItemNoIconOrGroup.body == null) {
                    call.respondError("Budget not updated")
                } else {
                    if (budgetUpdateRequest.iconPath != "") {
                        val updatedItemIconOnly = supabase.postgrest["budgets"].update(
                            {
                                set("iconPath", budgetUpdateRequest.iconPath)
                            }
                        ) {
                            eq("category", budgetUpdateRequest.newCategoryName)
                            eq("userId", getActiveUserId())
                        }
                        call.respondSuccess("Budget updated.")
                    }
                    if (budgetUpdateRequest.group != "") {
                        val updatedItemGroupOnly = supabase.postgrest["budgets"].update(
                            {
                                set("group", budgetUpdateRequest.group)
                            }
                        ) {
                            eq("category", budgetUpdateRequest.newCategoryName)
                            eq("userId", getActiveUserId())
                        }
                        call.respondSuccess("Budget updated.")
                    }
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating budget", e)
                call.respondError("Budget not updated.")
            }
        }

        delete("/api/deleteBudget") {
            try {
                val budgetDeleteRequest = call.receive<BudgetDeleteRequestReceived>()
                val deletedBudget = supabase.postgrest["budgets"].delete {
                    eq("category", budgetDeleteRequest.category)
                    eq("userId", getActiveUserId())
                }

                if (deletedBudget.body == null) {
                    call.respondError("Budget not deleted.")
                } else {
                    call.respondSuccess("Budget deleted successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting budget", e)
                call.respondError("Budget not deleted.")
            }
        }

        // TOTAL INCOME API //

        get("/api/getTotalIncome") {
            try {
                val totalIncome = supabase.postgrest["total_income"].select(columns = Columns.list("totalIncome")) {
                    eq("userId", getActiveUserId())
                }.decodeSingle<TotalIncomeResponse>()
                call.respond(HttpStatusCode.OK, totalIncome)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading total income", e)
                call.respondError("Failed to retrieve total income.")
            }
        }

        put("/api/updateTotalIncome") {
            val incomeUpdateRequest = call.receive<TotalIncomeUpdateRequestReceived>()
            try {
                val incomeUpdateRequestSent = supabase.postgrest["total_income"].update ({
                    set("totalIncome", incomeUpdateRequest.totalIncome)
                }
                ){
                    eq("userId", getActiveUserId())
                }
                call.respondSuccess("Updated total income to " + incomeUpdateRequest.totalIncome.toString())
            } catch (e: Exception) {
                call.respondError("Failed to update total income.")
            }
        }

        // GROUP API //

        post("/api/createGroup") {
            try {
                val groupCreateRequest = call.receive<GroupCreateRequestReceived>()

                val itemToInsert = GroupCreateRequestSent(
                    userId = getActiveUserId(),
                    group = groupCreateRequest.group,
                    colour = groupCreateRequest.colour
                )
                val insertedItem = supabase.postgrest["groups"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respondError("Group not added.")
                } else {
                    call.respondSuccess("Group added successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating group", e)
                call.respondError("Group not added.")
            }
        }

        get("/api/getGroups") {
            try {
                val groupList = supabase.postgrest["groups"].select(columns = Columns.list("group, colour, dateCreated")) {
                    eq("userId", getActiveUserId())
                }
                    .decodeList<GroupItemResponse>()
                call.respond(HttpStatusCode.OK, groupList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading group list", e)
                call.respondError("Group list not read.")
            }
        }

        put("/api/updateGroup") {
            try {
                val groupUpdateRequest = call.receive<GroupUpdateRequestReceived>()

                // First, if a new colour was passed, update it
                if (groupUpdateRequest.newColour.isNotEmpty()) {
                    val updatedColour = supabase.postgrest["groups"].update(
                        {
                            set("colour", groupUpdateRequest.newColour)
                        }
                    ) {
                        eq("group", groupUpdateRequest.originalGroupName)
                        eq("userId", getActiveUserId())
                    }
                    if (updatedColour.body == null) {
                        call.respondError("Group colour not updated.")
                    } else {
                        call.respondSuccess("Group colour updated successfully.")
                    }
                }


                // Then, update the group name. ON UPDATE CASCADE constraint ensures budget entries will be updated.
                if (groupUpdateRequest.newGroupName == groupUpdateRequest.originalGroupName) {
                    call.respondSuccess("Group name unchanged.")
                }
                val updatedGroupName = supabase.postgrest["groups"].update(
                    {
                        set("group", groupUpdateRequest.newGroupName)
                    }
                ) {
                    eq("group", groupUpdateRequest.originalGroupName)
                    eq("userId", getActiveUserId())
                }

                if (updatedGroupName.body == null) {
                    call.respondError("Group name not updated.")
                } else {
                    call.respondSuccess("Group name updated successfully.")
                }
            } catch (e: Exception){
                call.application.log.error("Error while updating group.", e)
                call.respondError("Group not updated.")
            }
        }

        delete("/api/deleteGroup") {
            val groupDeleteRequest = call.receive<GroupDeleteRequestReceived>()
            // First we reassign any groups with this name to miscellaneous. If we want to have an alternate behaviour, that data needs to be included in the above entity, chosen in react and sent to ktor API as part of body.
            // Actually, if this block below runs and renames groups, the cascade behaviour would make no difference - there would be nothing to cascade deletes to.
            // So if the property of the request 'moveCategoriesToMisc' is true, we run this.
            // Now, in React, we need a way for the user to pick between two options.
            if (groupDeleteRequest.keepContainedBudgets) {
                try {
                    supabase.postgrest["budgets"].update(
                        {
                            set("group", "Miscellaneous")
                        }
                    ) {
                        eq("group", groupDeleteRequest.group)
                        eq("userId", getActiveUserId())
                    }
                } catch (e: Exception) {
                    call.application.log.error("Error while reassigning budgets to Misc", e)
                    call.respondError("Group deletion failed at reassignment.")
                }
            }

            // Then we delete the group from the groups table
            try {
                val deletedGroup = supabase.postgrest["groups"].delete {
                    eq("group", groupDeleteRequest.group)
                    eq("userId", getActiveUserId())
                }

                if (deletedGroup.body == null) {
                    call.respondError("Group not deleted.")
                } else {
                    call.respondSuccess("Group deleted successfully.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting group", e)
                call.respondError("Group not deleted.")
            }
        }
    }
}
