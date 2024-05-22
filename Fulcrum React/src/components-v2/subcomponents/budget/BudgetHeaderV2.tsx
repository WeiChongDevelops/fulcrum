import { Button } from "@/components-v2/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import MonthlyIncomeV2 from "@/components-v2/subcomponents/budget/MonthlyIncomeV2.tsx";

interface BudgetHeaderV2Props {
  publicUserData: PublicUserData;
  totalIncome: number;
  navMenuOpen: boolean;
}

export default function BudgetHeaderV2({ publicUserData, totalIncome, navMenuOpen }: BudgetHeaderV2Props) {
  return (
    <div
      className={`fixed flex flex-row z-40 gap-4 justify-start items-center self-end bg-gray-400 ${navMenuOpen ? "w-[calc(100vw-14rem)]" : "w-[calc(100vw-5rem)]"} h-[6vh]`}
    >
      <MonthlyIncomeV2 publicUserData={publicUserData} className={"ml-10"} totalIncome={totalIncome} />
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Budget</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
