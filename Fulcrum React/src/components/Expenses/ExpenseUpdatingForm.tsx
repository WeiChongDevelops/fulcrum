import FulcrumButton from "../FulcrumButton.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../../util.ts";


interface DBUpdatingFormProps {
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
}

export default function ExpenseUpdatingForm({setExpenseArray}: DBUpdatingFormProps) {

    interface FormData {
        expenseId: string;
        category: string | null;
        amount: number | null;
    }

    const [formData, setFormData] = useState<FormData>({expenseId: "", amount: null, category: null});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value }
        });
    }
    async function handleSubmit(e: any) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/updateExpense", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "expenseId": formData.expenseId,
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

        getExpenseList().then( expenseList => setExpenseArray(expenseList))
        setFormData({expenseId: "", amount: null, category: null})
    }

    return (
        <>
            <h1>Updating Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="expenseId">Expense ID</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.expenseId}
                       name="expenseId"
                       id="expenseId"
                       className="mb-3"/>
                <label htmlFor="amount">Amount</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.amount ? formData.amount : ""}
                       name="amount"
                       id="amount"
                       className="mb-3"/>
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category ? formData.category : ""}
                       name="category"
                       id="category"
                       className="mb-3"/>
                <FulcrumButton itemType="Update Expense" />
            </form>
        </>

    )
}
