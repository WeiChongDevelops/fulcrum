import { BudgetItemEntity, ExpenseItemEntity, GroupItemEntity, PublicUserData } from "@/utility/types.ts";
import BudgetHeaderV2 from "@/components-v2/subcomponents/budget/BudgetHeaderV2.tsx";
import FulcrumAnimationV2 from "@/components-v2/subcomponents/budget/FulcrumAnimationV2.tsx";
import useInitialBudgetData from "@/hooks/queries/useInitialBudgetData.ts";
import FulcrumErrorPage from "@/components/child/other/FulcrumErrorPage.tsx";
import Loader from "@/components/child/other/Loader.tsx";
import { getTotalAmountBudgeted } from "@/utility/util.ts";

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
  const {
    totalIncome,
    budgetFormVisibility,
    setBudgetFormVisibility,
    budgetModalVisibility,
    setBudgetModalVisibility,
    groupToDelete,
    setGroupToDelete,
    categoryToDelete,
    setCategoryToDelete,
    oldBudgetBeingEdited,
    setOldBudgetBeingEdited,
    oldGroupBeingEdited,
    setOldGroupBeingEdited,
    amountLeftToBudget,
    setAmountLeftToBudget,
    groupNameOfNewItem,
    setGroupNameOfNewItem,
    isBudgetFormOrModalOpen,
    lineAngle,
    perCategoryExpenseTotalThisMonth,
    setPerCategoryExpenseTotalThisMonth,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useInitialBudgetData();

  if (isError) {
    return <FulcrumErrorPage errors={[error!]} />;
  }

  if (isLoading || !budgetArray) {
    return <Loader isLoading={isLoading} isDarkMode={publicUserData.darkModeEnabled ?? false} />;
  }

  return (
    <div className="flex flex-col justify-start w-full gap-8">
      {/*<div className="flex flex-row justify-between w-full">*/}
      {/*  <div className="w-96 h-20 bg-red-500"></div>*/}
      {/*  <div className="w-64 h-20 bg-green-500"></div>*/}
      {/*</div>*/}
      <BudgetHeaderV2
        navMenuOpen={navMenuOpen}
        toggleNavMenu={toggleNavMenu}
        publicUserData={publicUserData}
        totalIncome={totalIncome!}
      />
      <div className={"flex flex-col gap-8 pt-[6vh] px-6"}>
        <div className="flex flex-row w-full gap-8 mt-6">
          {/*<div className="w-[65%] h-96 bg-blue-500"></div>*/}
          <FulcrumAnimationV2 totalIncome={totalIncome!} totalBudget={getTotalAmountBudgeted(budgetArray)} />
          <div className="flex-grow bg-yellow-500 flex justify-center items-center font-bold text-2xl">New Graph</div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="h-28 w-full bg-indigo-500"></div>
          <div className="h-28 w-full bg-purple-500"></div>
          <div className="h-28 w-full bg-pink-500"></div>
        </div>
      </div>
    </div>
  );
}
