import {
  cn,
  formatDollarAmountStatic,
  getCurrencySymbol,
  handleInputChangeOnFormWithAmount,
  useEmail,
} from "@/utility/util.ts";
import { UserPreferences } from "@/utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import UpdateTotalIncomeFormV2 from "@/components-v2/subcomponents/budget/forms/UpdateTotalIncomeFormV2.tsx";

interface MonthlyIncomeV2Props {
  className?: string;
  totalIncome: number;
}

export default function MonthlyIncomeV2({ className, totalIncome }: MonthlyIncomeV2Props) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  return (
    <div
      className={cn(
        `flex flex-row justify-between items-center px-4 py-1 w-[35%] bg-[#002E38] text-white rounded-xl text-xs ${className}`,
      )}
    >
      <span className={"font-light"}>Monthly Income: </span>
      <span className={"font-bold ml-1 mr-auto"}>
        {!!totalIncome ? formatDollarAmountStatic(totalIncome, userPreferences.currency) : ""}
      </span>
      <UpdateTotalIncomeFormV2 totalIncome={totalIncome} />
    </div>
  );
}
