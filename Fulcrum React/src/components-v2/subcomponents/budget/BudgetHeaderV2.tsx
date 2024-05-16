import { Button } from "@/components/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import MonthlyIncomeV2 from "@/components-v2/subcomponents/budget/MonthlyIncomeV2.tsx";

interface BudgetHeaderV2Props {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  publicUserData: PublicUserData;
  totalIncome: number;
}

export default function BudgetHeaderV2({ navMenuOpen, toggleNavMenu, publicUserData, totalIncome }: BudgetHeaderV2Props) {
  return (
    <div className={"fixed flex flex-row z-20 gap-4 justify-start items-center bg-gray-400 w-[calc(100vw-16rem)] h-[6vh]"}>
      {!navMenuOpen && <Button onClick={toggleNavMenu}>{">>"}</Button>}
      <MonthlyIncomeV2 publicUserData={publicUserData} className={"ml-8"} totalIncome={totalIncome} />
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Budget</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
