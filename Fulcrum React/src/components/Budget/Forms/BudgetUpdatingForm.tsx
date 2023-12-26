import FulcrumButton from "../../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality, BudgetFormVisibilityState,
    BudgetItemEntity,
    BudgetUpdatingFormData, colourStyles,
    getBudgetList, getColourOfGroup, GroupOptionsFormattedData,
    handleBudgetUpdating,
} from "../../../util.ts";
import CreatableSelect from 'react-select/creatable';
import BudgetIconSelector from "../Selectors/BudgetIconSelector.tsx";

interface DBUpdatingFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    oldBudgetBeingEdited: { oldAmount: number, oldCategory: string, oldGroup: string }
    initialGroupOptions: GroupOptionsFormattedData[];
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibilityState>>;
}

export default function BudgetUpdatingForm({ setBudgetArray, initialGroupOptions, oldBudgetBeingEdited, setBudgetFormVisibility }: DBUpdatingFormProps) {


    const [formData, setFormData] = useState<BudgetUpdatingFormData>({ category: oldBudgetBeingEdited.oldCategory, amount: oldBudgetBeingEdited.oldAmount, iconPath: "", group: "" });
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        addIconSelectionFunctionality(setFormData);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setBudgetFormVisibility(current => ({...current, isUpdateBudgetVisible: false}))
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData(currentFormData => ({ ...currentFormData, [e.target.name]: e.target.value }));
    }

    function handleGroupInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, group: e.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setBudgetFormVisibility(current => ({...current, isUpdateBudgetVisible: false}))

        await handleBudgetUpdating(oldBudgetBeingEdited.oldCategory, formData);

        setFormData({ category: oldBudgetBeingEdited.oldCategory, amount: oldBudgetBeingEdited.oldAmount, iconPath: "", group: "" });
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="budget-form fixed flex flex-col justify-start items-center rounded-3xl text-white">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setBudgetFormVisibility(current => ({...current, isUpdateBudgetVisible: false}))
            }}>Close</button>

            <h1 className="mb-6">Updating Budget for {oldBudgetBeingEdited.oldCategory}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category Name</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category}
                       name="category"
                       id="category"
                       defaultValue={oldBudgetBeingEdited.oldCategory}
                       maxLength={22}/>

                <label htmlFor="amount">Amount</label>
                <input type="number"
                       onChange={handleInputChange}
                       value={formData.amount ?? ""}
                       name="amount"
                       id="amount"
                       className="mb-3"
                       defaultValue={oldBudgetBeingEdited.oldAmount?.toString()}
                       min={0.01}
                       step={0.01}
                />


                <label htmlFor="group">Group</label>
                <CreatableSelect
                    id="group"
                    name="group"
                    defaultValue={{
                        label: oldBudgetBeingEdited.oldGroup,
                        value: oldBudgetBeingEdited.oldGroup,
                        colour: getColourOfGroup(oldBudgetBeingEdited.oldGroup, initialGroupOptions)
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
                <FulcrumButton displayText="Update Budget" />
            </form>
        </div>
    );
}
