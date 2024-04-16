import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  addIconSelectionFunctionality,
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetUpdatingFormData,
  colourStyles,
  getColourOfGroup,
  groupListAsOptions,
  GroupItemEntity,
  handleInputChangeOnFormWithAmount,
  SetFormVisibility,
  changeFormOrModalVisibility,
  PreviousBudgetBeingEdited,
  getRandomGroupColour,
  addFormExitListeners,
} from "../../../../util.ts";
import CreatableSelect from "react-select/creatable";
import CategoryIconSelector from "../../selectors/CategoryIconSelector.tsx";
import useUpdateBudget from "../../../../hooks/mutations/budget/useUpdateBudget.ts";
interface BudgetUpdatingFormProps {
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  groupArray: GroupItemEntity[];
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  currencySymbol: string;
}

/**
 * A form for updating an existing budget item.
 */
export default function BudgetUpdatingForm({
  groupArray,
  oldBudgetBeingEdited,
  setBudgetFormVisibility,
  currencySymbol,
}: BudgetUpdatingFormProps) {
  const [formData, setFormData] = useState<BudgetUpdatingFormData>({
    category: oldBudgetBeingEdited.oldCategory,
    amount: oldBudgetBeingEdited.oldAmount,
    iconPath: oldBudgetBeingEdited.oldIconPath,
    group: oldBudgetBeingEdited.oldGroup,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateBudget } = useUpdateBudget();

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateBudgetVisible", false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    const removeIconEventListeners = addIconSelectionFunctionality(setFormData, "category");
    return () => {
      removeFormExitEventListeners();
      removeIconEventListeners();
    };
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function handleGroupInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, group: e.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: oldBudgetBeingEdited.oldCategory,
      amount: oldBudgetBeingEdited.oldAmount,
      iconPath: "",
      group: oldBudgetBeingEdited.oldGroup,
    });
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const updatedBudgetItem: BudgetItemEntity = { ...formData, timestamp: new Date() };

    if (!groupArray.map((groupItem) => groupItem.group).includes(updatedBudgetItem.group)) {
      defaultGroupItem = {
        group: updatedBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
      };
    }

    updateBudget({
      originalCategory: oldBudgetBeingEdited.oldCategory,
      updatedBudgetItem: updatedBudgetItem,
      newGroupItem: defaultGroupItem,
    });
  }

  return (
    <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-start items-center rounded-3xl text-white">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 font-bold text-3xl">Updating Budget for '{oldBudgetBeingEdited.oldCategory}'</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={formData.category}
          name="category"
          id="category"
          maxLength={18}
          autoComplete={"off"}
          required
        />

        <label htmlFor="amount" className={"mt-3"}>
          Amount
        </label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount ?? ""}
            name="amount"
            id="amount"
            className="mb-3"
            autoComplete={"off"}
            required
          />
        </div>

        <label htmlFor="group">Category Group</label>
        <CreatableSelect
          id="group"
          name="group"
          defaultValue={{
            label: oldBudgetBeingEdited.oldGroup,
            value: oldBudgetBeingEdited.oldGroup,
            colour: getColourOfGroup(oldBudgetBeingEdited.oldGroup, groupArray),
          }}
          options={groupListAsOptions(groupArray).map((option) => {
            return {
              label: option.label,
              value: option.value,
              colour: option.colour!!,
            };
          })}
          onChange={handleGroupInputChange}
          styles={colourStyles}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(201,223,201,0.1)",
              primary: "rgba(34,237,34,0.18)",
            },
          })}
        />

        <CategoryIconSelector />
        <input type="hidden" id="iconPath" name="iconPath" value="" />
        <FulcrumButton displayText="Update Budget" />
      </form>
    </div>
  );
}
