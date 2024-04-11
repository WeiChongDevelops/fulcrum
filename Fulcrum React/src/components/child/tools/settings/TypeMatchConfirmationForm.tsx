import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  changeFormOrModalVisibility,
  SetFormVisibility,
  SetModalVisibility,
  SettingsFormVisibility,
  SettingsModalVisibility,
} from "../../../../util.ts";
import FulcrumButton from "../../other/FulcrumButton.tsx";

interface TypeMatchConfirmationFormProps {
  areYouSureMessage: string;
  typeMatchString: string;
  setFormVisibility: SetFormVisibility<SettingsFormVisibility>;
  setModalVisibility: SetModalVisibility<SettingsModalVisibility>;
  formVisibility: string;
  lastChanceModalVisibility: string;
}

/**
 * A form that requires the user to type a specified string to confirm an action.
 */
export function TypeMatchConfirmationForm({
  areYouSureMessage,
  typeMatchString,
  setFormVisibility,
  formVisibility,
  setModalVisibility,
  lastChanceModalVisibility,
}: TypeMatchConfirmationFormProps) {
  const [typeMatchInput, setTypeMatchInput] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const typeMatchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    typeMatchInputRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function hideForm() {
    changeFormOrModalVisibility(setFormVisibility, formVisibility, false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTypeMatchInput(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (typeMatchInput === typeMatchString) {
      changeFormOrModalVisibility(setFormVisibility, formVisibility, false);
      changeFormOrModalVisibility(setModalVisibility, lastChanceModalVisibility, true);
    } else {
      console.log("Input text not matching.");
    }
  }

  return (
    <div ref={formRef} className={"fulcrum-form"}>
      <FulcrumButton
        onClick={hideForm}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className={"mt-6"}>{areYouSureMessage}</p>

      <p>Enter {typeMatchString} below to proceed.</p>
      <form className={"flex flex-col"} onSubmit={handleSubmit}>
        <input
          type="text"
          name={"typeMatch"}
          placeholder={typeMatchString}
          onChange={handleChange}
          value={typeMatchInput}
          className={"my-6"}
          ref={typeMatchInputRef}
        />
        <FulcrumButton displayText={"Confirm"} backgroundColour={"red"} />
      </form>
    </div>
  );
}
