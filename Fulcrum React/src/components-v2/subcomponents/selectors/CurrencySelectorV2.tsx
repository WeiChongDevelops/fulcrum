import { PublicUserData, RecurringExpenseFrequency } from "@/utility/types.ts";
import useUpdatePublicUserData from "@/hooks/mutations/other/useUpdatePublicUserData.ts";
import { cn } from "@/lib/utils.ts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { currencyOptions, getCurrencyCountryCode, recurringFrequencyOptions } from "@/utility/util.ts";
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

interface CurrencySelectorV2Props {
  publicUserData: PublicUserData;
  className?: string;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelectorV2({ publicUserData, className }: CurrencySelectorV2Props) {
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();

  // const [open, setOpen] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(publicUserData.currency);

  useEffect(() => {
    setCurrencyValue(publicUserData.currency);
  }, [publicUserData]);

  const handleSelect = (currentValue: string) => {
    setCurrencyValue(currentValue === currencyValue ? "" : currentValue);
    // setOpen(false);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, currency: currentValue };
    updatePublicUserData(updatedPublicUserData);
  };

  return (
    <Select value={currencyValue} onValueChange={handleSelect}>
      <SelectTrigger className={cn("px-4 flex flex-row items-center gap-1", className)}>
        <ReactCountryFlag
          countryCode={getCurrencyCountryCode(publicUserData.currency)}
          svg
          style={{
            width: "1em",
            height: "1em",
          }}
          title="US"
        />
        <SelectValue placeholder={"Select currency..."} />
      </SelectTrigger>
      <SelectContent>
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
