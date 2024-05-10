import { categoryIconArray } from "../../../utility/util.ts";
import "../../../css/Budget.css";

/**
 * A visual selector for the user to choose an icon for a budget category.
 */
export default function CategoryIconSelector() {
  return (
    <div id="icon-selector" className="my-2">
      {categoryIconArray.map((iconFileName, key) => {
        return (
          <button data-value={iconFileName} className="category-icon-selectable" key={key}>
            <img src={`/static/assets-v2/category-icons/${iconFileName}`} alt="Icon option" />
          </button>
        );
      })}
    </div>
  );
}
