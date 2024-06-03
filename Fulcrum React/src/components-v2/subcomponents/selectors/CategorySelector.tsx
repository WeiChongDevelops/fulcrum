import { categoryOptionSort, cn, colourStyles, groupSort, useEmail } from "../../../utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  PreviousRecurringExpenseBeingEdited,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
  DropdownSelectorOption,
  UserPreferences,
} from "../../../utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

interface CategorySelectorProps {
  categoryOptions: DropdownSelectorOption[];
  oldExpenseBeingEdited?: PreviousExpenseBeingEdited | PreviousRecurringExpenseBeingEdited;
  setFormData:
    | Dispatch<SetStateAction<RecurringExpenseInstanceUpdatingFormData>>
    | Dispatch<SetStateAction<RecurringExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseCreationFormData>>;
  className?: string;
  defaultCategory?: string;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function CategorySelector({
  categoryOptions,
  oldExpenseBeingEdited,
  setFormData,
  className,
  defaultCategory,
}: CategorySelectorProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory ?? "");

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      category: selectedCategory,
    }));
  }, [selectedCategory]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn("dark:text-primary", userPreferences.darkModeEnabled && "dark")}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", className)}
        >
          {selectedCategory
            ? categoryOptions.find((categoryOption) => categoryOption.value === selectedCategory)?.label
            : "Select category..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 dark:text-primary", userPreferences.darkModeEnabled && "dark")}>
        <Command>
          <CommandInput placeholder="Search category..." className="h-9 font-normal" required />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryOptions.sort(categoryOptionSort).map((categoryOption) => (
                <CommandItem
                  key={categoryOption.value}
                  value={categoryOption.value}
                  onSelect={(currentValue) => {
                    setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div
                    className={"mx-3 size-1.5 rounded-[50%] saturate-[650%] brightness-[90%]"}
                    style={{ backgroundColor: categoryOption.colour ?? "black" }}
                  ></div>
                  <span className={"mr-auto text-left"}>{categoryOption.label}</span>
                  <CheckIcon
                    className={cn("ml-r h-4 w-4", selectedCategory === categoryOption.value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    // <Popover open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger asChild>
    //     <Button variant="outline" role="combobox" aria-expanded={open} className={cn(" justify-between", className)}>
    //       {selectedCategory
    //         ? categoryOptions.find((categoryOption) => categoryOption.value === selectedCategory)?.label
    //         : "Select category..."}
    //       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className={"p-0"}>
    //     <Command value={selectedCategory}>
    //       <CommandInput placeholder="Search category..." maxLength={18} className={"h-9"} />
    //       <CommandEmpty>No category found.</CommandEmpty>
    //       <CommandGroup>
    //         <CommandList>
    //           <ScrollArea className={"h-56 pr-5"}>
    //             <ScrollBar forceMount />
    //             {categoryOptions.map((categoryOption) => (
    //               <CommandItem
    //                 key={categoryOption.value}
    //                 value={categoryOption.value}
    //                 onSelect={(currentValue) => {
    //                   setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
    //                   setOpen(false);
    //                 }}
    //                 className={"flex flex-row items-center"}
    //               >
    //                 <Check
    //                   className={cn("mr-2 h-4 w-4", selectedCategory === categoryOption.value ? "opacity-100" : "opacity-0")}
    //                 />
    //                 <span className={"text-left mr-auto"}>{categoryOption.label}</span>
    //                 <div
    //                   className={"size-1.5 rounded-[50%] brightness-90 saturate-200"}
    //                   style={{ backgroundColor: categoryOption.colour }}
    //                 ></div>
    //               </CommandItem>
    //             ))}
    //           </ScrollArea>
    //         </CommandList>
    //       </CommandGroup>
    //     </Command>
    //   </PopoverContent>
    // </Popover>
    // <CreatableSelect
    //   id="category"
    //   name="category"
    //   defaultValue={
    //     oldExpenseBeingEdited && {
    //       label: oldExpenseBeingEdited.oldCategory,
    //       value: oldExpenseBeingEdited.oldCategory,
    //       colour: categoryOptions.filter((categoryOption) => categoryOption.label === oldExpenseBeingEdited.oldCategory)[0]
    //         .colour,
    //     }
    //   }
    //   options={categoryOptions.map((option) => {
    //     return {
    //       label: option.label,
    //       value: option.value,
    //       colour: option.colour!!,
    //     };
    //   })}
    //   components={{ Input: maxLengthInput }}
    //   onChange={handleCategoryInputChange}
    //   placeholder={"Type to search or create... "}
    //   styles={colourStyles}
    //   className="mb-3"
    //   theme={(theme: any) => ({
    //     ...theme,
    //     borderRadius: 0,
    //     colors: {
    //       ...theme.colors,
    //       primary25: "rgba(201,223,201,0.1)",
    //       primary: "rgba(34,237,34,0.18)",
    //     },
    //   })}
    //   required
    // />
  );
}
