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
        group: string;
        iconPath: string;
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

    const [formData, setFormData] = useState<FormData>({ amount: null, iconPath: "", group: "" });

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData(currentFormData => ({ ...currentFormData, [e.target.name]: e.target.value }));
        const categoryIcons: NodeListOf<HTMLImageElement> = document.querySelectorAll(".category-icon-selectable");
        categoryIcons.forEach((icon): void => {
            icon.addEventListener("click", (e: MouseEvent) => {
                e.preventDefault();
                const iconPath = `/src/assets/category-icons/${icon.getAttribute("data-value")!}`;

                setFormData( currentFormData => {
                    return {...currentFormData, ["iconPath"]: iconPath}
                });

                console.log("Setting value of iconPath to: ", iconPath);
                console.log(document.getElementById("iconPath")?.getAttribute("value"));

                document.querySelectorAll('.icon-button').forEach(btn => btn.classList.remove('selected'));
                icon.classList.add('selected');
            });
        });
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
                    "amount": formData.amount,
                    "group": formData.group,
                    "iconPath": formData.iconPath
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

        setFormData({ amount: null, iconPath: "", group: "" });
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
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label htmlFor="amount">Amount</label>
                <input type="text" onChange={handleInputChange} value={formData.amount ?? ""} name="amount" id="amount" className="mb-3" placeholder={oldAmount?.toString()} />
                <label htmlFor="group">Group</label>
                <input type="group"
                       onChange={handleInputChange}
                       value={formData.group}
                       name="group"
                       id="group"
                       className="mb-3"/>

                <div id="icon-selector">
                    <button type="button" className="category-icon-selectable" data-value="category-bank-icon.svg">
                        <img src="/src/assets/category-icons/category-bank-icon.svg" alt="Bank"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-water-icon.svg">
                        <img src="/src/assets/category-icons/category-water-icon.svg" alt="Water"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-pig-icon.svg">
                        <img src="/src/assets/category-icons/category-pig-icon.svg" alt="Piggy Bank"/>
                    </button>
                </div>
                <input type="hidden" id="iconPath" name="iconPath" value="test"/>
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
