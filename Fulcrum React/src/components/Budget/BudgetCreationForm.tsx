import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality,
    BudgetCreationFormData,
    BudgetItemEntity, GroupOptionsFormattedData,
    handleBudgetCreation
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';

interface DBInsertionFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    initialGroupOptions: GroupOptionsFormattedData[];
    groupOfNewItem: string;
}

export default function BudgetCreationForm({ setBudgetArray, setIsCreateBudgetVisible, initialGroupOptions, groupOfNewItem }: DBInsertionFormProps) {

    const [formData, setFormData] = useState<BudgetCreationFormData>({ category: "", amount: 0, iconPath: "", group: groupOfNewItem});
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
        setIsCreateBudgetVisible(false)

        await handleBudgetCreation(formData, setBudgetArray, newBudgetItem);
        setFormData({ category: "", amount: 0, iconPath: "", group: groupOfNewItem});
    }

    function handleGroupInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, group: e.value }));
    }

    const colourStyles = {
        control: (styles: any) => ({ ...styles, backgroundColor: "white" }),
        option: (styles: any, {data}: any) => {
            return { ...styles, colour: data.color };
        }
    };

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
                {/*<input type="text"*/}
                {/*       onChange={handleInputChange}*/}
                {/*       value={formData.group}*/}
                {/*       name="group"*/}
                {/*       id="group"*/}
                {/*       className="mb-3"*/}
                {/*       placeholder="Miscellaneous"/>*/}

                <CreatableSelect
                    id="group"
                    name="group"
                    defaultInputValue={groupOfNewItem}
                    options={initialGroupOptions}
                    onChange={handleGroupInputChange}
                    styles={colourStyles}
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
                </div>
                <input type="hidden" id="iconPath" name="iconPath" value="test"/>

                <FulcrumButton displayText="Insert Budget"/>
            </form>
        </div>
    )
}
