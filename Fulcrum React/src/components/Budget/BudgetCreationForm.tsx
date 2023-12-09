import FulcrumButton from "../FulcrumButton.tsx";
import {Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";

interface DBInsertionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsFormVisible: Dispatch<SetStateAction<boolean>>;
}

export default function BudgetCreationForm({setBudgetArray, setIsFormVisible}: DBInsertionFormProps) {

    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        // If focus is on the form (if it's open) AND the click is outside the form, then close the form
        if (formRef.current && !formRef.current.contains(target)) {
            setIsFormVisible(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        setBudgetArray(current => [...current, newBudgetItem])
        setIsFormVisible(false)

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
                window.alert("Category name is invalid or already has assigned budget.")
                setBudgetArray( current => {
                    const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                    if (indexOfInvalidItem !== -1) {
                        return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                    }
                    return current;
                })
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

    const styles = {
        top: 200,
        left: 200,
        right: 200,
        bottom: 200,
        backgroundColor: "rgba(0,0,0,0.8)",
    }

    return (
        <div ref={formRef}  className="fixed flex flex-col justify-center items-center rounded-3xl" style={styles}>
            <h1 className="mb-3">New Budget Item</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
                <FulcrumButton displayText="Insert Budget"/>
                <button className="mt-2" onClick={(e) => {
                    e.preventDefault()
                    setIsFormVisible(false)
                }}>x</button>
            </form>
        </div>
    )
}
