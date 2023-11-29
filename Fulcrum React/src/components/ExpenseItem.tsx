
interface ExpenseItemProps {
    category: string
    categoryId: number
    amount: number
}

export default function ExpenseItem({category, categoryId, amount}: ExpenseItemProps) {
    return (
        <li>{`Category: ${category}, ID: ${categoryId}, $${amount}`}</li>
    )
}