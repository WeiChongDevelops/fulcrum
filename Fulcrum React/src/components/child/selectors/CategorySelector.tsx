import { colourStyles } from "../../../utility/util.ts";
import CreatableSelect from "react-select/creatable";
import { Dispatch, SetStateAction } from "react";
import { components } from "react-select";
import { InputProps } from "react-select";
import {
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  PreviousRecurringExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
  SelectorOptionsFormattedData,
} from "../../../utility/types.ts";

interface CategorySelectorProps {
  categoryOptions: SelectorOptionsFormattedData[];
  oldExpenseBeingEdited?: PreviousExpenseBeingEdited | PreviousRecurringExpenseBeingEdited;
  setFormData:
    | Dispatch<SetStateAction<RecurringExpenseInstanceUpdatingFormData>>
    | Dispatch<SetStateAction<RecurringExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseCreationFormData>>;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function CategorySelector({ categoryOptions, oldExpenseBeingEdited, setFormData }: CategorySelectorProps) {
  const maxLengthInput: any = (props: InputProps) => {
    return <components.Input {...props} maxLength={18} />;
  };

  function handleCategoryInputChange(e: any) {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      category: e.value,
    }));
  }

  return (
    <CreatableSelect
      id="category"
      name="category"
      defaultValue={
        oldExpenseBeingEdited && {
          label: oldExpenseBeingEdited.oldCategory,
          value: oldExpenseBeingEdited.oldCategory,
          colour: categoryOptions.filter((categoryOption) => categoryOption.label === oldExpenseBeingEdited.oldCategory)[0]
            .colour,
        }
      }
      options={categoryOptions.map((option) => {
        return {
          label: option.label,
          value: option.value,
          colour: option.colour!!,
        };
      })}
      components={{ Input: maxLengthInput }}
      onChange={handleCategoryInputChange}
      placeholder={"Type to search or create... "}
      styles={colourStyles}
      className="mb-3"
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
