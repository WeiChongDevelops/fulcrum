import NewItemButton from "./NewItemButton.tsx";
import {useState} from "react";
import { v4 as uuid } from "uuid";

export default function DBDeletionForm() {

    const [formData, setFormData] = useState({categoryId: 0});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    function handleSubmit(e: any) {
        e.preventDefault();

        const writeData = async() => {
            const response = await fetch("http://localhost:8080/api/deleteExpense", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "categoryId": formData.categoryId,
                })
            })
            .then(data => console.log(data))
            .catch(error => console.error("Error:" + error));
        }

        writeData();

        setFormData({categoryId: 0})
    }

    return (
        <>
            <h1>[Deletion Form]</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="categoryId">Category ID</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.categoryId}
                       name="categoryId"
                       id="categoryId"
                       className="mb-3"/>
                <NewItemButton itemType="Delete Expense" />
            </form>
        </>

    )
}
