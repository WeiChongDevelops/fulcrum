import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { BasicGroupData, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import useCreateGroup from "@/hooks/mutations/budget/useCreateGroup.ts";
import {
  addColourSelectionFunctionality,
  addFormExitListeners,
  capitaliseFirstLetter,
  getRandomGroupColour,
  LocationContext,
} from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import AddNewGroupButton from "@/components/child/budget/buttons/AddNewGroupButton.tsx";

interface CreateGroupFormV2Props {
  highestSortIndex: number;
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  publicUserData: PublicUserData;
}

export default function CreateGroupFormV2({
  highestSortIndex,
  setLocalisedGroupArray,
  publicUserData,
}: CreateGroupFormV2Props) {
  const [formData, setFormData] = useState<BasicGroupData>({
    group: "",
    colour: "",
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: createGroup } = useCreateGroup();
  const routerLocation = useContext(LocationContext);

  const [formIsOpen, setFormIsOpen] = useState(false);

  function hideForm() {
    // changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateGroupVisible", false);
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
    setFormData((oldFormData) => {
      return { ...oldFormData, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    hideForm();

    const newGroupItem: GroupItemEntity = {
      group: formData.group,
      colour: formData.colour ? formData.colour : getRandomGroupColour(),
      timestamp: new Date(),
      id: highestSortIndex + 1,
    };
    setLocalisedGroupArray((prevLocalisedGroupArray) => [...prevLocalisedGroupArray, newGroupItem]);

    createGroup(newGroupItem);

    setFormData({ group: "", colour: "" });
  }

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger>
        <Button
          asChild
          variant={"empty"}
          className={`w-full h-16 mb-2 border-2 border-dashed border-black rounded-2xl hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-300 ease-out text-2xl font-bold ${publicUserData.darkModeEnabled && "create-expense-button-dark"}`}
        >
          <p>+</p>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Category Group</SheetTitle>
          <SheetDescription></SheetDescription>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mb-auto">
            <Label htmlFor="group">Group Name</Label>
            <Input
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

            <Label htmlFor="group" className={"mt-4"}>
              Colour
            </Label>
            <GroupColourSelector oldColour={""} setFormData={setFormData} />

            <FulcrumButton displayText="Create Group" />
          </form>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
