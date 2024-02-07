import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react";
import {SettingsFormVisibility, SettingsModalVisibility} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";

interface TypeMatchConfirmationFormProps {
    areYouSureMessage: string;
    typeMatchString: string;
    setFormVisibility: Dispatch<SetStateAction<SettingsFormVisibility>>;
    setModalVisibility: Dispatch<SetStateAction<SettingsModalVisibility>>;
    formVisibility: string;
    lastChanceModalVisibility: string;
}

export function TypeMatchConfirmationForm( { areYouSureMessage, typeMatchString, setFormVisibility, formVisibility, setModalVisibility, lastChanceModalVisibility }: TypeMatchConfirmationFormProps) {

    const [typeMatchInput, setTypeMatchInput] = useState("");

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setTypeMatchInput(e.target.value);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (typeMatchInput === typeMatchString) {
            setFormVisibility(current => ({...current, [formVisibility]: false}))
            setModalVisibility(current => ({...current, [lastChanceModalVisibility]: true}))
        } else {
            console.log("Input text not matching.");
        }
    }

    return (
        <div className={"fulcrum-form"}>
            <FulcrumButton onClick={() => {
                setFormVisibility((current: any) => ({...current, [`${lastChanceModalVisibility}`]: false}))
            }} displayText={"Cancel"} optionalTailwind={"ml-auto mb-auto"} backgroundColour="grey"></FulcrumButton>

            <p className={"mt-6"}>{areYouSureMessage}</p>

            <p>Enter {typeMatchString} below to proceed.</p>
            <form className={"flex flex-col"} onSubmit={handleSubmit}>
                <input type="text" name={"typeMatch"} placeholder={typeMatchString} onChange={handleChange} value={typeMatchInput} className={"my-6"}/>
                <FulcrumButton displayText={"Confirm"} backgroundColour={"red"}/>
            </form>
        </div>
    );
}