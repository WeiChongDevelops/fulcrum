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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components-v2/ui/sheet.tsx";
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
    setFormData({
      group: "",
      colour: "",
    });
  }, [formIsOpen]);

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
          className={`w-full h-12 mb-2 border-2 border-dashed border-black rounded-2xl hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-300 ease-out font-bold ${publicUserData.darkModeEnabled && "create-expense-button-dark"}`}
        >
          <p>+ Add Group</p>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Category Group</SheetTitle>
          <SheetDescription>Create a new group to organise your budget categories.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="group" className={"text-right"}>
              Name
            </Label>
            <Input
              type="text"
              onChange={handleInputChange}
              value={capitaliseFirstLetter(formData.group)}
              name="group"
              id="group"
              className="col-span-3"
              maxLength={22}
              autoComplete={"off"}
              required
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5 my-3"}>
            <Label htmlFor="group" className={"text-right"}>
              Colour
            </Label>
            <GroupColourSelector setFormData={setFormData} className={"col-span-3"} />
          </div>
          <Button className={"mt-2 self-end"}>Create Group</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
