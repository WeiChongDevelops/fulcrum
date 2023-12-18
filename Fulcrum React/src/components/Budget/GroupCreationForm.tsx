import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react";
import {GroupOptionsFormattedData, handleGroupCreation} from "../../util.ts";

interface GroupCreationFormProps {
    setIsCreateGroupVisible: Dispatch<SetStateAction<boolean>>
    setInitialGroupOptions: Dispatch<SetStateAction<GroupOptionsFormattedData[]>>
}

export default function GroupCreationForm({ setIsCreateGroupVisible, setInitialGroupOptions }: GroupCreationFormProps) {

    const [formData, setFormData] = useState({ group: "", colour: "" })


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
        <div className="budgetForm fixed flex flex-col justify-center items-center rounded-3xl">

            <button className="mt-2.5 mr-2.5 ml-auto mb-auto" onClick={(e) => {
                e.preventDefault()
                setIsCreateGroupVisible(false)
            }}>Close</button>

            <h1 className="mb-6">New Group</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
                <label htmlFor="Group Name">Group</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.group}
                       name="group"
                       id="group"
                       className="mb-3"
                       required/>

                <label htmlFor="colour">Colour Hex (TEMP)</label>
                <input type="text"
                       onChange={handleInputChange}
                       value={formData.colour}
                       name="colour"
                       id="colour"
                       className="mb-3"
                       required/>

                <FulcrumButton displayText="Add New Category Group"/>
            </form>
        </div>
    )
}