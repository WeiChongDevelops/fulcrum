
import {ExpenseItemEntity} from "../../util.ts";

export default function TestExpenseItem({expenseId, category, amount, timestamp}: ExpenseItemEntity) {
    return (
        <li>{`expenseId: ${expenseId} |
        category: ${category} |
        amount: ${amount} |
        timestamp: ${timestamp}`}
        </li>
    )
}