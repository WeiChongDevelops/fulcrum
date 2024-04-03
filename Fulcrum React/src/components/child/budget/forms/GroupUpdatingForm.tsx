import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import {
  addColourSelectionFunctionality,
  BasicGroupData,
  BudgetFormVisibility,
  BudgetItemEntity,
  changeFormOrModalVisibility,
  EmailContext,
  getBudgetList,
  GroupItemEntity,
  handleGroupUpdating,
  SetFormVisibility,
} from "../../../../util.ts";
import FulcrumButton from "../../other/FulcrumButton.tsx";
import GroupColourSelector from "../../selectors/GroupColourSelector.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GroupUpdatingFormProps {
  oldGroupBeingEdited: { oldColour: string; oldGroupName: string };
  setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>;
  setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  groupArray: GroupItemEntity[];
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
}

/**
 * A form for updating an existing budget category group.
 */
export default function GroupUpdatingForm({
  setBudgetArray,
  oldGroupBeingEdited,
  setGroupArray,
  groupArray,
  setBudgetFormVisibility,
}: GroupUpdatingFormProps) {
  const [formData, setFormData] = useState<BasicGroupData>({
    colour: oldGroupBeingEdited.oldColour,
    group: oldGroupBeingEdited.oldGroupName,
  });
  const formRef = useRef<HTMLDivElement>(null);

  interface GroupUpdatingMutationProps {
    originalGroupName: string;
    updatedGroupItem: GroupItemEntity;
  }

  const queryClient = useQueryClient();
  const email = useContext(EmailContext);
  const groupUpdatingMutation = useMutation({
    mutationFn: (groupUpdatingMutationProps: GroupUpdatingMutationProps) =>
      handleGroupUpdating(groupUpdatingMutationProps.originalGroupName, groupUpdatingMutationProps.updatedGroupItem),
    onMutate: async (groupUpdatingMutationProps: GroupUpdatingMutationProps) => {
      await queryClient.cancelQueries({ queryKey: ["groupArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["groupArray", email]);
      await queryClient.setQueryData(["groupArray", email], (prevGroupCache: GroupItemEntity[]) => {
        return prevGroupCache.map((groupItem) =>
          groupItem.group === groupUpdatingMutationProps.originalGroupName
            ? groupUpdatingMutationProps.updatedGroupItem
            : groupItem,
        );
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["groupArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["groupArray", email] });
    },
  });

  useEffect(() => {
    addColourSelectionFunctionality(setFormData);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function hideForm() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", false);
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      hideForm();
    }
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((currentFormData) => {
      return { ...currentFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    // await handleGroupUpdating(
    //   oldGroupBeingEdited.oldGroupName,
    //   formData
    // );
    // setGroupArray(await getGroupList());

    const updatedGroupItem: GroupItemEntity = { ...formData, colour: formData.colour!, timestamp: new Date() };

    groupUpdatingMutation.mutate({
      originalGroupName: oldGroupBeingEdited.oldGroupName,
      updatedGroupItem: updatedGroupItem,
    });

    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });
    getBudgetList().then((budgetList) => setBudgetArray(budgetList));
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

      <p className="mb-6 font-bold text-3xl">Updating Group {oldGroupBeingEdited.oldGroupName}</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-auto">
        <label htmlFor="groupName">Group Name</label>
        <input type="text" name="group" id="group" value={formData.group} onChange={handleInputChange} />

        <GroupColourSelector oldColour={oldGroupBeingEdited.oldColour} />

        <FulcrumButton displayText="Update Group" />
      </form>
    </div>
  );
}
