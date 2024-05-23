import { colourStyles, recurringFrequencyOptions } from "../../../utility/util.ts";
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
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
  SelectorOptionsFormattedData,
} from "../../../utility/types.ts";
import { cn } from "@/lib/utils";
import { Button } from "@/components-v2/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area.tsx";
import Select from "react-select/creatable";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

interface FrequencySelectorProps {
  setFormData:
    | Dispatch<SetStateAction<RecurringExpenseInstanceUpdatingFormData>>
    | Dispatch<SetStateAction<RecurringExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseCreationFormData>>;
  className?: string;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function FrequencySelector({ setFormData, className }: FrequencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("never");

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      frequency: selectedFrequency,
    }));
  }, [selectedFrequency]);

  return (
    // <Select
    //   id="frequency"
    //   name="frequency"
    //   defaultValue={{
    //     label: mustBeRecurring ? "Monthly" : "Never",
    //     value: mustBeRecurring ? "monthly" : "never",
    //     colour: "black",
    //   }}
    //   options={mustBeRecurring ? recurringFrequencyOptions.slice(1) : recurringFrequencyOptions}
    //   onChange={handleFrequencyInputChange}
    //   styles={colourStyles}
    //   className="mb-3"
    //   theme={(theme) => ({
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
    // <Popover modal={false} open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger asChild>
    //     <Button variant="outline" role="combobox" aria-expanded={open} className={cn("justify-between", className)}>
    //       {selectedFrequency
    //         ? recurringFrequencyOptions.find((frequencyOption) => frequencyOption.value === selectedFrequency)?.label
    //         : "Select frequency..."}
    //       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent>
    //     <Command value={selectedFrequency}>
    //       <CommandInput placeholder="Search frequency..." maxLength={18} />
    //       <CommandEmpty>No framework found.</CommandEmpty>
    //       <CommandGroup>
    //         <CommandList>
    //           {recurringFrequencyOptions.map((frequencyOption) => (
    //             <CommandItem
    //               key={frequencyOption.value}
    //               value={frequencyOption.value}
    //               onSelect={(currentValue) => {
    //                 setSelectedFrequency(currentValue === selectedFrequency ? "" : currentValue);
    //                 setOpen(false);
    //               }}
    //               className={"flex flex-row items-center"}
    //             >
    //               <Check
    //                 className={cn("mr-2 h-4 w-4", selectedFrequency === frequencyOption.value ? "opacity-100" : "opacity-0")}
    //               />
    //               <span className={"text-left mr-auto"}>{frequencyOption.label}</span>
    //               <div className={"size-1.5 rounded-[50%] brightness-90 saturate-200 bg-black"}></div>
    //             </CommandItem>
    //           ))}
    //         </CommandList>
    //       </CommandGroup>
    //     </Command>
    //   </PopoverContent>
    // </Popover>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("justify-between", className)}>
          {selectedFrequency
            ? recurringFrequencyOptions.find((frequencyOption) => frequencyOption.value === selectedFrequency)?.label
            : "Select frequency..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search frequency..." maxLength={18} />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {recurringFrequencyOptions.map((frequencyOption) => (
                <CommandItem
                  key={frequencyOption.value}
                  value={frequencyOption.value}
                  onSelect={(currentValue) => {
                    setSelectedFrequency(currentValue === selectedFrequency ? "" : currentValue);
                    setOpen(false);
                  }}
                  className={"flex flex-row items-center"}
                >
                  <div
                    className={"mx-3 size-1.5 rounded-[50%] brightness-90 saturate-200"}
                    style={{ backgroundColor: frequencyOption.colour }}
                  ></div>
                  <span className={"mr-auto text-left"}>{frequencyOption.label}</span>
                  <CheckIcon
                    className={cn("ml-r h-4 w-4", selectedFrequency === frequencyOption.value ? "opacity-100" : "opacity-0")}
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
