
interface ExpenseItemProps {
    category: string
    categoryId: number
    amount: number
    userId: number
    timestamp: Date
}

export default function ExpenseItem({category, categoryId, amount, userId, timestamp}: ExpenseItemProps) {
    return (
        <li>{`category: ${category}, 
        categoryId: ${categoryId}, 
        amount: $${amount}, 
        userId:${userId}, 
        timestamp:${timestamp}`}
        </li>
    )
}