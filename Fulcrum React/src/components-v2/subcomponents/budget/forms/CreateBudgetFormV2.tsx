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
import {
  addFormExitListeners,
  addIconSelectionFunctionality,
  capitaliseFirstLetter,
  changeFormOrModalVisibility,
  colourStyles,
  DEFAULT_CATEGORY_GROUP,
  DEFAULT_CATEGORY_ICON,
  getColourOfGroup,
  getHighestGroupSortIndex,
  getRandomGroupColour,
  groupListAsOptions,
  groupSort,
  handleInputChangeOnFormWithAmount,
  LocationContext,
} from "@/utility/util.ts";
import GroupColourSelector from "@/components/child/selectors/GroupColourSelector.tsx";
import FulcrumButton from "@/components/child/buttons/FulcrumButton.tsx";
import { BudgetCreationFormData, BudgetItemEntity, GroupItemEntity } from "@/utility/types.ts";
import CreatableSelect from "react-select/creatable";
import CategoryIconSelector from "@/components/child/selectors/CategoryIconSelector.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import useCreateBudget from "@/hooks/mutations/budget/useCreateBudget.ts";
import {
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
} from "@/components-v2/ui/select.tsx";

interface CreateBudgetFormV2Props {
  groupArray: GroupItemEntity[];
  groupNameOfNewItem: string;
  currencySymbol: string;
}

export default function CreateBudgetFormV2({ groupArray, groupNameOfNewItem, currencySymbol }: CreateBudgetFormV2Props) {
  const [formData, setFormData] = useState<BudgetCreationFormData>({
    category: "",
    amount: 0,
    iconPath: "",
    group: groupNameOfNewItem,
  });
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: createBudget } = useCreateBudget();
  const routerLocation = useContext(LocationContext);
  const [formIsOpen, setFormIsOpen] = useState(false);

  function hideForm() {
    // changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateBudgetVisible", false);
    setFormIsOpen(false);
  }

  useEffect(() => {
    const removeFormExitEventListeners = addFormExitListeners(hideForm, formRef);
    const removeIconEventListeners = addIconSelectionFunctionality(setFormData, "category");
    return () => {
      removeIconEventListeners();
      removeFormExitEventListeners();
    };
  }, [routerLocation]);

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
        id: getHighestGroupSortIndex(groupArray) + 1,
      };
    }

    createBudget({
      newBudgetItem: newBudgetItem,
      newGroupItem: defaultGroupItem,
    });
  }

  useEffect(() => {
    setFormData({
      category: "",
      amount: 0,
      iconPath: "",
      group: groupNameOfNewItem,
    });
  }, [formIsOpen]);

  function handleGroupInputChange(e: any) {
    setFormData((currentFormData: BudgetCreationFormData) => ({
      ...currentFormData,
      group: e.value,
    }));
  }

  const handleGroupSelectChange = (group: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, group: group }));
  };

  return (
    <Sheet open={formIsOpen} onOpenChange={setFormIsOpen}>
      <SheetTrigger>
        <Button
          asChild
          variant={"empty"}
          className="size-44 rounded-xl border-2 border-dashed border-black hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-200 ease-out"
        >
          <b>+</b>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Budget Item</SheetTitle>
          <SheetDescription>Create a new budgeting category.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="category" className={"text-right"}>
              Category
            </Label>
            <Input
              type="text"
              className={"col-span-3"}
              onChange={handleInputChange}
              value={capitaliseFirstLetter(formData.category)}
              name="category"
              id="category"
              maxLength={18}
              autoComplete={"off"}
              required
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5 relative"}>
            <Label htmlFor="amount" className={"text-right"}>
              Amount
            </Label>
            <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-black text-sm">{currencySymbol}</b>
            <Input
              type="text"
              className={"col-span-3 pl-8"}
              onChange={handleInputChange}
              value={formData.amount === 0 ? "" : formData.amount}
              name="amount"
              id="amount"
              autoComplete={"off"}
              required
            />
          </div>

          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="group" className={"text-right"}>
              Group
            </Label>
            <Select value={formData.group} onValueChange={handleGroupSelectChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {groupArray.sort(groupSort).map((groupItem, index) => (
                  <SelectItem value={groupItem.group} key={index}>
                    {groupItem.group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={"grid grid-cols-4 items-center gap-5"}>
            <Label htmlFor="iconPath" className={"text-right"}>
              Icon
            </Label>
            <CategoryIconSelector setFormData={setFormData} className={"col-span-3"} />
          </div>
          <Button className={"mt-2 self-end"}>Insert Budget</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
