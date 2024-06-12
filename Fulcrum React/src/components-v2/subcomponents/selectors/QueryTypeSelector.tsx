import { cn, queryTypeOptions } from "@/utility/util.ts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ContactFormData } from "@/utility/types.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components-v2/ui/select.tsx";

interface QueryTypeSelectorProps {
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
  className?: string;
}

/**
 * A creatable selector for the user to select a category for an expense.
 */
export default function QueryTypeSelector({ formData, setFormData, className }: QueryTypeSelectorProps) {
  const [selectedQueryType, setSelectedQueryType] = useState<string | null>(null);

  useEffect(() => {
    setFormData((currentFormData: any) => ({
      ...currentFormData,
      queryType: selectedQueryType,
    }));
  }, [selectedQueryType]);

  return (
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
