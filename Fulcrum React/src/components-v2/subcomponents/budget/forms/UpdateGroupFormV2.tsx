import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { BasicGroupData, GroupItemEntity, PreviousGroupBeingEdited } from "@/utility/types.ts";
import useUpdateGroup from "@/hooks/mutations/budget/useUpdateGroup.ts";
import { addColourSelectionFunctionality, addFormExitListeners, LocationContext } from "@/utility/util.ts";
import { Input } from "@/components-v2/ui/input.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Button } from "@/components-v2/ui/button.tsx";

interface UpdateGroupFormV2Props {
  oldGroupBeingEdited: PreviousGroupBeingEdited;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  handleEditClick: (e: React.MouseEvent) => void;
}

export default function UpdateGroupFormV2({
  oldGroupBeingEdited,
  setLocalisedGroupArray,
  handleEditClick,
}: UpdateGroupFormV2Props) {
  const [formData, setFormData] = useState<BasicGroupData>({
    colour: oldGroupBeingEdited.oldColour,
    group: oldGroupBeingEdited.oldGroupName,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: updateGroup } = useUpdateGroup();
  const routerLocation = useContext(LocationContext);

  const [formIsOpen, setFormIsOpen] = useState(false);

  useEffect(() => {
    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });
  }, [oldGroupBeingEdited]);

  function hideForm() {
    // changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateGroupVisible", false);
    setFormIsOpen(false);
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

    console.log(`Sending update with colour: ${formData.colour}`);

    updateGroup({
      originalGroupName: oldGroupBeingEdited.oldGroupName,
      updatedGroupItem: updatedGroupItem,
    });

    setFormData({
      colour: oldGroupBeingEdited.oldColour,
      group: oldGroupBeingEdited.oldGroupName,
    });
  }

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger onClick={handleEditClick}>
        <Button
          asChild
          variant={"ghost"}
          onClick={handleEditClick}
          className={"standard-edit-delete-button flex-justify-center px-2.5 py-0 rounded-[50%]"}
        >
          <div className={"origin-center transition-all"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
            </svg>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Updating Category Group</SheetTitle>
          <SheetDescription></SheetDescription>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-auto">
            <Label htmlFor="group">Group Name</Label>
            <Input
              type="text"
              name="group"
              id="group"
              value={formData.group}
              onChange={handleInputChange}
              autoComplete={"off"}
            />

            <Label htmlFor="group" className={"mt-4"}>
              Colour
            </Label>
            <GroupColourSelector oldColour={oldGroupBeingEdited.oldColour} setFormData={setFormData} />

            <FulcrumButton displayText="Update Group" />
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
