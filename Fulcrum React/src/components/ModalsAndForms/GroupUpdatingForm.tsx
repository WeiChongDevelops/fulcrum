import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addColourSelectionFunctionality,
    BasicGroupData, BudgetFormVisibility,
    BudgetItemEntity,
    getBudgetList, GroupItemEntity,
    handleGroupUpdating
} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";
import GroupColourSelector from "../Budget/Selectors/GroupColourSelector.tsx";

interface GroupUpdatingFormProps {
    oldGroupBeingEdited: { oldColour: string, oldGroupName: string };
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
    groupArray: GroupItemEntity[]
    setBudgetFormVisibility: Dispatch<SetStateAction<BudgetFormVisibility>>;
}

export default function GroupUpdatingForm( { setBudgetArray, oldGroupBeingEdited, setGroupArray, groupArray, setBudgetFormVisibility }: GroupUpdatingFormProps) {

    const [formData, setFormData]
        = useState<BasicGroupData>({
        colour: oldGroupBeingEdited.oldColour,
        group: oldGroupBeingEdited.oldGroupName
        })
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        addColourSelectionFunctionality(setFormData);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setBudgetFormVisibility(current => ({...current, isUpdateGroupVisible: false}))
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setBudgetFormVisibility(current => ({...current, isUpdateGroupVisible: false}))

        await handleGroupUpdating(oldGroupBeingEdited.oldGroupName, oldGroupBeingEdited.oldColour, formData, setGroupArray, groupArray)

        setFormData({
            colour: oldGroupBeingEdited.oldColour,
            group: oldGroupBeingEdited.oldGroupName
        })
        getBudgetList()
            .then(budgetList => setBudgetArray(budgetList))
    }

    return (
        <div ref={formRef} className="budget-form">
            <button className="close-form-or-modal-button ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setBudgetFormVisibility(current => ({...current, isUpdateGroupVisible: false}))
            }}>Close</button>

            <p className="mb-6 font-bold text-4xl">Updating Group {oldGroupBeingEdited.oldGroupName}</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="groupName">Group Name</label>
                <input type="text"
                       name="group"
                       id="group"
                       value={formData.group}
                       onChange={handleInputChange}
                />

                <GroupColourSelector oldColour={oldGroupBeingEdited.oldColour}/>

                <FulcrumButton displayText="Update Group" />
            </form>

        </div>
    );
}