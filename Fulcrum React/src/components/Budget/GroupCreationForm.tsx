import FulcrumButton from "../Other/FulcrumButton.tsx";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState} from "react";
import {
    addColourSelectionFunctionality,
    BasicGroupData,
    GroupOptionsFormattedData,
    handleGroupCreation
} from "../../util.ts";
import "../../css/Budget.css"

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

                {/*<label htmlFor="colour">Colour Hex (TEMP)</label>*/}
                {/*<input type="text"*/}
                {/*       onChange={handleInputChange}*/}
                {/*       value={formData.colour ? formData.colour: ""}*/}
                {/*       name="colour"*/}
                {/*       id="colour"*/}
                {/*       className="mb-3"*/}
                {/*       required/>*/}

                <div id="group-colour-selector">
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(208,68,67)]" data-value="rgb(208,68,67)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(255,112,122)]" data-value="rgb(255,112,122)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(242,147,203)]" data-value="rgb(242,147,203)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(155,65,241)]" data-value="rgb(155,65,241)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(78,94,233)]" data-value="rgb(78,94,233)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(115,174,240)]" data-value="rgb(115,174,240)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(57,207,221)]" data-value="rgb(57,207,221)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(38,221,155)]" data-value="rgb(38,221,155)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(181,208,75)]" data-value="rgb(181,208,75)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(229,232,57)]" data-value="rgb(229,232,57)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(236,197,154)]" data-value="rgb(236,197,154)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(251,174,56)]" data-value="rgb(251,174,56)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(170,125,66)]" data-value="rgb(170,125,66)"></div>
                    </div>
                    <div className="group-colour-selectable-container">
                        <div className="group-colour-triangle bg-[rgb(211,209,210)]" data-value="rgb(211,209,210)"></div>
                    </div>
                </div>

                <FulcrumButton displayText="Add New Category Group"/>
            </form>
        </div>
    )
}