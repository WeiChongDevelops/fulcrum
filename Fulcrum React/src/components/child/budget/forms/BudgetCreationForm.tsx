import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import {
  addIconSelectionFunctionality,
  BudgetFormVisibility,
  BudgetItemEntity,
  capitaliseFirstLetter,
  colourStyles,
  getColourOfGroup,
  groupListAsOptions,
  GroupItemEntity,
  BudgetCreationFormData,
  handleInputChangeOnFormWithAmount,
  SetFormVisibility,
  changeFormOrModalVisibility,
  getRandomGroupColour,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_GROUP,
} from "../../../../util.ts";
import CreatableSelect from "react-select/creatable";
import "../../../../css/Budget.css";
import CategoryIconSelector from "../../selectors/CategoryIconSelector.tsx";
import useCreateBudget from "../../../../hooks/mutations/budget/useCreateBudget.ts";

interface BudgetCreationFormProps {
  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  currencySymbol: string;
}

/**
 * A form for creating a new budget item.
 */
export default function BudgetCreationForm({
  groupArray,
  groupNameOfNewItem,
  setBudgetFormVisibility,
  currencySymbol,
}: BudgetCreationFormProps) {
  const [formData, setFormData] = useState<BudgetCreationFormData>({
    category: "",
    amount: 0,
    iconPath: "",
    group: groupNameOfNewItem,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: createBudget } = useCreateBudget();

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateBudgetVisible", false);
  }
  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const removeIconEventListeners = addIconSelectionFunctionality(setFormData, "category");
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      removeIconEventListeners();
    };
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      category: "",
      amount: 0,
      iconPath: "",
      group: groupNameOfNewItem,
    });
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const newBudgetItem: BudgetItemEntity = {
      category: formData.category,
      amount: formData.amount ? parseFloat(String(formData.amount)) : 0,
      iconPath: formData.iconPath === "" ? DEFAULT_CATEGORY_ICON : formData.iconPath,
      group: formData.group ? formData.group : DEFAULT_CATEGORY_GROUP,
      timestamp: new Date(),
    };

    if (!groupArray.map((groupItem) => groupItem.group).includes(newBudgetItem.group)) {
      defaultGroupItem = {
        group: newBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
      };
    }

    createBudget({
      newBudgetItem: newBudgetItem,
      newGroupItem: defaultGroupItem,
    });
  }

  function handleGroupInputChange(e: any) {
    setFormData((currentFormData: BudgetCreationFormData) => ({
      ...currentFormData,
      group: e.value,
    }));
  }

  return (
    <div ref={formRef} className="fulcrum-form fixed flex flex-col justify-center items-center rounded-3xl">
      <FulcrumButton
        displayText={"Close"}
        backgroundColour={"grey"}
        optionalTailwind={"ml-auto mb-auto"}
        onClick={() => {
          hideForm();
        }}
      />

      <p className="mb-6 font-bold text-3xl">New Budget Item</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto ">
        <label htmlFor="category">Category</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={capitaliseFirstLetter(formData.category)}
          name="category"
          id="category"
          className="mb-3"
          maxLength={18}
          required
        />
        <label htmlFor="amount">Amount</label>
        <div>
          <b className="relative left-6 text-black">{currencySymbol}</b>
          <input
            type="text"
            onChange={handleInputChange}
            value={formData.amount === 0 ? "" : formData.amount}
            name="amount"
            id="amount"
            className="mb-3"
            required
          />
        </div>

        <label htmlFor="group">Category Group</label>
        <CreatableSelect
          id="group"
          name="group"
          defaultValue={{
            label: groupNameOfNewItem,
            value: groupNameOfNewItem,
            colour: getColourOfGroup(groupNameOfNewItem, groupArray),
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
        <input type="hidden" id="iconPath" name="iconPath" value="test" />
        <FulcrumButton displayText="Insert Budget" />
      </form>
    </div>
  );
}
