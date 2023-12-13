import FulcrumButton from "../FulcrumButton.tsx";
import {Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {BudgetItemEntity, getBudgetList} from "../../util.ts";

interface DBInsertionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
}

export default function BudgetCreationForm({setBudgetArray, setIsCreateBudgetVisible}: DBInsertionFormProps) {

    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        // If focus is on the form (if it's open) AND the click is outside the form, then close the form
        if (formRef.current && !formRef.current.contains(target)) {
            setIsCreateBudgetVisible(false);
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
        iconPath: string;
        group: string;
    }

    const [formData, setFormData] = useState<FormData>({ category: "", amount: null, iconPath: "", group: ""});

    function handleInputChange(e: any) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });

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

        const newBudgetItem: BudgetItemEntity = {
            category: formData.category,
            amount: formData.amount ? formData.amount : 0,
            iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
            group: formData.group ? formData.group : "Miscellaneous"
        }
        console.log("FORMDATA ICON PATH:")
        console.log(formData.iconPath);

        setBudgetArray(current => [...current, newBudgetItem])
        setIsCreateBudgetVisible(false)

        try {
            const response = await fetch("http://localhost:8080/api/createBudget", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: formData.category,
                    amount: formData.amount ? formData.amount : 0,
                    iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
                    group: formData.group ? formData.group : "Miscellaneous"
                })
            });

            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`);
                window.alert("Category name is invalid or already has assigned budget; or $999,999,999 limit exceeded.")
                setBudgetArray( current => {
                    const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                    if (indexOfInvalidItem !== -1) {
                        return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                    }
                    return current;
                })
            }
            const responseData = await response.json()
            console.log(responseData);
            setBudgetArray(await getBudgetList());

        } catch (error) {
            console.error("Error:", error);
        }
        setFormData({ category: "", amount: null, iconPath: "", group: ""});
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
                       value={formData.amount === null ? "" : formData.amount}
                       name="amount"
                       id="amount"
                       className="mb-3"/>
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

                <FulcrumButton displayText="Insert Budget"/>

                <button className="mt-2" onClick={(e) => {
                    e.preventDefault()
                    setIsCreateBudgetVisible(false)
                }}>x</button>

            </form>
        </div>
    )
}
