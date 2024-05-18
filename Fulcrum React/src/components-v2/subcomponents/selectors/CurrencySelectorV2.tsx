import { PublicUserData } from "@/utility/types.ts";
import useUpdatePublicUserData from "@/hooks/mutations/other/useUpdatePublicUserData.ts";
import { cn } from "@/lib/utils.ts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components-v2/ui/command.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { currencyOptions } from "@/utility/util.ts";

interface CurrencySelectorV2Props {
  publicUserData: PublicUserData;
}

/**
 * A visual selector for the user to choose the application's currency. Does not perform conversion.
 */
export default function CurrencySelectorV2({ publicUserData }: CurrencySelectorV2Props) {
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();

  const [open, setOpen] = useState(false);
  const [currencyValue, setCurrencyValue] = useState(publicUserData.currency);

  const handleSelect = (currentValue: string) => {
    setCurrencyValue(currentValue === currencyValue ? "" : currentValue);
    setOpen(false);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, currency: currentValue };
    updatePublicUserData(updatedPublicUserData);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={"text-black font-bold"}>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {/*{currencyValue*/}
          {/*  ? currencyOptions.find((currency) => currency.label === currencyValue)?.label*/}
          {/*  : "Select currency..."}*/}
          {currencyValue
            ? currencyOptions.find((currencyOption) => currencyOption.value === currencyValue)?.label
            : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {currencyOptions.map((currency) => (
                <CommandItem key={currency.value} value={currency.value} onSelect={handleSelect}>
                  <Check className={cn("mr-2 h-4 w-4", currencyValue === currency.value ? "opacity-100" : "opacity-0")} />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
