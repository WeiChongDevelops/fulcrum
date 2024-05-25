import { formatDollarAmountStatic, getCurrencySymbol, handleInputChangeOnFormWithAmount } from "@/utility/util.ts";
import { PublicUserData } from "@/utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useUpdateTotalIncome from "@/hooks/mutations/budget/useUpdateTotalIncome.ts";

interface MonthlyIncomeV2Props {
  publicUserData: PublicUserData;
  className?: string;
  totalIncome: number;
}

export default function MonthlyIncomeV2({ publicUserData, className, totalIncome }: MonthlyIncomeV2Props) {
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
        `flex flex-row justify-between items-center px-4 py-2 w-[35%] bg-emerald-600 rounded-xl text-sm ${className}`,
      )}
    >
      <span>{`Monthly Income: ${!!totalIncome ? formatDollarAmountStatic(totalIncome, publicUserData.currency) : "Loading..."}`}</span>
      <Sheet open={incomeFormIsVisible} onOpenChange={setIncomeFormIsVisible}>
        <SheetTrigger>Edit</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit Total Income</SheetTitle>
            <SheetDescription>Estimate your total monthly income.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            <div className={"grid grid-cols-4 items-center gap-5 relative"}>
              <Label htmlFor="amount" className={"text-right"}>
                Amount
              </Label>
              <b className="absolute inset-y-0 left-[7.5rem] flex items-center text-black text-sm">
                {getCurrencySymbol(publicUserData.currency)}
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
