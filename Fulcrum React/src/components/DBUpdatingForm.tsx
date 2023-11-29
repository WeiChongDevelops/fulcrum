import NewItemButton from "./NewItemButton.tsx";
import {useState} from "react";
import { v4 as uuid } from "uuid";

export default function DBUpdatingForm() {

    const [formData, setFormData] = useState({category: "", amount: 0, categoryId: 0});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    function handleSubmit(e: any) {
        e.preventDefault();

        const writeData = async() => {
            const response = await fetch("http://localhost:8080/api/updateExpense", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "category": formData.category,
                    "categoryId": formData.categoryId,
                    "amount": formData.amount
                })
            })
                .then(data => console.log(data))
                .catch(error => console.error("Error:" + error));
        }

        writeData();

        setFormData({category: "", amount: 0, categoryId: 0})
    }

    return (
        <>
            <h1>[Updating Form]</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="categoryId">Category ID</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.categoryId}
                       name="categoryId"
                       id="categoryId"
                       className="mb-3"/>
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
                       value={formData.amount}
                       name="amount"
                       id="amount"
                       className="mb-3"/>
                <NewItemButton itemType="Update Expense" />
            </form>
        </>

    )
}
