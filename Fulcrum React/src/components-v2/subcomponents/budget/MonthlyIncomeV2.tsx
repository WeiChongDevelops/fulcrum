import { formatDollarAmountStatic, getCurrencySymbol, handleInputChangeOnFormWithAmount } from "@/utility/util.ts";
import { UserPreferences } from "@/utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useUpdateTotalIncome from "@/hooks/mutations/budget/useUpdateTotalIncome.ts";
import * as React from "react";

interface MonthlyIncomeV2Props {
  userPreferences: UserPreferences;
  className?: string;
  totalIncome: number;
}

export default function MonthlyIncomeV2({ userPreferences, className, totalIncome }: MonthlyIncomeV2Props) {
  const [formData, setFormData] = useState({ amount: totalIncome });
  const [incomeFormIsVisible, setIncomeFormIsVisible] = useState(false);

  const { mutate: updateTotalIncome } = useUpdateTotalIncome();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateTotalIncome(formData.amount);
    setIncomeFormIsVisible(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChangeOnFormWithAmount(e, setFormData);
  };

  useEffect(() => {
    setFormData({ amount: totalIncome });
  }, [incomeFormIsVisible]);

  return (
    <div
      className={cn(
        `flex flex-row justify-between items-center px-4 py-1 w-[35%] bg-[#1e3836] text-white rounded-xl text-xs ${className}`,
      )}
    >
      <span className={"font-light"}>Monthly Income: </span>
      <span className={"font-bold ml-1 mr-auto"}>
        {!!totalIncome ? formatDollarAmountStatic(totalIncome, userPreferences.currency) : ""}
      </span>
      <Sheet open={incomeFormIsVisible} onOpenChange={setIncomeFormIsVisible}>
        <SheetTrigger className={"standard-edit-delete-button"}>
          <Button
            asChild
            variant={"ghost"}
            size={"xs"}
            className={"standard-edit-delete-button flex-justify-center py-3 px-1.5 rounded-[50%] transition-all"}
          >
            <div className={"edit-delete-button-icon-container origin-center transition-all"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-3 transition-all duration-200 ease-out"
              >
                <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
              </svg>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit Monthly Income</SheetTitle>
            <SheetDescription>Estimate your total monthly income.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            <div className={"grid grid-cols-4 items-center gap-5 relative"}>
              <Label htmlFor="amount" className={"text-right"}>
                Amount
              </Label>
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-black text-sm">
                {getCurrencySymbol(userPreferences.currency)}
              </b>
              <Input
                type="text"
                className={"col-span-3 pl-8"}
                onChange={handleChange}
                value={formData.amount === 0 ? "" : formData.amount}
                name="amount"
                id="amount"
                autoComplete={"off"}
                required
              />
            </div>

            <Button className={"mt-2 self-end"}>Save Changes</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
