import FulcrumButton from "../FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import {
    addIconSelectionFunctionality,
    BudgetItemEntity,
    BudgetUpdatingFormData,
    getBudgetList,
    handleBudgetUpdating
} from "../../util.ts";

interface DBUpdatingFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    category: string | null;
    setIsUpdateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    oldAmount: number | null;
}

export default function BudgetUpdatingForm({ setBudgetArray, category, setIsUpdateBudgetVisible, oldAmount }: DBUpdatingFormProps) {

    const [formData, setFormData] = useState<BudgetUpdatingFormData>({ amount: null, iconPath: "", group: "" });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setIsUpdateBudgetVisible(false);
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData(currentFormData => ({ ...currentFormData, [e.target.name]: e.target.value }));
        addIconSelectionFunctionality(setFormData);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsUpdateBudgetVisible(false);

        await handleBudgetUpdating(category, formData);

        setFormData({ amount: null, iconPath: "", group: "" });
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="budgetForm fixed flex flex-col justify-start items-center rounded-3xl text-white">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsUpdateBudgetVisible(false);
            }}>Close</button>

            <h1 className="mb-6">Updating Budget for {category}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
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
            </form>
        </div>
    );
}
