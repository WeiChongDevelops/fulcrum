import { Dispatch, SetStateAction } from "react";
import { BudgetFormVisibility, SetFormVisibility } from "@/utility/types.ts";
import { changeFormOrModalVisibility } from "@/utility/util.ts";

interface AddNewBudgetToGroupButtonV2Props {
  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
  groupNameOfNewItem: string;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
}

/**
 * Button to add a new budget to a category group.
 */
export default function AddNewBudgetToGroupButtonV2({
  setGroupNameOfNewItem,
  groupNameOfNewItem,
  setBudgetFormVisibility,
}: AddNewBudgetToGroupButtonV2Props) {
  function handleClick() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateBudgetVisible", true);
    setGroupNameOfNewItem(groupNameOfNewItem);
  }

  return (
    <button
      className="size-44 rounded-xl border-2 border-dashed border-black hover:rounded-md hover:bg-[#DEDEDE33] transition-all duration-200 ease-out"
      onClick={handleClick}
    >
      <b>+</b>
    </button>
  );
}
