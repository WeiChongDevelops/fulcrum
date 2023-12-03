
import {BudgetItemEntity} from "../../util.ts";

export default function BudgetItem({category, amount}: BudgetItemEntity) {
    return (
        <li>{`category: ${category} |
        amount: ${amount}`}
        </li>
    )
}