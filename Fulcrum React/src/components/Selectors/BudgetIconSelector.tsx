import {categoryIconArray} from "../../util.ts";
import "../../css/Budget.css"

export default function BudgetIconSelector() {
    return (
        <div id="icon-selector" className="my-2">
            {categoryIconArray.map((iconFileName, key) => {
                return <button data-value={iconFileName} className="category-icon-selectable" key={key}>
                    <img src={`/src/assets/category-icons/${iconFileName}`} alt="Icon option"/>
                </button>
            })}
        </div>
    );
}