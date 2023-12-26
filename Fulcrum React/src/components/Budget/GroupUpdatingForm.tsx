import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addColourSelectionFunctionality,
    BasicGroupData,
    BudgetItemEntity,
    getBudgetList, GroupOptionsFormattedData,
    handleGroupUpdating
} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";
import GroupColourSelector from "./GroupColourSelector.tsx";

interface GroupUpdatingFormProps {
    oldGroupBeingEdited: { oldColour: string, oldGroupName: string };
    setIsUpdateGroupVisible: Dispatch<SetStateAction<boolean>>;
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>;
    initialGroupOptions: GroupOptionsFormattedData[]
}

export default function GroupUpdatingForm( { setBudgetArray, oldGroupBeingEdited, setIsUpdateGroupVisible, setInitialGroupOptions, initialGroupOptions }: GroupUpdatingFormProps) {

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
            setIsUpdateGroupVisible(false);
        }
    };

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData( currentFormData => {
            return {...currentFormData, [e.target.name]: e.target.value}
        })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setInitialGroupOptions(currentGroupOptions => {
            return currentGroupOptions.map(groupOption => groupOption.label == oldGroupBeingEdited.oldGroupName ? {
                colour: formData.colour,
                value: formData.group,
                label: formData.group
            } : groupOption)
        })

        setIsUpdateGroupVisible(false);
        await handleGroupUpdating(oldGroupBeingEdited.oldGroupName, oldGroupBeingEdited.oldColour, formData.group, formData.colour, setInitialGroupOptions, initialGroupOptions)

        setFormData({
            colour: oldGroupBeingEdited.oldColour,
            group: oldGroupBeingEdited.oldGroupName
        })
        getBudgetList()
            .then(budgetList => setBudgetArray(budgetList))
    }

    return (
        <div ref={formRef} className="budgetForm fixed flex flex-col justify-start items-center rounded-3xl text-white">
            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsUpdateGroupVisible(false);
            }}>Close</button>

            <h1 className="mb-6">Updating Group {oldGroupBeingEdited.oldGroupName}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="groupName">Group Name</label>
                <input type="text"
                       name="group"
                       value={formData.group}
                       onChange={handleInputChange}
                />

                <GroupColourSelector oldColour={oldGroupBeingEdited.oldColour}/>

                <FulcrumButton displayText="Update Group" />
            </form>

        </div>
    );
}