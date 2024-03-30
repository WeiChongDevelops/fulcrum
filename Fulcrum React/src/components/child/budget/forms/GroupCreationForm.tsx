import FulcrumButton from "../../other/FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import {
  addColourSelectionFunctionality,
  BasicGroupData,
  BudgetFormVisibility,
  capitaliseFirstLetter,
  handleGroupCreation,
  GroupItemEntity,
  getRandomGroupColour,
  getGroupList,
  SetFormVisibility,
  changeFormOrModalVisibility,
} from "../../../../util.ts";
import "../../../../css/Budget.css";
import GroupColourSelector from "../../selectors/GroupColourSelector.tsx";

interface GroupCreationFormProps {
  setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
}

/**
 * A form for creating a new budget category group.
 */
export default function GroupCreationForm(this: any, { setGroupArray, setBudgetFormVisibility }: GroupCreationFormProps) {
  const [formData, setFormData] = useState<BasicGroupData>({
    group: "",
    colour: "",
  });
  const formRef = useRef<HTMLDivElement>(null);

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateGroupVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
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
      return { ...oldFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    hideForm();

    const randomColour = getRandomGroupColour();

    const newGroupItem: GroupItemEntity = {
      group: formData.group,
      colour: formData.colour ? formData.colour : randomColour,
      timestamp: new Date(),
    };

    await handleGroupCreation(formData.group, formData.colour ? formData.colour : randomColour, setGroupArray, newGroupItem);
    setGroupArray(await getGroupList());
    setFormData({ group: "", colour: "" });
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

      <p className="close-form-or-modal-button mb-6 font-bold text-3xl">New Group</p>
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
          required
        />

        <GroupColourSelector />

        <FulcrumButton displayText="Add New Category Group" />
      </form>
    </div>
  );
}
