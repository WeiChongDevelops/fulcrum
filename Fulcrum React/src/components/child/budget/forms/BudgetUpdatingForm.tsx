import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  addFormExitListeners,
  addIconSelectionFunctionality,
  changeFormOrModalVisibility,
  colourStyles,
  getColourOfGroup,
  getHighestGroupSortIndex,
  getRandomGroupColour,
  groupListAsOptions,
  handleInputChangeOnFormWithAmount,
  LocationContext,
} from "../../../../utility/util.ts";
import CreatableSelect from "react-select/creatable";
import CategoryIconSelector from "../../selectors/CategoryIconSelector.tsx";
import useUpdateBudget from "../../../../hooks/mutations/budget/useUpdateBudget.ts";
import {
  BudgetFormVisibility,
  BudgetItemEntity,
  BudgetModalVisibility,
  BudgetUpdatingFormData,
  GroupItemEntity,
  PreviousBudgetBeingEdited,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";
interface BudgetUpdatingFormProps {
  oldBudgetBeingEdited: PreviousBudgetBeingEdited;
  groupArray: GroupItemEntity[];
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setBudgetModalVisibility: SetModalVisibility<BudgetModalVisibility>;
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

  setBudgetModalVisibility,
}: BudgetUpdatingFormProps) {
  const [formData, setFormData] = useState<BudgetUpdatingFormData>({
    category: oldBudgetBeingEdited.oldCategory,
    amount: oldBudgetBeingEdited.oldAmount.toString(),
    iconPath: oldBudgetBeingEdited.oldIconPath,
    group: oldBudgetBeingEdited.oldGroup,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateBudget } = useUpdateBudget();
  const routerLocation = useContext(LocationContext);

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
  }, [routerLocation]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    handleInputChangeOnFormWithAmount(e, setFormData);
  }

  function handleGroupInputChange(e: any) {
    setFormData((prevFormData) => ({ ...prevFormData, group: e.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    let defaultGroupItem: GroupItemEntity | undefined = undefined;

    const updatedBudgetItem: BudgetItemEntity = { ...formData, amount: parseFloat(formData.amount), timestamp: new Date() };

    if (!groupArray.map((groupItem) => groupItem.group).includes(updatedBudgetItem.group)) {
      defaultGroupItem = {
        group: updatedBudgetItem.group,
        colour: getRandomGroupColour(),
        timestamp: new Date(),
        id: getHighestGroupSortIndex(groupArray) + 1,
      };
    }

    updateBudget({
      originalCategory: oldBudgetBeingEdited.oldCategory,
      updatedBudgetItem: updatedBudgetItem,
      newGroupItem: defaultGroupItem,
    });

    setFormData({
      category: oldBudgetBeingEdited.oldCategory,
      amount: oldBudgetBeingEdited.oldAmount.toString(),
      iconPath: "",
      group: oldBudgetBeingEdited.oldGroup,
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
        <div className={"flex flex-row gap-4"}>
          <FulcrumButton displayText="Update Budget" />
          <FulcrumButton
            backgroundColour={"red"}
            displayText={"Delete Budget"}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              changeFormOrModalVisibility(setBudgetModalVisibility, "isConfirmCategoryDeletionModalVisible", true);
              hideForm();
            }}
          />
        </div>
      </form>
    </div>
  );
}
