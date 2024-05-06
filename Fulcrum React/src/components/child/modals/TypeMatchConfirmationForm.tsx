import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { addFormExitListeners, changeFormOrModalVisibility, LocationContext } from "../../../utility/util.ts";
import FulcrumButton from "../buttons/FulcrumButton.tsx";
import { toast } from "sonner";
import {
  SetFormVisibility,
  SetModalVisibility,
  SettingsFormVisibility,
  SettingsModalVisibility,
} from "../../../utility/types.ts";

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
  const routerLocation = useContext(LocationContext);

  function hideForm() {
    changeFormOrModalVisibility(setFormVisibility, formVisibility, false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    typeMatchInputRef.current?.focus();
    return () => {
      removeFormExitEventListeners();
    };
  }, [routerLocation]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setTypeMatchInput(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (typeMatchInput === typeMatchString) {
      changeFormOrModalVisibility(setFormVisibility, formVisibility, false);
      changeFormOrModalVisibility(setModalVisibility, lastChanceModalVisibility, true);
    } else {
      toast.warning("Text does not match.");
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

      <p>Enter '{typeMatchString}' below to proceed.</p>
      <form className={"flex flex-col"} onSubmit={handleSubmit}>
        <input
          type="text"
          name={"typeMatch"}
          placeholder={typeMatchString}
          onChange={handleChange}
          value={typeMatchInput}
          className={"my-6"}
          ref={typeMatchInputRef}
          autoComplete={"off"}
        />
        <FulcrumButton displayText={"Confirm"} backgroundColour={"red"} />
      </form>
    </div>
  );
}
