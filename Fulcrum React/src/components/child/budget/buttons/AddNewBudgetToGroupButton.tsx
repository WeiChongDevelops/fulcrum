import { Dispatch, SetStateAction } from "react";
import { BudgetFormVisibility, SetFormVisibility } from "../../../../utility/types.ts";
import { changeFormOrModalVisibility } from "../../../../utility/util.ts";
interface AddNewBudgetToGroupButtonProps {
  setGroupNameOfNewItem: Dispatch<SetStateAction<string>>;
  groupNameOfNewItem: string;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
}

/**
 * Button to add a new budget to a category group.
 */
export default function AddNewBudgetToGroupButton({
  setGroupNameOfNewItem,
  groupNameOfNewItem,
  setBudgetFormVisibility,
}: AddNewBudgetToGroupButtonProps) {
  function handleClick() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateBudgetVisible", true);
    setGroupNameOfNewItem(groupNameOfNewItem);
  }

  return (
    <button className="create-budget-button" onClick={handleClick}>
      <b>+</b>
    </button>
  );
}
