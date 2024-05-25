import { Button } from "@/components-v2/ui/button.tsx";
import { PublicUserData } from "@/utility/types.ts";
import DarkModeToggleV2 from "@/components-v2/subcomponents/toggles/DarkModeToggleV2.tsx";
import MonthlyIncomeV2 from "@/components-v2/subcomponents/budget/MonthlyIncomeV2.tsx";

interface BudgetHeaderV2Props {
  publicUserData: PublicUserData;
  totalIncome: number;
  sideBarOpen: boolean;
}

export default function BudgetHeaderV2({ publicUserData, totalIncome, sideBarOpen }: BudgetHeaderV2Props) {
  return (
    <div
      className={`fixed flex flex-row z-40 gap-4 justify-start items-center self-end bg-gray-400 ${sideBarOpen ? "w-[calc(100vw-14rem)]" : "w-[calc(100vw-5rem)]"} h-[6vh]`}
    >
      <MonthlyIncomeV2 publicUserData={publicUserData} className={"ml-10"} totalIncome={totalIncome} />
      <div className={"flex flex-row justify-center items-center gap-3 ml-auto mr-2"}>
        <p className={"mr-3 font-medium text-base"}>Budget</p>
        <DarkModeToggleV2 publicUserData={publicUserData} />
        <Button variant={"ghost"} className={"p-2 mr-2"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
