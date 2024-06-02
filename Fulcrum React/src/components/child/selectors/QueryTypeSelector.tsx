import { colourStyles, queryTypeOptions, recurringFrequencyOptions, useEmail } from "../../../utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContactFormData, RecurringExpenseFrequency, UserPreferences } from "../../../utility/types.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components-v2/ui/select.tsx";
import { cn } from "@/lib/utils.ts";
import { useQueryClient } from "@tanstack/react-query";

interface QueryTypeSelectorProps {
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
  className?: string;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function QueryTypeSelector({ formData, setFormData, className }: QueryTypeSelectorProps) {
  const [selectedQueryType, setSelectedQueryType] = useState<string>(null);

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      queryType: selectedQueryType,
    }));
  }, [selectedQueryType]);

  return (
    // <Select
    //   id="queryType"
    //   name="queryType"
    //   options={queryTypeOptions}
    //   onChange={handleInputChange}
    //   defaultValue={queryTypeOptions[2]}
    //   styles={colourStyles}
    //   className="mt-2"
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
    <Select
      required
      value={formData.queryType}
      onValueChange={(currentValue) => {
        setSelectedQueryType(currentValue);
      }}
    >
      <SelectTrigger className={cn("px-4 bg-white", className)}>
        <SelectValue placeholder={"Select query type..."} />
      </SelectTrigger>
      <SelectContent className={"bg-white"}>
        <SelectGroup>
          <SelectLabel>Query Type</SelectLabel>
          {queryTypeOptions.map((queryType) => (
            <SelectItem key={queryType.value} value={queryType.value} className={"flex flex-row w-full items-center"}>
              <span className={"text-left w-full"}>{queryType.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
