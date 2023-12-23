import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality,
    BudgetCreationFormData,
    BudgetItemEntity, colourStyles, GroupOptionsFormattedData,
    handleBudgetCreation
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import "../../css/Budget.css"

interface DBInsertionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    initialGroupOptions: GroupOptionsFormattedData[];
    groupNameOfNewItem: string;
    groupColourOfNewItem: string;
}

export default function BudgetCreationForm({ setBudgetArray, setIsCreateBudgetVisible, initialGroupOptions, groupNameOfNewItem, groupColourOfNewItem }: DBInsertionFormProps) {

    const [formData, setFormData] = useState<BudgetCreationFormData>({ category: "", amount: 0, iconPath: "", group: groupNameOfNewItem});
    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setIsCreateBudgetVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        addIconSelectionFunctionality(setFormData);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        });
    }
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newBudgetItem: BudgetItemEntity = {
            category: formData.category,
            amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
            iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
            group: formData.group ? formData.group : "Miscellaneous"
        }

        setBudgetArray(current => [...current, newBudgetItem])

        setIsCreateBudgetVisible(false);
        await handleBudgetCreation(formData, setBudgetArray, newBudgetItem);
        setFormData({ category: "", amount: 0, iconPath: "", group: groupNameOfNewItem});
    }

    function handleGroupInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, group: e.value }));
    }

    return (
        <div ref={formRef}  className="budgetForm fixed flex flex-col justify-center items-center rounded-3xl">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault()
                setIsCreateBudgetVisible(false)
            }}>Close</button>

            <h1 className="mb-6">New Budget Item</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category}
                       name="category"
                       id="category"
                       className="mb-3"
                       required/>
                <label htmlFor="amount">Amount</label>
                <input type="number"
                       onChange={handleInputChange}
                       value={formData.amount === 0 ? "" : formData.amount}
                       name="amount"
                       id="amount"
                       className="mb-3"
                       min={0.01}
                       step={0.01}
                       required/>
                <label htmlFor="group">Group</label>

                <CreatableSelect
                    id="group"
                    name="group"
                    // defaultInputValue={groupOfNewItem}
                    // options={initialGroupOptions}
                    defaultValue={{label: groupNameOfNewItem, value: groupNameOfNewItem, colour: groupColourOfNewItem}}
                    options={initialGroupOptions.map(option => {
                        return {label: option.label, value: option.value, colour: option.colour!!}
                    })}
                    onChange={handleGroupInputChange}
                    styles={colourStyles}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                            ...theme.colors,
                            primary25: '#262925',
                            primary: "black"
                        },
                    })}
                />

                <div id="icon-selector" className="my-2">
                    <button type="button" className="category-icon-selectable" data-value="category-bank-icon.svg">
                        <img src="/src/assets/category-icons/category-bank-icon.svg" alt="Bank"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-water-icon.svg">
                        <img src="/src/assets/category-icons/category-water-icon.svg" alt="Water"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-pig-icon.svg">
                        <img src="/src/assets/category-icons/category-pig-icon.svg" alt="Piggy Bank"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-beer-icon.svg">
                        <img src="/src/assets/category-icons/category-beer-icon.svg" alt="Beer"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-car-icon.svg">
                        <img src="/src/assets/category-icons/category-car-icon.svg" alt="Car"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-cash-icon.svg">
                        <img src="/src/assets/category-icons/category-cash-icon.svg" alt="Cash"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-electricity-icon.svg">
                        <img src="/src/assets/category-icons/category-electricity-icon.svg" alt="Electricity"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-gift-icon.svg">
                        <img src="/src/assets/category-icons/category-gift-icon.svg" alt="Gift"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-health-icon.svg">
                        <img src="/src/assets/category-icons/category-health-icon.svg" alt="Health"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-house-icon.svg">
                        <img src="/src/assets/category-icons/category-house-icon.svg" alt="House"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-movie-icon.svg">
                        <img src="/src/assets/category-icons/category-movie-icon.svg" alt="Movie"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-music-icon.svg">
                        <img src="/src/assets/category-icons/category-music-icon.svg" alt="Music"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-pet-icon.svg">
                        <img src="/src/assets/category-icons/category-pet-icon.svg" alt="Pet"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-petrol-icon.svg">
                        <img src="/src/assets/category-icons/category-petrol-icon.svg" alt="Petrol"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-plane-icon.svg">
                        <img src="/src/assets/category-icons/category-plane-icon.svg" alt="Plane"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-shirt-icon.svg">
                        <img src="/src/assets/category-icons/category-shirt-icon.svg" alt="Shirt"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-tool-icon.svg">
                        <img src="/src/assets/category-icons/category-tool-icon.svg" alt="Tool"/>
                    </button>
                    <button type="button" className="category-icon-selectable" data-value="category-train-icon.svg">
                        <img src="/src/assets/category-icons/category-train-icon.svg" alt="Train"/>
                    </button>
                </div>
                <input type="hidden" id="iconPath" name="iconPath" value="test"/>

                <FulcrumButton displayText="Insert Budget"/>
            </form>
        </div>
    )
}
