import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import {
  addColourSelectionFunctionality,
  addFormExitListeners,
  changeFormOrModalVisibility,
  LocationContext,
} from "../../../../utility/util.ts";
import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import GroupColourSelector from "../../selectors/GroupColourSelector.tsx";
import useUpdateGroup from "../../../../hooks/mutations/budget/useUpdateGroup.ts";
import {
  BasicGroupData,
  BudgetFormVisibility,
  GroupItemEntity,
  PreviousGroupBeingEdited,
  SetFormVisibility,
} from "../../../../utility/types.ts";

interface GroupUpdatingFormProps {
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
}

/**
 * A form for updating an existing budget category group.
 */
export default function GroupUpdatingForm({
  oldGroupBeingEdited = {
    oldColour: "#fff",
    oldGroupName: "Miscellaneous",
    oldId: 0,
  },
  setBudgetFormVisibility,
  setLocalisedGroupArray,
}: GroupUpdatingFormProps) {
  const [formData, setFormData] = useState<BasicGroupData>({
    colour: oldGroupBeingEdited.oldColour,
    group: oldGroupBeingEdited.oldGroupName,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateGroup } = useUpdateGroup();
  const routerLocation = useContext(LocationContext);

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", false);
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
    setFormData((currentFormData) => {
      return { ...currentFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();
    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });

    setLocalisedGroupArray((prevLocalisedGroupArray) =>
      prevLocalisedGroupArray.map((groupItem) =>
        groupItem.group === oldGroupBeingEdited.oldGroupName
          ? { group: formData.group, colour: formData.colour!, timestamp: new Date(), id: oldGroupBeingEdited.oldId }
          : groupItem,
      ),
    );

    const updatedGroupItem: GroupItemEntity = {
      ...formData,
      colour: formData.colour!,
      timestamp: new Date(),
      id: oldGroupBeingEdited.oldId,
    };

    updateGroup({
      originalGroupName: oldGroupBeingEdited.oldGroupName,
      updatedGroupItem: updatedGroupItem,
    });
  }

  return (
    <div ref={formRef} className="fulcrum-form">
      <FulcrumButton
        onClick={() => {
          hideForm();
        }}
        displayText={"Cancel"}
        optionalTailwind={"ml-auto mb-auto"}
        backgroundColour="grey"
      ></FulcrumButton>

      <p className="mb-6 mt-4 font-bold text-3xl">Updating Category Group {oldGroupBeingEdited.oldGroupName}</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="groupName">Group Name</label>
        <input
          type="text"
          name="group"
          id="group"
          value={formData.group}
          onChange={handleInputChange}
          autoComplete={"off"}
        />

        <GroupColourSelector oldColour={oldGroupBeingEdited.oldColour} />

        <FulcrumButton displayText="Update Group" />
      </form>
    </div>
  );
}
