import "../../../../css/Budget.css";
import {
  changeFormOrModalVisibility,
  dynamicallySizeBudgetNumberDisplays,
  formatDollarAmountStatic,
  LocationContext,
  useLocation,
} from "../../../../utility/util.ts";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  BudgetFormVisibility,
  BudgetModalVisibility,
  PreviousBudgetBeingEdited,
  UserPreferences,
  SetFormVisibility,
  SetModalVisibility,
} from "../../../../utility/types.ts";

interface BudgetTileProps {
  category: string;
  amount: number;
  group: string;
  icon: string;

  setOldBudgetBeingEdited: Dispatch<SetStateAction<PreviousBudgetBeingEdited>>;
  setBudgetFormVisibility: SetFormVisibility<BudgetFormVisibility>;
  setModalFormVisibility: SetModalVisibility<BudgetModalVisibility>;
  perCategoryExpenseTotalThisMonth: Map<string, number>;
  setCategoryToDelete: Dispatch<SetStateAction<string>>;
  userPreferences: UserPreferences;
}

/**
 * An individual interactive budget infographic tile in a category group.
 */
export default function BudgetTile({
  category,
  amount,
  group,
  icon,
  setOldBudgetBeingEdited,
  setBudgetFormVisibility,
  setModalFormVisibility,
  setCategoryToDelete,
  perCategoryExpenseTotalThisMonth,
  userPreferences,
}: BudgetTileProps) {
  const spent = perCategoryExpenseTotalThisMonth.get(category)!;
  const [budgetExceeded, setBudgetExceeded] = useState(spent > amount);
  const routerLocation = useLocation();

  function handleEditClick() {
    setOldBudgetBeingEdited({
      oldCategory: category,
      oldAmount: amount,
      oldGroup: group,
      oldIconPath: icon,
    });
    changeFormOrModalVisibility(setBudgetFormVisibility, "isUpdateBudgetVisible", true);
  }

  useEffect(() => {
    setBudgetExceeded(spent > amount);
    dynamicallySizeBudgetNumberDisplays();
  }, [amount, perCategoryExpenseTotalThisMonth, routerLocation]);

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setCategoryToDelete(category);
    changeFormOrModalVisibility(setModalFormVisibility, "isConfirmCategoryDeletionModalVisible", true);
  }

  const currency = userPreferences.currency;

  return (
    <div
      className="budget-tile"
      style={{ backgroundColor: `${budgetExceeded ? "#ff3f3f" : "#44b775"}` }}
      onClick={handleEditClick}
    >
      <div className="tile-icon-container">
        <img className="budget-tile-icon" src={`/static/assets-v2/category-icons/${icon}`} alt="Category icon" />
      </div>
      <div className="budget-name-container line-clamp-2">
        <p className="budget-name">{category.toUpperCase()}</p>
      </div>
      <div className="budgeting-values-container">
        <p className={"truncate"}>
          Spent: {formatDollarAmountStatic(spent, currency)} of {formatDollarAmountStatic(amount, currency)}
        </p>
        <p className={"truncate"}>Left: {formatDollarAmountStatic(amount - spent, currency)}</p>
      </div>
      <div className="flex flex-row mb-2">
        <button className="circle-button" onClick={handleEditClick}>
          <img src="/static/assets-v2/UI-icons/edit-pencil-white-icon.svg" alt="Budget edit icon" className="mx-1 w-5 h-5" />
        </button>
        <button className="circle-button" onClick={handleDeleteClick}>
          <img
            src="/static/assets-v2/UI-icons/delete-trash-white-icon.svg"
            alt="Budget delete icon"
            className="mx-1 w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}
