import NewItemButton from "../NewItemButton.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";


interface DBUpdatingFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
}

export default function BudgetUpdatingForm({setBudgetArray}: DBUpdatingFormProps) {

    interface FormData {
        category: string | null;
        amount: number | null;
    }

    const [formData, setFormData] = useState<FormData>({category: null, amount: null});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value }
        });
    }
    async function handleSubmit(e: any) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/updateBudget", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "category": formData.category,
                    "amount": formData.amount
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

        setFormData({category: null, amount: null})
        getBudgetList().then( budgetList => setBudgetArray(budgetList))
    }

    return (
        <>
            <h1>Updating Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category ? formData.category : ""}
                       name="category"
                       id="category"
                       className="mb-3"/>
                <label htmlFor="amount">Amount</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.amount ? formData.amount : ""}
                       name="amount"
                       id="amount"
                       className="mb-3"/>
                <NewItemButton itemType="Update Budget" />
            </form>
        </>

    )
}
