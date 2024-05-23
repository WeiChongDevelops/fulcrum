import { Button } from "@/components-v2/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";

interface RecurringHeaderV2 {
  navMenuOpen: boolean;
  publicUserData: PublicUserData;
}

export default function RecurringExpensesHeaderV2({ navMenuOpen, publicUserData }: RecurringHeaderV2) {
  return (
    <div
      className={`flex flex-row gap-4 justify-start items-center bg-gray-400 w-full ${navMenuOpen ? "w-[calc(100vw-14rem)]" : "w-[calc(100vw-5rem)]"} h-[6%]`}
    >
      <div className={"flex flex-row justify-center items-center gap-4 ml-auto mr-2"}>
        <p className={"mx-8 font-bold text-xl"}>Recurring Expenses</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button>Help</Button>
      </div>
    </div>
  );
}
