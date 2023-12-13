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

export interface BudgetCreationFormData {
    category: string;
    amount: number | null;
    iconPath: string;
    group: string;
}

export interface BudgetUpdatingFormData {
    amount: number | null;
    group: string;
    iconPath: string;
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
            window.location.href = "/login"
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
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

export async function handleBudgetCreation(formData: BudgetCreationFormData, setBudgetArray: (value: (((prevState: BudgetItemEntity[]) => BudgetItemEntity[]) | BudgetItemEntity[])) => void, newBudgetItem: BudgetItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createBudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: formData.category,
                amount: formData.amount ? formData.amount : 0,
                iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
                group: formData.group ? formData.group : "Miscellaneous"
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Category name is invalid or already has assigned budget; or $999,999,999 limit exceeded.")
            setBudgetArray(current => {
                const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetUpdating(category: string | null, formData: BudgetUpdatingFormData) {
    try {
        const response = await fetch("http://localhost:8080/api/updateBudget", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
                "amount": formData.amount,
                "group": formData.group,
                "iconPath": formData.iconPath
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}

export function addIconSelectionFunctionality(setFormData:
                                                  Dispatch<SetStateAction<BudgetUpdatingFormData>>
                                                  | Dispatch<SetStateAction<BudgetCreationFormData>>) {
    const categoryIcons: NodeListOf<HTMLImageElement> = document.querySelectorAll(".category-icon-selectable");
    categoryIcons.forEach((icon): void => {
        icon.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            const iconPath = `/src/assets/category-icons/${icon.getAttribute("data-value")!}`;

            setFormData((currentFormData: any) => {
                return {...currentFormData, ["iconPath"]: iconPath}
            });

            document.querySelectorAll('.icon-button').forEach(btn => btn.classList.remove('selected'));
            icon.classList.add('selected');
        });
    });
}

export function getAmountBudgeted(budgetArray: BudgetItemEntity[]) {
    const amountArray = budgetArray.map( budgetItem => (
        budgetItem.amount
    ))
    console.log(amountArray)
    return amountArray.reduce((accumulator, currentValue) => (
        accumulator + currentValue
    ), 0)
}

export function formatNumberWithCommas(numberString: string) {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};