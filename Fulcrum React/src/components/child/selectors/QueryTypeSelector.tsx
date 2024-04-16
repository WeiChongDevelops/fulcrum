import { colourStyles, queryTypeOptions } from "../../../utility/util.ts";
import Select from "react-select";
import { Dispatch, SetStateAction } from "react";
import { ContactFormData } from "../../../utility/types.ts";

interface QueryTypeSelectorProps {
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function QueryTypeSelector({ setFormData }: QueryTypeSelectorProps) {
  function handleInputChange(e: any) {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      queryType: e.value,
    }));
  }

  return (
    <Select
      id="queryType"
      name="queryType"
      options={queryTypeOptions}
      onChange={handleInputChange}
      defaultValue={queryTypeOptions[2]}
      styles={colourStyles}
      className="mt-2"
      theme={(theme: any) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: "rgba(201,223,201,0.1)",
          primary: "rgba(34,237,34,0.18)",
        },
      })}
      required
    />
  );
}
