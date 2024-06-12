import { categoryOptionSort, cn, useEmail } from "@/utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
  DropdownSelectorOption,
  UserPreferences,
} from "@/utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover.tsx";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";

interface CategorySelectorProps {
  categoryOptions: DropdownSelectorOption[];
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
  );
}
