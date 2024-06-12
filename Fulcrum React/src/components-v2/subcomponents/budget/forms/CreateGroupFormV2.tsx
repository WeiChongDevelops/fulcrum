import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { BasicGroupData, GroupItemEntity, UserPreferences } from "@/utility/types.ts";
import useCreateGroup from "@/hooks/mutations/budget/useCreateGroup.ts";
import { capitaliseFirstLetter, cn, getHighestGroupSortIndex, getRandomGroupColour, useEmail } from "@/utility/util.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import GroupColourSelector from "@/components-v2/subcomponents/selectors/GroupColourSelector.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface CreateGroupFormV2Props {
  setLocalisedGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
  className?: string;
}

export default function CreateGroupFormV2({ setLocalisedGroupArray, className }: CreateGroupFormV2Props) {
  const [formData, setFormData] = useState<BasicGroupData>({
    group: "",
    colour: "",
  });
  const { mutate: createGroup } = useCreateGroup();
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const groupArray: GroupItemEntity[] = useQueryClient().getQueryData(["groupArray", useEmail()])!;

  const [formIsOpen, setFormIsOpen] = useState(false);
  const [nextHighestSortIndex, setNextHighestSortIndex] = useState(999);

  useEffect(() => {
    !!groupArray && setNextHighestSortIndex(getHighestGroupSortIndex(groupArray) + 1);
  }, [groupArray]);

  function hideForm() {
    setFormIsOpen(false);
  }

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
      id: nextHighestSortIndex,
    };
    setLocalisedGroupArray((prevLocalisedGroupArray) => [...prevLocalisedGroupArray, newGroupItem]);

    createGroup(newGroupItem);

    setFormData({ group: "", colour: "" });
  }

  useEffect(() => {
    setFormData({
      group: "",
      colour: "",
    });
  }, [formIsOpen]);

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger>
        <Button
          asChild
          variant={"empty"}
          className={cn(
            `w-full h-12 mb-2 border-2 border-dashed border-primary rounded-xl hover:rounded-3xl hover:bg-zinc-100 transition-all duration-300 ease-out font-semibold ${userPreferences.darkModeEnabled && "create-expense-button-dark"}`,
            className,
          )}
        >
          <p>+ Add Group</p>
        </Button>
      </SheetTrigger>
      <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
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
          <Button className={"mt-2 self-end"} variant={userPreferences.darkModeEnabled ? "secondary" : "default"}>
            Add Group
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
