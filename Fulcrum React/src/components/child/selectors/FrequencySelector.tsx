import { colourStyles, recurringFrequencyOptions, useEmail } from "../../../utility/util.ts";
import CreatableSelect from "react-select/creatable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { components } from "react-select";
import { InputProps } from "react-select";
import {
  DropdownSelectorOption,
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  PreviousExpenseBeingEdited,
  PreviousRecurringExpenseBeingEdited,
  UserPreferences,
  RecurringExpenseFrequency,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
} from "../../../utility/types.ts";
import { cn } from "@/lib/utils";
import { Button } from "@/components-v2/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components-v2/ui/select.tsx";
import { useQueryClient } from "@tanstack/react-query";

interface FrequencySelectorProps {
  setFormData:
    | Dispatch<SetStateAction<RecurringExpenseInstanceUpdatingFormData>>
    | Dispatch<SetStateAction<RecurringExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseCreationFormData>>;
  mustBeRecurring: boolean;
  className?: string;
  initialFrequency?: RecurringExpenseFrequency;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function FrequencySelector({
  setFormData,
  className,
  mustBeRecurring,
  initialFrequency,
}: FrequencySelectorProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [open, setOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(
    initialFrequency ? initialFrequency : mustBeRecurring ? "monthly" : "never",
  );

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      frequency: selectedFrequency,
    }));
  }, [selectedFrequency]);

  return (
    // <Popover open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger asChild>
    //     <Button variant="outline" role="combobox" aria-expanded={open} className={cn("justify-between", className)}>
    //       {selectedFrequency
    //         ? recurringFrequencyOptions.find((frequencyOption) => frequencyOption.value === selectedFrequency)?.label
    //         : "Select frequency..."}
    //       <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="p-0">
    //     <Command>
    //       <CommandInput placeholder="Search frequency..." maxLength={18} />
    //       <CommandEmpty>No framework found.</CommandEmpty>
    //       <CommandGroup>
    //         <CommandList>
    //           {(mustBeRecurring ? recurringFrequencyOptions.slice(1) : recurringFrequencyOptions).map((frequencyOption) => (
    //             <CommandItem
    //               key={frequencyOption.value}
    //               value={frequencyOption.value}
    //               onSelect={(currentValue) => {
    //                 setSelectedFrequency(currentValue as RecurringExpenseFrequency);
    //                 setOpen(false);
    //               }}
    //               className={"flex flex-row items-center"}
    //             >
    //               <span className={"ml-2 mr-auto text-left"}>{frequencyOption.label}</span>
    //               <CheckIcon
    //                 className={cn("ml-r h-4 w-4", selectedFrequency === frequencyOption.value ? "opacity-100" : "opacity-0")}
    //               />
    //             </CommandItem>
    //           ))}
    //         </CommandList>
    //       </CommandGroup>
    //     </Command>
    //   </PopoverContent>
    // </Popover>
    <Select
      required
      value={selectedFrequency}
      onValueChange={(currentValue) => {
        setSelectedFrequency(currentValue as RecurringExpenseFrequency);
      }}
    >
      <SelectTrigger className={cn("px-4 dark:text-primary", userPreferences.darkModeEnabled && "dark", className)}>
        <SelectValue placeholder={"Select frequency..."} />
      </SelectTrigger>
      <SelectContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        <SelectGroup>
          <SelectLabel>Repeat Frequency</SelectLabel>
          {(mustBeRecurring ? recurringFrequencyOptions.slice(1) : recurringFrequencyOptions).map((frequencyOption) => (
            <SelectItem
              key={frequencyOption.value}
              value={frequencyOption.value}
              className={"flex flex-row w-full items-center"}
            >
              <span className={"text-left w-full"}>{frequencyOption.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
