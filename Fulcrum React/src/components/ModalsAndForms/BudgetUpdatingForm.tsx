import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addIconSelectionFunctionality, BudgetFormVisibility,
    BudgetItemEntity,
    BudgetUpdatingFormData, colourStyles,
    getBudgetList, getColourOfGroup, groupListAsOptions,
    handleBudgetUpdating, GroupItemEntity, handleInputChangeOnFormWithAmount,
} from "../../util.ts";
import CreatableSelect from 'react-select/creatable';
import BudgetIconSelector from "../Budget/Selectors/BudgetIconSelector.tsx";

interface DBUpdatingFormProps {
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    oldBudgetBeingEdited: { oldAmount: number, oldCategory: string, oldGroup: string }
    groupArray: GroupItemEntity[];
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
}

export default function BudgetUpdatingForm({ setBudgetArray, groupArray, oldBudgetBeingEdited, setBudgetFormVisibility }: DBUpdatingFormProps) {


    const [formData, setFormData] = useState<BudgetUpdatingFormData>({ category: oldBudgetBeingEdited.oldCategory, amount: oldBudgetBeingEdited.oldAmount, iconPath: "", group: oldBudgetBeingEdited.oldGroup });
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
        handleInputChangeOnFormWithAmount(e, setFormData);
    }

    function handleGroupInputChange(e: any) {
        setFormData(currentFormData => ({ ...currentFormData, group: e.value }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setBudgetFormVisibility(current => ({...current, isUpdateBudgetVisible: false}))

        await handleBudgetUpdating(oldBudgetBeingEdited.oldCategory, formData);

        setFormData({ category: oldBudgetBeingEdited.oldCategory, amount: oldBudgetBeingEdited.oldAmount, iconPath: "", group: oldBudgetBeingEdited.oldGroup });
        getBudgetList().then(budgetList => setBudgetArray(budgetList));
    }

    return (
        <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
            <FulcrumButton onClick={() => {
                setBudgetFormVisibility(current => ({...current, isUpdateBudgetVisible: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className="mb-6 font-bold text-4xl">Updating Budget for {oldBudgetBeingEdited.oldCategory}</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="category">Category Name</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.category}
                       name="category"
                       id="category"
                       maxLength={18}
                       required/>

                <label htmlFor="amount">Amount</label>
                <div>
                    <b className="relative left-6 text-black">$</b>
                    <input type="text"
                           onChange={handleInputChange}
                           value={formData.amount ?? ""}
                           name="amount"
                           id="amount"
                           className="mb-3"
                           required
                    />
                </div>

                <label htmlFor="group">Group</label>
                <CreatableSelect
                    id="group"
                    name="group"
                    defaultValue={{
                        label: oldBudgetBeingEdited.oldGroup,
                        value: oldBudgetBeingEdited.oldGroup,
                        colour: getColourOfGroup(oldBudgetBeingEdited.oldGroup, groupArray)
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
                <input type="hidden" id="iconPath" name="iconPath" value=""/>
                <FulcrumButton displayText="Update Budget" />
            </form>
        </div>
    );
}
