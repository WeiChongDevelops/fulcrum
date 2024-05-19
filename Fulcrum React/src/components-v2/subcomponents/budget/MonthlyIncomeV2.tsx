import { formatDollarAmountStatic, handleInputChangeOnFormWithAmount } from "@/utility/util.ts";
import { PublicUserData } from "@/utility/types.ts";
import { Button } from "@/components-v2/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { ChangeEvent, FormEvent, useState } from "react";
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
          <form onSubmit={handleSubmit}>
            <div className={"flex flex-row justify-center items-center gap-2 my-4"}>
              <Label htmlFor="amount">Income</Label>
              <Input onChange={handleChange} type={"number"} name={"amount"} value={formData.amount} id="amount" />
            </div>
            <Button>Save</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
