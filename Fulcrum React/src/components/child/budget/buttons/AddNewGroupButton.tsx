import { BudgetFormVisibility, SetFormVisibility } from "../../../../utility/types.ts";
import { changeFormOrModalVisibility } from "../../../../utility/util.ts";

interface AddNewGroupButtonProps {
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  isDarkMode: boolean;
}

/**
 * Button to create a new budget category group.
 */
export default function AddNewGroupButton({ setBudgetFormVisibility, isDarkMode }: AddNewGroupButtonProps) {
  async function handleClick() {
    changeFormOrModalVisibility(setBudgetFormVisibility, "isCreateGroupVisible", true);
  }

  return (
    <button className={`create-group-button ${isDarkMode && "create-expense-button-dark"}`} onClick={handleClick}>
      <p className="text-2xl font-bold">+</p>
    </button>
  );
}
