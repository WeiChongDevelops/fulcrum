import FulcrumButton from "../FulcrumButton.tsx";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {ExpenseItemEntity, getExpenseList} from "../../util.ts";
import { v4 as uuid } from 'uuid';

interface DBInsertionFormProps {
    setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>
}

export default function ExpenseCreationForm({setExpenseArray}: DBInsertionFormProps) {
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
            amount: formData.amount? formData.amount : 0,
            timestamp: new Date()
        }


        try {
            const response = await fetch("http://localhost:8080/api/createExpense", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expenseId: newExpenseId,
                    category: formData.category,
                    amount: formData.amount,
                    timestamp: new Date()
                })
            });

            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`);
            } else {
                await getExpenseList().then( () => {
                    setExpenseArray(current => [...current, newExpenseItem])
                })
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
                <FulcrumButton itemType="Insert Expense" />
            </form>
        </>
    )
}
