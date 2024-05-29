import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components-v2/ui/select.tsx";
import { groupSort, useEmail } from "@/utility/util.ts";
import { BudgetCreationFormData, BudgetUpdatingFormData, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils.ts";

interface GroupSelectorProps {
  formData: BudgetCreationFormData | BudgetUpdatingFormData;
  setFormData: Dispatch<SetStateAction<BudgetCreationFormData>> | Dispatch<SetStateAction<BudgetUpdatingFormData>>;
  groupArray: GroupItemEntity[];
}

export default function GroupSelector({ formData, setFormData, groupArray }: GroupSelectorProps) {
  const publicUserData: PublicUserData = useQueryClient().getQueryData(["publicUserData", useEmail()])!;
  const handleGroupSelectChange = (group: string) => {
    setFormData((prevFormData: any) => ({ ...prevFormData, group: group }));
  };
  return (
    <Select value={formData.group} onValueChange={handleGroupSelectChange}>
      <SelectTrigger className={cn("col-span-3 dark:text-primary", publicUserData.darkModeEnabled && "dark")}>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent className={cn(publicUserData.darkModeEnabled && "dark")}>
        {groupArray.sort(groupSort).map((groupItem, index) => (
          <SelectItem value={groupItem.group} key={index}>
            {groupItem.group}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
