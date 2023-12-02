import NewItemButton from "./NewItemButton.tsx";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../util.ts";
import { v4 as uuid } from 'uuid';

interface DBInsertionFormProps {
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
}

export default function DBInsertionForm({setExpenseArray}: DBInsertionFormProps) {
    interface FormData {
        category: string;
        amount: number | null;
    }

    const [formData, setFormData] = useState<FormData>({ category: "", amount: null });


    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newExpenseId = uuid()

        const newExpenseItem: ExpenseItemEntity = {
            expenseId: newExpenseId,
            category: formData.category,
            amount: formData.amount!!,
            timestamp: new Date()
        }

        setExpenseArray(current => [...current, newExpenseItem])

        try {
            const response = await fetch("http://localhost:8080/api/createExpense", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expenseId: newExpenseId,
                    userId: "123e4567-e89b-12d3-a456-426614174000", // Temporary hard-coded value before auth is implemented
                    category: formData.category,
                    amount: formData.amount
                })
            });

            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`);
            }
            const responseData = await response.json()
            console.log(responseData);

        } catch (error) {
            console.error("Error:", error);
        }

        setFormData({ category: "", amount: null });


    }


    return (
        <>
            <h1>Insertion Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category}
                       name="category"
                       id="category"
                       className="mb-3"/>
                <label htmlFor="amount">Amount</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.amount == null ? "" : formData.amount}
                       name="amount"
                       id="amount"
                       className="mb-3"/>
                <NewItemButton itemType="Insert Expense" />
            </form>
        </>
    )
}
