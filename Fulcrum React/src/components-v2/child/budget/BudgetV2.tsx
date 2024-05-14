import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/child/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/child/budget/FulcrumAnimationV2.tsx";

interface BudgetV2Props {
  publicUserData: PublicUserData;
  budgetArray: BudgetItemEntity[];
  expenseArray: ExpenseItemEntity[];
  groupArray: GroupItemEntity[];
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

export default function BudgetV2({
  publicUserData,
  budgetArray,
  expenseArray,
  groupArray,
  navMenuOpen,
  toggleNavMenu,
}: BudgetV2Props) {
  return (
    <div className="flex flex-col justify-start items-center w-[82vw] h-screen gap-8">
      {/*<div className="flex flex-row justify-between w-full">*/}
      {/*  <div className="w-96 h-20 bg-red-500"></div>*/}
      {/*  <div className="w-64 h-20 bg-green-500"></div>*/}
      {/*</div>*/}
      <BudgetHeaderV2 navMenuOpen={navMenuOpen} toggleNavMenu={toggleNavMenu} publicUserData={publicUserData} />
      <div className="flex flex-row w-full gap-8">
        {/*<div className="w-[65%] h-96 bg-blue-500"></div>*/}
        <FulcrumAnimationV2 totalIncome={10_000} budgetTotal={8_000} />
        <div className="flex-grow bg-yellow-500 flex justify-center items-center font-bold text-2xl">New Graph</div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="h-28 w-full bg-indigo-500"></div>
        <div className="h-28 w-full bg-purple-500"></div>
        <div className="h-28 w-full bg-pink-500"></div>
      </div>
    </div>
  );
}
