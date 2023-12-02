import NewItemButton from "./NewItemButton.tsx";
import {useState} from "react";

export default function DBDeletionForm() {

    const [formData, setFormData] = useState({expenseId: ""});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    async function handleSubmit(e: any) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/deleteExpense", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "expenseId": formData.expenseId,
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

        setFormData({expenseId: ""})
    }

    return (
        <>
            <h1>Deletion Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="expenseId">Expense ID</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.expenseId}
                       name="expenseId"
                       id="expenseId"
                       className="mb-3"/>
                <NewItemButton itemType="Delete Expense" />
            </form>
        </>

    )
}
