import { UserPreferences, RecurringExpenseFrequency } from "@/utility/types.ts";
import useUpdateUserPreferences from "@/hooks/mutations/other/useUpdateUserPreferences.ts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, currencyOptions, getCurrencyCountryCode, recurringFrequencyOptions, useEmail } from "@/utility/util.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components-v2/ui/select.tsx";
import ReactCountryFlag from "react-country-flag";
import { useQueryClient } from "@tanstack/react-query";

interface CurrencySelectorV2Props {
  className?: string;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelectorV2({ className }: CurrencySelectorV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const { mutate: updateUserPreferences } = useUpdateUserPreferences();

  // const [open, setOpen] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(userPreferences.currency);

  useEffect(() => {
    setCurrencyValue(userPreferences.currency);
  }, [userPreferences]);

  const handleSelect = (currentValue: string) => {
    setCurrencyValue(currentValue === currencyValue ? "" : currentValue);
    // setOpen(false);
    const updatedUserPreferences: UserPreferences = { ...userPreferences, currency: currentValue };
    updateUserPreferences(updatedUserPreferences);
  };

  return (
    <Select value={currencyValue} onValueChange={handleSelect}>
      <SelectTrigger className={cn("px-4 flex flex-row items-center gap-1", className)}>
        <ReactCountryFlag
          countryCode={getCurrencyCountryCode(userPreferences.currency)}
          svg
          style={{
            width: "1em",
            height: "1em",
          }}
          title="US"
        />
        <SelectValue placeholder={"Select currency..."} />
      </SelectTrigger>
      <SelectContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        <SelectGroup>
          {currencyOptions.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              {currency.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
