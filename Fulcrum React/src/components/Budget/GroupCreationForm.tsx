import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addColourSelectionFunctionality,
    BasicGroupData, capitalizeFirstLetter,
    GroupOptionsFormattedData,
    handleGroupCreation
} from "../../util.ts";
import "../../css/Budget.css"
import GroupColourSelector from "./GroupColourSelector.tsx";

interface GroupCreationFormProps {
    setIsCreateGroupVisible: Dispatch<SetStateAction<boolean>>
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>
}

export default function GroupCreationForm(this: any, { setIsCreateGroupVisible, setInitialGroupOptions }: GroupCreationFormProps) {

    const [formData, setFormData] = useState<BasicGroupData>({ group: "", colour: "" })
    const formRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (e: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(e.target as Node)) {
            setIsCreateGroupVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        addColourSelectionFunctionality(setFormData);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData((oldFormData) => {
            return {...oldFormData, [e.target.name]: e.target.value}
        })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newGroupOption = {
            value: formData.group,
            label: formData.group,
            colour: formData.colour
        }

        const newGroupItem = {
            group: formData.group,
            colour: formData.colour
        }

        setInitialGroupOptions( (oldGroupOptions) => {
            return [...oldGroupOptions, newGroupOption]
        })
        setIsCreateGroupVisible(false)
        await handleGroupCreation(formData, setInitialGroupOptions, newGroupItem);
        setFormData({ group: "", colour: "" });

    }

    return (
        <div ref={formRef} className="budgetForm fixed flex flex-col justify-center items-center rounded-3xl">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault();
                setIsCreateGroupVisible(false);
            }}>Close</button>

            <h1 className="mb-6">New Group</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="Group Name">Group</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={capitalizeFirstLetter(formData.group)}
                       name="group"
                       id="group"
                       className="mb-3"
                       required/>

                <GroupColourSelector/>

                <FulcrumButton displayText="Add New Category Group"/>
            </form>
        </div>
    )
}