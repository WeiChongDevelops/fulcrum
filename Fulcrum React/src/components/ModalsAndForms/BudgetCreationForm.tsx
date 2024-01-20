import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality,
    BudgetFormVisibility,
    BudgetItemEntity, capitalizeFirstLetter, colourStyles, getColourOfGroup, groupListAsOptions,
    handleBudgetCreation, GroupItemEntity
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import "../../css/Budget.css"
import BudgetIconSelector from "../Budget/Selectors/BudgetIconSelector.tsx";

interface BudgetCreationFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    groupArray: GroupItemEntity[];
    groupNameOfNewItem: string;
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
}

export default function BudgetCreationForm({ setBudgetArray, groupArray, groupNameOfNewItem, setBudgetFormVisibility }: BudgetCreationFormProps) {

    const [formData, setFormData] = useState<BudgetItemEntity>({ category: "", amount: 0, iconPath: "", group: groupNameOfNewItem});
    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setBudgetFormVisibility(current => ({...current, isCreateBudgetVisible: false}))
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
        setFormData( (currentFormData: BudgetItemEntity) => {
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

        setBudgetFormVisibility(current => ({...current, isCreateBudgetVisible: false}))
        await handleBudgetCreation(setBudgetArray, newBudgetItem);
        setFormData({ category: "", amount: 0, iconPath: "", group: groupNameOfNewItem});
    }

    function handleGroupInputChange(e: any) {
        setFormData((currentFormData: BudgetItemEntity) => ({ ...currentFormData, group: e.value }));
    }

    return (
        <div ref={formRef}  className="budget-form fixed flex flex-col justify-center items-center rounded-3xl">

            <button className="ml-auto mb-auto" onClick={(e) => {
                e.preventDefault()
                setBudgetFormVisibility(current => ({...current, isCreateBudgetVisible: false}))
            }}>Close</button>

            <p className="mb-6 font-bold text-4xl">New Budget Item</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={capitalizeFirstLetter(formData.category)}
                       name="category"
                       id="category"
                       className="mb-3"
                       maxLength={18}
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
                        colour: getColourOfGroup(groupNameOfNewItem, groupArray)
                    }}
                    options={groupListAsOptions(groupArray).map(option => {
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
