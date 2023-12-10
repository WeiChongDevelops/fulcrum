import {Dispatch, SetStateAction} from "react";

export interface ExpenseItemEntity {
    expenseId: string
    category: string
    amount: number
    timestamp: Date
}

export interface BudgetItemEntity {
    category: string
    amount: number
    iconPath: string
    group: string
}

export async function getExpenseList() {
    try {
        const response = await fetch("http://localhost:8080/api/getExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getBudgetList() {
    try {
        const response = await fetch("http://localhost:8080/api/getBudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            // window.location.href = "/login"
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
    setBudgetArray(prevState => prevState.filter(budgetItem => budgetItem.category !== category))
    try {
        const response = await fetch("http://localhost:8080/api/deleteBudget", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}

