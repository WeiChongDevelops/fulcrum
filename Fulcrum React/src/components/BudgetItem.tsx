export default function ExpenseItem(category: string, categoryId: string, amount: number) {
    return (
        <li>{`Category: ${category}, ID: ${categoryId}, $${amount}`}</li>
    )
}