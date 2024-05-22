import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
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

  function handleGroupInputChange(e: any) {
    setFormData((currentFormData: BudgetCreationFormData) => ({
      ...currentFormData,
      group: e.value,
    }));
  }
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
          <SheetDescription></SheetDescription>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
              <b className="absolute inset-y-0 left-[6.4rem] flex items-center text-black">{currencySymbol}</b>
              <Input
                type="text"
                className={"col-span-3"}
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
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={"grid grid-cols-4 items-center gap-5"}>
              <Label htmlFor="group" className={"text-right"}>
                Icon
              </Label>
              <CategoryIconSelector className={"col-span-3"} />
              <input type="hidden" id="iconPath" name="iconPath" value="test" />
            </div>
            <Button>Insert Budget</Button>
          </form>
          {/*<form onSubmit={handleSubmit} className="flex flex-col gap-2 justify-start items-end mb-auto ">*/}
          {/*  <div className={"flex flex-row items-center gap-6"}>*/}
          {/*    <Label htmlFor="category">Category</Label>*/}
          {/*    <Input*/}
          {/*      type="text"*/}
          {/*      onChange={handleInputChange}*/}
          {/*      value={capitaliseFirstLetter(formData.category)}*/}
          {/*      name="category"*/}
          {/*      id="category"*/}
          {/*      maxLength={18}*/}
          {/*      autoComplete={"off"}*/}
          {/*      required*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*  <div className={"flex flex-row items-center gap-6 relative "}>*/}
          {/*    <Label htmlFor="amount">Amount</Label>*/}
          {/*    <b className="absolute left-[5.5rem] text-black">{currencySymbol}</b>*/}
          {/*    <Input*/}
          {/*      type="text"*/}
          {/*      onChange={handleInputChange}*/}
          {/*      value={formData.amount === 0 ? "" : formData.amount}*/}
          {/*      name="amount"*/}
          {/*      id="amount"*/}
          {/*      className="text-center"*/}
          {/*      autoComplete={"off"}*/}
          {/*      required*/}
          {/*    />*/}
          {/*  </div>*/}

          {/*  <div className={"flex flex-row items-center gap-6 relative "}>*/}
          {/*    <Label htmlFor="group">Group</Label>*/}
          {/*    <Select>*/}
          {/*      <SelectTrigger className="w-[13.75rem]">*/}
          {/*        <SelectValue placeholder="Theme" />*/}
          {/*      </SelectTrigger>*/}
          {/*      <SelectContent>*/}
          {/*        <SelectItem value="light">Light</SelectItem>*/}
          {/*        <SelectItem value="dark">Dark</SelectItem>*/}
          {/*        <SelectItem value="system">System</SelectItem>*/}
          {/*      </SelectContent>*/}
          {/*    </Select>*/}
          {/*  </div>*/}

          {/*  <CategoryIconSelector />*/}
          {/*  <input type="hidden" id="iconPath" name="iconPath" value="test" />*/}
          {/*  <FulcrumButton displayText="Insert Budget" />*/}
          {/*</form>*/}
        </SheetHeader>
      </SheetContent>

      {/*<CreatableSelect*/}
      {/*  className={"shadow rounded-md "}*/}
      {/*  id="group"*/}
      {/*  name="group"*/}
      {/*  defaultValue={{*/}
      {/*    label: groupNameOfNewItem,*/}
      {/*    value: groupNameOfNewItem,*/}
      {/*    colour: getColourOfGroup(groupNameOfNewItem, groupArray),*/}
      {/*  }}*/}
      {/*  options={groupListAsOptions(groupArray).map((option) => {*/}
      {/*    return {*/}
      {/*      label: option.label,*/}
      {/*      value: option.value,*/}
      {/*      colour: option.colour!!,*/}
      {/*    };*/}
      {/*  })}*/}
      {/*  onChange={handleGroupInputChange}*/}
      {/*  styles={colourStyles}*/}
      {/*  theme={(theme) => ({*/}
      {/*    ...theme,*/}
      {/*    borderRadius: 0,*/}
      {/*    colors: {*/}
      {/*      ...theme.colors,*/}
      {/*      primary25: "rgba(201,223,201,0.1)",*/}
      {/*      primary: "rgba(34,237,34,0.18)",*/}
      {/*    },*/}
      {/*  })}*/}
      {/*/>*/}
    </Sheet>
  );
}
