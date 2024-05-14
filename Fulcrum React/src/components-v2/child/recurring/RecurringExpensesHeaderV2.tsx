import { Button } from "@/components/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/child/toggles/DarkModeToggleV2.tsx";

interface RecurringExpensesHeaderV2 {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  publicUserData: PublicUserData;
}

export default function RecurringExpensesHeaderV2({
  navMenuOpen,
  toggleNavMenu,
  publicUserData,
}: RecurringExpensesHeaderV2) {
  return (
    <div className={"flex flex-row gap-4 justify-start items-center bg-pink-500 w-full h-[6%]"}>
      {!navMenuOpen && <Button onClick={toggleNavMenu}>{">>"}</Button>}
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Recurring Expenses</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
