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
                val budgetList =
                    supabase.postgrest["budgets"].select(columns = Columns.list("category, amount, iconPath, group, timestamp")) {
                        eq("userId", getActiveUserId())
                    }.decodeList<BudgetItemResponse>()

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
                    call.respondError("Budget creation failed.")
                } else {
                    call.respondSuccess("Budget creation successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating budget", e)
                call.respondError("Error while creating budget: $e")
            }
        }

        get("/api/getBudget") {
            try {
                val budgetList =
                    supabase.postgrest["budgets"].select(columns = Columns.list("category, amount, iconPath, group, timestamp")) {
                        eq("userId", getActiveUserId())
                    }
                        .decodeList<BudgetItemResponse>()
                call.respond(HttpStatusCode.OK, budgetList)
            } catch (e: UnauthorizedRestException) {
                call.application.log.error("Not authorised - JWT token likely expired.", e)
                call.respondAuthError("Not authorised - JWT token likely expired: $e")
            } catch (e: IllegalStateException) {
                call.application.log.error("Session not found.", e)
                call.respondAuthError("Session not found: $e")
            } catch (e: Exception) {
                call.application.log.error("Error while reading budget.", e)
                call.respondError("Error while reading budget: $e")
            }
        }

        put("/api/updateBudget") {
//            try {
//                val budgetUpdateRequest = call.receive<BudgetUpdateRequestReceived>()
//
//                val categoryToChange = budgetUpdateRequest.category
//
//                val updatedItemNoIconOrGroup = supabase.postgrest["budgets"].update(
//                    {
//                        set("amount", budgetUpdateRequest.amount)
//                        set("category", budgetUpdateRequest.newCategoryName)
//                    }
//                ) {
//                    eq("category", categoryToChange)
//                    eq("userId", getActiveUserId())
//                }
//
//                if (updatedItemNoIconOrGroup.body == null) {
//                    call.respondError("Budget not updated")
//                } else {
//                    if (budgetUpdateRequest.iconPath != "") {
//                        val updatedItemIconOnly = supabase.postgrest["budgets"].update(
//                            {
//                                set("iconPath", budgetUpdateRequest.iconPath)
//                            }
//                        ) {
//                            eq("category", budgetUpdateRequest.newCategoryName)
//                            eq("userId", getActiveUserId())
//                        }
//                    }
//                    if (budgetUpdateRequest.group != "") {
//                        val updatedItemGroupOnly = supabase.postgrest["budgets"].update(
//                            {
//                                set("group", budgetUpdateRequest.group)
//                            }
//                        ) {
//                            eq("category", budgetUpdateRequest.newCategoryName)
//                            eq("userId", getActiveUserId())
//                        }
//                    }
//                    call.respondSuccess("Budget successfully updated.")
//                }
//            } catch (e: Exception) {
//                call.application.log.error("Error while updating budget", e)
//                call.respondError("Budget not updated.")
//            }
            try {
                val budgetUpdateRequest = call.receive<BudgetUpdateRequestReceived>()
                val categoryToChange = budgetUpdateRequest.category

                val updatedBudgetItem = supabase.postgrest["budgets"].update(
                    {
                        set("category", budgetUpdateRequest.newCategoryName)
                        set("amount", budgetUpdateRequest.amount)
                        set("group", budgetUpdateRequest.group)
                        set("iconPath", budgetUpdateRequest.iconPath)
                    }
                ) {
                    eq("category", categoryToChange)
                    eq("userId", getActiveUserId())
                }

                if (updatedBudgetItem.body == null) {
                    call.respondError("Budget update failed.")
                } else {
                    call.respondSuccess("Budget update successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating budget", e)
                call.respondError("Error while updating budget: $e")
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
                    call.respondError("Budget deletion failed.")
                } else {
                    call.respondSuccess("Budget deletion successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting budget", e)
                call.respondError("Error while deleting budget: $e")
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
                call.respondError("Error while reading total income: $e.")
            }
        }

        put("/api/updateTotalIncome") {
            val incomeUpdateRequest = call.receive<TotalIncomeUpdateRequestReceived>()
            try {
                val incomeUpdateRequestSent = supabase.postgrest["total_income"].update({
                    set("totalIncome", incomeUpdateRequest.totalIncome)
                }
                ) {
                    eq("userId", getActiveUserId())
                }

                if (incomeUpdateRequestSent.body == null) {
                    call.respondError("Total income update failed.")
                }
                call.respondSuccess("Successfully updated total income to " + incomeUpdateRequest.totalIncome.toString())
            } catch (e: Exception) {
                call.application.log.error("Error while updating total income", e)
                call.respondError("Error while updating total income: $e")
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
                    call.respondError("Group creation failed.")
                } else {
                    call.respondSuccess("Group creation successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating group", e)
                call.respondError("Error while creating group: $e")
            }
        }

        get("/api/getGroups") {
            try {
                val groupList =
                    supabase.postgrest["groups"].select(columns = Columns.list("group, colour, dateCreated")) {
                        eq("userId", getActiveUserId())
                    }.decodeList<GroupItemResponse>()
                call.respond(HttpStatusCode.OK, groupList)
            } catch (e: UnauthorizedRestException) {
                call.respondAuthError("Not authorised - JWT token likely expired.")
            } catch (e: IllegalStateException) {
                call.respondAuthError("Session not found.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading group list", e)
                call.respondError("Error while reading group list: $e.")
            }
        }

        put("/api/updateGroup") {
            try {
                val groupUpdateRequest = call.receive<GroupUpdateRequestReceived>()

                val updatedGroupName = supabase.postgrest["groups"].update(
                    {
                        set("colour", groupUpdateRequest.newColour)
                        set("group", groupUpdateRequest.newGroupName)
                    }
                ) {
                    eq("group", groupUpdateRequest.originalGroupName)
                    eq("userId", getActiveUserId())
                }

                if (updatedGroupName.body == null) {
                    call.respondError("Group update failed.")
                } else {
                    call.respondSuccess("Group update successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating group.", e)
                call.respondError("Error while updating group: $e.")
            }
        }

        delete("/api/deleteGroup") {
            val groupDeleteRequest = call.receive<GroupDeleteRequestReceived>()

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
                    call.respondError("Group deletion failed at reassignment: $e")
                }
            }

            try {
                val deletedGroup = supabase.postgrest["groups"].delete {
                    eq("group", groupDeleteRequest.group)
                    eq("userId", getActiveUserId())
                }

                if (deletedGroup.body == null) {
                    call.respondError("Group deletion failed.")
                } else {
                    call.respondSuccess("Group deletion successful.")
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting group", e)
                call.respondError("Error while deleting group: $e")
            }
        }
    }
}
