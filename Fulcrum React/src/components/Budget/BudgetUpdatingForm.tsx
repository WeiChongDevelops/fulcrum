import FulcrumButton from "../FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { BudgetItemEntity, getBudgetList } from "../../util.ts";

interface DBUpdatingFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    category: string | null;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    oldAmount: number | null;
}

export default function BudgetUpdatingForm({ setBudgetArray, category, setIsUpdateBudgetVisible, oldAmount }: DBUpdatingFormProps) {
    interface FormData {
        amount: number | null;
    }

    const formRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setIsUpdateBudgetVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [formData, setFormData] = useState<FormData>({ amount: null });

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData(currentFormData => ({ ...currentFormData, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsUpdateBudgetVisible(false);

        try {
            const response = await fetch("http://localhost:8080/api/updateBudget", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "category": category,
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

        setFormData({ amount: null });
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    const styles = {
        top: "20%",
        left: "30%",
        right: "30%",
        bottom: "20%",
        backgroundColor: "rgba(0,0,0,0.8)",
    };

    return (
        <div ref={formRef} className="fixed flex flex-col justify-start items-center rounded-3xl text-white p-20" style={styles}>
            <h1>Updating Budget for {category}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount</label>
                <input type="text" onChange={handleInputChange} value={formData.amount ?? ""} name="amount" id="amount" className="mb-3" placeholder={oldAmount?.toString()} />
                <FulcrumButton displayText="Update Budget" />
                <button className="mt-2" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsUpdateBudgetVisible(false);
                }}>x</button>
            </form>
        </div>
    );
}
