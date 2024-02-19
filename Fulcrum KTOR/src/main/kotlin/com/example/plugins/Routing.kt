package com.example.plugins

import com.example.entities.budget.*
import com.example.entities.expense.*
import com.example.entities.recurringExpense.*
import com.example.entities.successFeedback.ErrorResponseSent
import com.example.entities.successFeedback.SuccessResponseSent
import com.example.entities.user.*
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.exceptions.UnauthorizedRestException
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.builtin.Email
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Returning
import io.ktor.client.*
import io.ktor.client.engine.apache5.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.apache.hc.core5.http.HttpHost
import kotlinx.datetime.Instant

fun Application.staticResources() {
    routing {
        staticResources("/", "static/dist") {
            default("index.html")
        }
    }
}

fun Application.configureRouting() {
        val supabaseUrl = "https://pdtitoimxnivxfswjhty.supabase.co"
        val supabaseKey = System.getenv("SUPABASE_KEY")
        val supabase = createSupabaseClient(supabaseUrl, supabaseKey) {
            install(Postgrest)
            install(GoTrue)
            val client = HttpClient(Apache5) {
                engine {
                    followRedirects = true
                    socketTimeout = 10_000
                    connectTimeout = 10_000
                    connectionRequestTimeout = 20_000
                    customizeClient {
                        setProxy(HttpHost("127.0.0.1", 8080))
                    }
                }
            }
        }

    routing {

        // EXPENSE API //

        post("/api/createExpense") {
            try {
                val expenseCreateRequest = call.receive<ExpenseCreateRequestReceived>()

                val itemToInsert = ExpenseCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
                    category = expenseCreateRequest.category,
                    amount = expenseCreateRequest.amount,
                    timestamp = expenseCreateRequest.timestamp,
                    recurringExpenseId = expenseCreateRequest.recurringExpenseId
                )
                val insertedItem = supabase.postgrest["expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not added."))
            }
        }

        get("/api/getExpenses") {
            try {
                val expenseList = supabase.postgrest["expenses"].select() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                    .decodeList<ExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, expenseList)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading expenses", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expenses not read."))
            }
        }

        put("/api/updateExpense") {
            try {
                val expenseUpdateRequest = call.receive<ExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["expenses"].update(
                    {
                        set("category", expenseUpdateRequest.category)
                        set("amount", expenseUpdateRequest.amount)
                        set("timestamp", expenseUpdateRequest.timestamp)
                    }
                ) {
                    eq("expenseId", expenseUpdateRequest.expenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not updated"))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense updated."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not updated."))
            }
        }

        delete("/api/deleteExpense") {
            try {
                val expenseDeleteRequest = call.receive<ExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["expenses"].delete {
                    eq("expenseId", expenseDeleteRequest.expenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedExpense.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expense deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expense not deleted."))
            }
        }

        delete("/api/batchDeleteExpenses") {
            try {
                val batchExpenseDeleteRequest = call.receive<BatchExpenseDeleteRequestReceived>()
                for (expenseId in batchExpenseDeleteRequest.expenseIdsToDelete) {
                    val deletedExpense = supabase.postgrest["expenses"].delete {
                        eq("expenseId", expenseId)
                    }
                    if (deletedExpense.body == null) {
                        call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("A batched expense deletion failed."))
                    } else {
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("A batched expense deletion succeeded."))
                    }
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Batch expense deletion unsuccessful."))
            }
        }


        // RECURRING EXPENSE API //

        post("/api/createRecurringExpense") {
            try {
                val recurringExpenseCreateRequest = call.receive<RecurringExpenseCreateRequestReceived>()

                val itemToInsert = RecurringExpenseCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
                    category = recurringExpenseCreateRequest.category,
                    amount = recurringExpenseCreateRequest.amount,
                    timestamp = recurringExpenseCreateRequest.timestamp,
                    frequency = recurringExpenseCreateRequest.frequency
                )
                val insertedItem = supabase.postgrest["recurring_expenses"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Recurring expense added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating recurring expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not added."))
            }
        }

        get("/api/getRecurringExpenses") {
            try {
                val recurringExpenseList = supabase.postgrest["recurring_expenses"].select() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                    .decodeList<RecurringExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, recurringExpenseList)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading recurring expenses", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expenses not read."))
            }
        }

        put("/api/updateRecurringExpense") {
            try {
                val recurringExpenseUpdateRequest = call.receive<RecurringExpenseUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["recurring_expenses"].update(
                    {
                        set("category", recurringExpenseUpdateRequest.category)
                        set("amount", recurringExpenseUpdateRequest.amount)
                        set("frequency", recurringExpenseUpdateRequest.frequency)
                    }
                ) {
                    eq("recurringExpenseId", recurringExpenseUpdateRequest.recurringExpenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not updated"))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Recurring expense updated."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating recurring expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not updated."))
            }
        }

        delete("/api/deleteRecurringExpense") {
            try {
                val expenseDeleteRequest = call.receive<RecurringExpenseDeleteRequestReceived>()
                val deletedExpense = supabase.postgrest["recurring_expenses"].delete {
                    eq("recurringExpenseId", expenseDeleteRequest.recurringExpenseId)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedExpense.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Recurring expense deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting recurring expense", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Recurring expense not deleted."))
            }
        }

        suspend fun checkIfRemovedRecurringExpenseExists(recurringExpenseId: String, timestampOfRemovedInstance: Instant): Boolean {
            val response = supabase.postgrest["removed_recurring_expenses"].select(columns = Columns.list("recurringExpenseId", "timestampOfRemovedInstance")) {
                eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                eq("recurringExpenseId", recurringExpenseId)
                eq("timestampOfRemovedInstance", timestampOfRemovedInstance)
            }.decodeList<RemovedRecurringExpenseItemResponse>()
            return response.isNotEmpty();
        }

        post("/api/createRemovedRecurringExpense") {
            try {
                val removedRecurringExpenseRequest = call.receive<RemovedRecurringExpenseCreateRequestReceived>()

                val recurringExpenseId = removedRecurringExpenseRequest.recurringExpenseId
                val timestampOfRemovedInstance = removedRecurringExpenseRequest.timestampOfRemovedInstance

                if (!checkIfRemovedRecurringExpenseExists(recurringExpenseId, timestampOfRemovedInstance)) {
                    val userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
                    val itemToInsert = RemovedRecurringExpenseCreateRequestSent (
                        recurringExpenseId = recurringExpenseId,
                        timestampOfRemovedInstance = timestampOfRemovedInstance
                    )

                    val insertedItem = supabase.postgrest["removed_recurring_expenses"].insert(
                        itemToInsert,
                        returning = Returning.REPRESENTATION
                    )

                    if (insertedItem.body == null) {
                        call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Removed recurring expense instance not added."))
                    } else {
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Removed recurring expense instance added successfully."))
                    }
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Entry already exists."))
                }

            } catch (e: Exception) {
                call.application.log.error("Error while creating removed recurring expense instance", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Removed recurring expense instance not added."))
            }
        }


        get("/api/getRemovedRecurringExpenses") {
            try {
                val userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id
                val removedRecurringExpensesList = supabase.postgrest["removed_recurring_expenses"].select(columns = Columns.list("recurringExpenseId", "timestampOfRemovedInstance")) {
                    eq("userId", userId)
                }.decodeList<RemovedRecurringExpenseItemResponse>()

                call.respond(HttpStatusCode.OK, removedRecurringExpensesList)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading removed recurring expenses", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Removed recurring expenses not read."))
            }
        }


        // BUDGET API //

        post("/api/createBudget") {
            try {
                val budgetCreateRequest = call.receive<BudgetCreateRequestReceived>()

                val itemToInsert = BudgetCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
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
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not added."))
            }
        }

        get("/api/getBudget") {
            try {
                val budgetList = supabase.postgrest["budgets"].select() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
//                    eq("userId", supabase.gotrue.currentSessionOrNull()?.user?.id!!)
                }
                    .decodeList<BudgetItemResponse>()
                call.respond(HttpStatusCode.OK, budgetList)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not read."))
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
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItemNoIconOrGroup.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not updated"))
                } else {
                    if (budgetUpdateRequest.iconPath != "") {
                        val updatedItemIconOnly = supabase.postgrest["budgets"].update(
                            {
                                set("iconPath", budgetUpdateRequest.iconPath)
                            }
                        ) {
                            eq("category", budgetUpdateRequest.newCategoryName)
                            eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                        }
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget updated."))
                    }
                    if (budgetUpdateRequest.group != "") {
                        val updatedItemGroupOnly = supabase.postgrest["budgets"].update(
                            {
                                set("group", budgetUpdateRequest.group)
                            }
                        ) {
                            eq("category", budgetUpdateRequest.newCategoryName)
                            eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                        }
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget updated."))
                    }
                }
            } catch (e: Exception) {
                call.application.log.error("Error while updating budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not updated."))
            }
        }

        delete("/api/deleteBudget") {
            try {
                val budgetDeleteRequest = call.receive<BudgetDeleteRequestReceived>()
                val deletedBudget = supabase.postgrest["budgets"].delete {
                    eq("category", budgetDeleteRequest.category)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedBudget.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting budget", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not deleted."))
            }
        }

        // TOTAL INCOME API //

        get("/api/getTotalIncome") {
            try {
                val totalIncome = supabase.postgrest["total_income"].select(columns = Columns.list("totalIncome")) {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }.decodeSingle<TotalIncomeResponse>()
                call.respond(HttpStatusCode.OK, totalIncome)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading total income", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Failed to retrieve total income."))
            }
        }

        put("/api/updateTotalIncome") {
            val incomeUpdateRequest = call.receive<TotalIncomeUpdateRequestReceived>()
            try {
                val incomeUpdateRequestSent = supabase.postgrest["total_income"].update ({
                    set("totalIncome", incomeUpdateRequest.totalIncome)
                }
                ){
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                call.respond(HttpStatusCode.OK, SuccessResponseSent("Updated total income to " + incomeUpdateRequest.totalIncome.toString()))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Failed to update total income."))
            }
        }

        // GROUP API //

        post("/api/createGroup") {
            try {
                val groupCreateRequest = call.receive<GroupCreateRequestReceived>()

                val itemToInsert = GroupCreateRequestSent(
                    userId = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id,
                    group = groupCreateRequest.group,
                    colour = groupCreateRequest.colour
                )
                val insertedItem = supabase.postgrest["groups"].insert(
                    itemToInsert,
                    returning = Returning.REPRESENTATION
                )

                if (insertedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Group added successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while creating group", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group not added."))
            }
        }

        get("/api/getGroups") {
            try {
                val groupList = supabase.postgrest["groups"].select(columns = Columns.list("group, colour, dateCreated")) {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                    .decodeList<GroupItemResponse>()
                call.respond(HttpStatusCode.OK, groupList)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.application.log.error("Error while reading group list", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group list not read."))
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
                        eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                    }
                    if (updatedColour.body == null) {
                        call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group colour not updated."))
                    } else {
                        call.respond(HttpStatusCode.OK, SuccessResponseSent("Group colour updated successfully."))
                    }
                }


                // Then, update the group name. ON UPDATE CASCADE constraint ensures budget entries will be updated.
                if (groupUpdateRequest.newGroupName == groupUpdateRequest.originalGroupName) {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Group name unchanged."))
                }
                val updatedGroupName = supabase.postgrest["groups"].update(
                    {
                        set("group", groupUpdateRequest.newGroupName)
                    }
                ) {
                    eq("group", groupUpdateRequest.originalGroupName)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedGroupName.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group name not updated."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Group name updated successfully."))
                }
            } catch (e: Exception){
                call.application.log.error("Error while updating group.", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group not updated."))
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
                        eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                    }
                } catch (e: Exception) {
                    call.application.log.error("Error while reassigning budgets to Misc", e)
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group deletion failed at reassignment."))
                }
            }

            // Then we delete the group from the groups table
            try {
                val deletedGroup = supabase.postgrest["groups"].delete {
                    eq("group", groupDeleteRequest.group)
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (deletedGroup.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group not deleted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Group deleted successfully."))
                }
            } catch (e: Exception) {
                call.application.log.error("Error while deleting group", e)
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Group not deleted."))
            }
        }


        // USER AUTHENTICATION //

        post("/api/register") {
            try {
                val userCreds = call.receive<UserInfo>()
                val user = supabase.gotrue.signUpWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }


                val uid = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id

                val newUserInfo = PublicUserDataCreateRequestSent (
                    userId = uid
                )

                val userInfoInserted = supabase.postgrest["public_user_data"].insert(
                    newUserInfo
                )

                if (userInfoInserted.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("New row not added to public user data."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("New row not added to public user data."))
                }

                // Default Budget Groups Initialised

                val defaultGroups = listOf(
                    GroupCreateRequestSent(userId = uid, group = "Savings", colour = "#9fd5be"),
                    GroupCreateRequestSent(userId = uid, group = "Miscellaneous", colour = "#3f4240"),
                    GroupCreateRequestSent(userId = uid, group = "Food & Drink", colour = "#f1afa1"),
                    GroupCreateRequestSent(userId = uid, group = "Housing", colour = "#7c86bf"),
                    GroupCreateRequestSent(userId = uid, group = "Transport", colour = "#dfcde3")
                )

                val defaultGroupsInserted = supabase.postgrest["groups"].insert(defaultGroups)

                if (defaultGroupsInserted.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Default groups not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Default groups successfully added."))
                }

                // Default Categories Initialised

                val defaultCategories = listOf(
                    BudgetCreateRequestSent(userId = uid, category = "Other", amount = 0.00, iconPath = "category-default-icon.svg", group = "Miscellaneous"),
                    BudgetCreateRequestSent(userId = uid, category = "Emergency Funds", amount = 0.00, iconPath = "category-emergency-icon.svg", group = "Savings"),
                    BudgetCreateRequestSent(userId = uid, category = "Drinks", amount = 0.00, iconPath = "category-beer-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Groceries", amount = 0.00, iconPath = "category-cart-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Restaurant", amount = 0.00, iconPath = "category-utencils-icon.svg", group = "Food & Drink"),
                    BudgetCreateRequestSent(userId = uid, category = "Rent", amount = 0.00, iconPath = "category-house-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Water", amount = 0.00, iconPath = "category-water-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Electricity", amount = 0.00, iconPath = "category-electricity-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Internet", amount = 0.00, iconPath = "category-wifi-icon.svg", group = "Housing"),
                    BudgetCreateRequestSent(userId = uid, category = "Petrol", amount = 0.00, iconPath = "category-petrol-icon.svg", group = "Transport"),
                    BudgetCreateRequestSent(userId = uid, category = "Parking", amount = 0.00, iconPath = "category-car-icon.svg", group = "Transport"),
                    BudgetCreateRequestSent(userId = uid, category = "Public Transport", amount = 0.00, iconPath = "category-train-icon.svg", group = "Transport")
                )

                val defaultCategoriesInserted = supabase.postgrest["budgets"].insert(defaultCategories)

                if (defaultCategoriesInserted.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Default categories not added."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Default categories successfully added."))
                }

                // Total Income Initialised
                val initialisedTotalIncome = IncomeCreateRequestSent(
                    userId = uid,
                    totalIncome = 2000.00
                )
                val initialisedTotalIncomeInserted = supabase.postgrest["total_income"].insert(
                    initialisedTotalIncome
                )
                if (initialisedTotalIncomeInserted.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Default total income not inserted."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Default total income inserted successfully."))
                }

                call.respond(HttpStatusCode.OK, SuccessResponseSent("User added successfully."))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("User not added."))
            }
        }

        post("/api/login") {
            val userCreds = call.receive<UserInfo>()
            val currentUser = supabase.gotrue.currentSessionOrNull()
            if (currentUser == null) {
                val user = supabase.gotrue.loginWith(Email) {
                    email = userCreds.email
                    password = userCreds.password
                }
                supabase.gotrue.refreshCurrentSession()
                val loggedInUser = supabase.gotrue.retrieveUserForCurrentSession(updateSession = true)
                call.respond(HttpStatusCode.OK, loggedInUser)
            } else {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("User already logged in."))
            }
        }

        post("/api/logout") {
            val currentUser = supabase.gotrue.currentSessionOrNull()
            if (currentUser != null) {
                supabase.gotrue.logout()
                call.respond(HttpStatusCode.OK, SuccessResponseSent(currentUser.user?.email!!))
            } else {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("No user logged in."))
            }
        }

        get("/api/getUserEmailIfLoggedIn") {
            try {
                val currentUser = supabase.gotrue.currentSessionOrNull()
                if (currentUser != null) {
                    call.respond(HttpStatusCode.OK, UserEmail(email = currentUser.user?.email!!))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("No user logged in."))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while checking for user."))
            }
        }

        get("/api/checkForUser") {
            val currentUser = supabase.gotrue.currentSessionOrNull()
            try {
                val statusJSON = if (currentUser == null) {
                    UserStatusCheck(loggedIn = false)
                } else {
                    UserStatusCheck(loggedIn = true)
                }
                call.respond(HttpStatusCode.OK, statusJSON)
            } catch (e: UnauthorizedRestException) {
                call.respond(HttpStatusCode.Unauthorized, "Not authorised - JWT token likely expired.")
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while checking for user."))
            }
        }

        // BROADER DESTRUCTIVE API //

        delete("/api/wipeExpenses"){
            try {
                val expenseWipeRequestSent = supabase.postgrest["expenses"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                val recurringExpenseWipeRequestSent = supabase.postgrest["recurring_expenses"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                if (expenseWipeRequestSent.body == null || recurringExpenseWipeRequestSent.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Expenses not wiped."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Expenses wiped successfully."))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while wiping expenses."))
            }
        }

        delete("/api/wipeBudget"){
            try {
                val budgetWipeRequestSent = supabase.postgrest["budgets"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                if (budgetWipeRequestSent.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Budget not wiped."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Budget wiped successfully."))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while wiping budget."))
            }
        }

        delete("/api/wipeData"){
            try {
                val recurringExpenseWipeRequestSent = supabase.postgrest["recurring_expenses"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                val expenseWipeRequestSent = supabase.postgrest["expenses"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                val budgetWipeRequestSent = supabase.postgrest["budget"].delete() {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                if (expenseWipeRequestSent.body == null ||
                    budgetWipeRequestSent.body == null ||
                    recurringExpenseWipeRequestSent.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Data not wiped."))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Data wiped successfully."))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Error while wiping data."))
            }
        }


        // PUBLIC USER DATA //

        get("/api/getPublicUserData") {
            try {
                val userData = supabase.postgrest["public_user_data"].select(columns = Columns.list("currency, createdAt, darkModeEnabled, accessibilityEnabled, profileIconFileName")) {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }
                    .decodeSingle<PublicUserDataResponse>()
                call.respond(HttpStatusCode.OK, userData)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Public user data retrieval failed."))
            }
        }

        put("/api/updatePublicUserData") {
            try {
                val publicUserDataUpdateRequest = call.receive<PublicUserDataUpdateRequestReceived>()

                val updatedItem = supabase.postgrest["public_user_data"].update(
                    {
                        set("currency", publicUserDataUpdateRequest.currency)
                        set("darkModeEnabled", publicUserDataUpdateRequest.darkModeEnabled)
                        set("accessibilityEnabled", publicUserDataUpdateRequest.accessibilityEnabled)
                        set("profileIconFileName", publicUserDataUpdateRequest.profileIconFileName)
                    }
                ) {
                    eq("userId", supabase.gotrue.retrieveUserForCurrentSession(updateSession = true).id)
                }

                if (updatedItem.body == null) {
                    call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Public user data not updated"))
                } else {
                    call.respond(HttpStatusCode.OK, SuccessResponseSent("Public user data updated."))
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponseSent("Failed to update public user data."))
            }
        }

//        get("/blog/{page}") {
//            val pageNumber = call.parameters["page"]
//            call.respondText("You are on page $pageNumber")
//        }
//
//        post("/login") {
//            val userInfo = call.receive<UserInfo>()
//            println(userInfo)
//            call.respondText("Post request functional.")
//        }
//
//        get("/json") {
//            val myJSON = UserInfo("123@123.com", "pwpwpw")
//            call.respond(myJSON);
//        }
//
//        get("/headers") {
//            call.response.headers.append("fruit", "orange")
//            call.respondText("Extra header attached.")
//        }
//
//        get("/fileDownload") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Attachment.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
//
//
//        get("/fileOpen") {
//            val file = File("iris.jpg")
//
//            call.response.header(
//                HttpHeaders.ContentDisposition,
//                ContentDisposition.Inline.withParameter(
//                    ContentDisposition.Parameters.FileName, "openImage.jpg"
//                ).toString()
//            )
//            call.respondFile(file)
//        }
    }
}

// BASIC POSTGREST API DOCUMENTATION //

//    val listItems = supabase.postgrest["expenses"].select(columns = Columns.list("category, categoryId, amount")).decodeList<GenericListItem>()
//    if (listItems.isNotEmpty()) {
//        val listItem = listItems.first()
//        println(listItem.category)
//    } else {
//        println("No items found")
//    }


//    val itemToInsert = GenericListItem(category = "InsertedValue3", categoryId = 9426, amount = 1)
//    val test = supabase.postgrest["expenses"].insert(itemToInsert, returning = Returning.REPRESENTATION) //returning defaults to Returning.REPRESENTATION
//    println(test.body)

//    val itemToInsert = GenericListItem(category = "InsertedValue3", categoryId = 9426, amount = 1)
//    val test = supabase.postgrest["expenses"].insert(itemToInsert, returning = Returning.MINIMAL) //returning defaults to Returning.REPRESENTATION
//    println(test.body)


//    val updatedItem = supabase.postgrest["expenses"].update(
//        {
//            set("categoryId", "942")
//        }
//    ) {
//        eq("categoryId", "379817289189")
//    }.decodeSingle<GenericListItem>()
//    println(updatedItem.categoryId)

//    supabase.postgrest["expenses"].delete {
//        eq("categoryId", "942")
//    }