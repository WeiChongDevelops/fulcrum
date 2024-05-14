import { Button } from "@/components/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/child/toggles/DarkModeToggleV2.tsx";
import MonthlyIncomeV2 from "@/components-v2/child/budget/MonthlyIncomeV2.tsx";

interface BudgetHeaderV2Props {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  publicUserData: PublicUserData;
}

export default function BudgetHeaderV2({ navMenuOpen, toggleNavMenu, publicUserData }: BudgetHeaderV2Props) {
  return (
    <div className={"flex flex-row gap-4 justify-start items-center bg-green-500 w-full h-[6%]"}>
      {!navMenuOpen && <Button onClick={toggleNavMenu}>{">>"}</Button>}
      <MonthlyIncomeV2 publicUserData={publicUserData} className={"ml-8"} />
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Budget</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
