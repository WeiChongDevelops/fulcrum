import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components-v2/ui/button";
import { Calendar } from "@/components-v2/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components-v2/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components-v2/ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ExpenseCreationFormData,
  ExpenseUpdatingFormData,
  UserPreferences,
  RecurringExpenseInstanceUpdatingFormData,
  RecurringExpenseUpdatingFormData,
} from "@/utility/types.ts";
import { expenseStartDate, useEmail } from "@/utility/util.ts";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseDatePickerProps {
  setFormData:
    | Dispatch<SetStateAction<RecurringExpenseInstanceUpdatingFormData>>
    | Dispatch<SetStateAction<RecurringExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseUpdatingFormData>>
    | Dispatch<SetStateAction<ExpenseCreationFormData>>;
  className?: string;
  defaultDate?: Date;
}

export default function ExpenseDatePicker({ setFormData, className, defaultDate = new Date() }: ExpenseDatePickerProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const [date, setDate] = useState<Date>(defaultDate);

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      timestamp: date,
    }));
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild className={cn("bg-background text-primary", userPreferences.darkModeEnabled && "dark")}>
        <Button
          variant={"outline"}
          className={cn(" justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("flex w-auto flex-col space-y-2 p-2 dark", userPreferences.darkModeEnabled && "dark")}
      >
        <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper" className={cn(userPreferences.darkModeEnabled && "dark")}>
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate as Dispatch<SetStateAction<Date | undefined>>}
            fromDate={expenseStartDate}
            toDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
