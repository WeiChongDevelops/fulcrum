import { cn, recurringFrequencyOptions, useEmail } from "@/utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  UserPreferences,
  RecurringExpenseFrequency,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
} from "@/utility/types.ts";
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
