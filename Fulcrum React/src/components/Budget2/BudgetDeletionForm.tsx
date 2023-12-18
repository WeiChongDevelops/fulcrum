import FulcrumButton from "../Other/FulcrumButton.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";

interface DBDeletionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
}

export default function BudgetDeletionForm({setBudgetArray}: DBDeletionFormProps) {

    const [formData, setFormData] = useState({category: ""});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/deleteBudget", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "category": formData.category,
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

        setFormData({category: ""})
        getBudgetList().then( budgetList => setBudgetArray(budgetList))
    }

    return (
        <>
            <h1>Deletion Form</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category}
                       name="category"
                       id="category"
                       className="mb-3"/>
                <FulcrumButton displayText="Delete Category" />
            </form>
        </>

    )
}
