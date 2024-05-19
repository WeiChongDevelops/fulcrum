import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import {
  addColourSelectionFunctionality,
  changeFormOrModalVisibility,
  addFormExitListeners,
  getRandomGroupColour,
  capitaliseFirstLetter,
  LocationContext,
} from "../../../../utility/util.ts";
import "../../../../css/Budget.css";
import GroupColourSelector from "../../selectors/GroupColourSelector.tsx";
import useCreateGroup from "../../../../hooks/mutations/budget/useCreateGroup.ts";
import { BasicGroupData, BudgetFormVisibility, GroupItemEntity, SetFormVisibility } from "../../../../utility/types.ts";

interface GroupCreationFormProps {
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  highestSortIndex: number;
}

/**
 * A form for creating a new budget category group.
 */
export default function GroupCreationForm({ setBudgetFormVisibility, highestSortIndex }: GroupCreationFormProps) {
  const [formData, setFormData] = useState<BasicGroupData>({
    group: "",
    colour: "",
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: createGroup } = useCreateGroup();
  const routerLocation = useContext(LocationContext);

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateGroupVisible", false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    const removeColourEventListeners = addColourSelectionFunctionality(setFormData);
    return () => {
      removeFormExitEventListeners();
      removeColourEventListeners();
    };
  }, [routerLocation]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((oldFormData) => {
      return { ...oldFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({ group: "", colour: "" });

    const newGroupItem: GroupItemEntity = {
      group: formData.group,
      colour: formData.colour ? formData.colour : getRandomGroupColour(),
      timestamp: new Date(),
      id: highestSortIndex + 1,
    };

    createGroup(newGroupItem);
  }

  return (
    <div ref={formRef} className="fulcrum-form justify-center items-center">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mt-4 close-form-or-modal-button mb-6 font-bold text-3xl">New Category Group</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="Group Name">Group Name</label>
        <input
          type="text"
          onChange={handleInputChange}
          value={capitaliseFirstLetter(formData.group)}
          name="group"
          id="group"
          className="mb-3"
          maxLength={22}
          autoComplete={"off"}
          required
        />

        <GroupColourSelector />

        <FulcrumButton displayText="Add New Category Group" />
      </form>
    </div>
  );
}
