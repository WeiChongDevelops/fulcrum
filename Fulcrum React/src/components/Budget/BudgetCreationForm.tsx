import NewItemButton from "../NewItemButton.tsx";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";

interface DBInsertionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
}

export default function BudgetCreationForm({setBudgetArray}: DBInsertionFormProps) {
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

        const newBudgetItem: BudgetItemEntity = {
            category: formData.category,
            amount: formData.amount ? formData.amount : 0
        }


        try {
            const response = await fetch("http://localhost:8080/api/createBudget", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: formData.category,
                    amount: formData.amount
                })
            });

            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`);
            } else {
                await getBudgetList().then( () => {
                    setBudgetArray(current => [...current, newBudgetItem])
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
                <NewItemButton itemType="Insert Budget" />
            </form>
        </>
    )
}
