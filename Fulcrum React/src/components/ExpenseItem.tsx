
import {ExpenseItemEntity} from "../util.ts";

export default function ExpenseItem({expenseId, userId, categoryId, amount, timestamp}: ExpenseItemEntity) {
    return (
        <li>{`expenseId: ${expenseId}, 
        userId: ${userId}, 
        categoryId: $${categoryId}, 
        amount:${amount}, 
        timestamp:${timestamp}`}
        </li>
    )
}