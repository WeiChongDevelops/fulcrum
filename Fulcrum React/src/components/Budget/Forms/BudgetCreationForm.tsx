import FulcrumButton from "../../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality,
    BudgetCreationFormData,
    BudgetItemEntity, capitalizeFirstLetter, colourStyles, getColourOfGroup, GroupOptionsFormattedData,
    handleBudgetCreation
} from "../../../util.ts";
import CreatableSelect from 'react-select/creatable';
import "../../../css/Budget.css"
import BudgetIconSelector from "../Selectors/BudgetIconSelector.tsx";

interface BudgetCreationFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setIsCreateBudgetVisible: Dispatch<SetStateAction<boolean>>;
    initialGroupOptions: GroupOptionsFormattedData[];
    groupNameOfNewItem: string;
}

export default function BudgetCreationForm({ setBudgetArray, setIsCreateBudgetVisible, initialGroupOptions, groupNameOfNewItem }: BudgetCreationFormProps) {

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
                       value={capitalizeFirstLetter(formData.category)}
                       name="category"
                       id="category"
                       className="mb-3"
                       maxLength={22}
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
                    defaultValue={{
                        label: groupNameOfNewItem,
                        value: groupNameOfNewItem,
                        colour: getColourOfGroup(groupNameOfNewItem, initialGroupOptions)
                }}
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

                <BudgetIconSelector/>
                <input type="hidden" id="iconPath" name="iconPath" value="test"/>

                <FulcrumButton displayText="Insert Budget"/>
            </form>
        </div>
    )
}
