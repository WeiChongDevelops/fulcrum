import { formatDollarAmountStatic } from "@/utility/util.ts";
import { PublicUserData } from "@/utility/types.ts";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

interface MonthlyIncomeV2Props {
  totalIncome: number;
  publicUserData: PublicUserData;
  className?: string;
}

export default function MonthlyIncomeV2({ totalIncome, publicUserData, className }: MonthlyIncomeV2Props) {
  return (
    <div
      className={cn(`flex flex-row justify-between items-center p-5 w-[35%] h-[85%] bg-pink-500 rounded-xl ${className}`)}
    >
      <span>{`Monthly Income: $10,000,000.00`}</span>
      <Sheet>
        <SheetTrigger>Edit</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <h1>One</h1>
          <Label htmlFor="two">Two</Label>
          <Input id="two" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
