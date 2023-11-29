
export interface GenericItemList {
    category: string
    categoryId: number
    amount: number
}

export const tempStartBudgetList: GenericItemList[] = [
    {
        category: "Water",
        categoryId: 111,
        amount: 100
    },
    {
        category: "Electricity",
        categoryId: 222,
        amount: 70
    },
    {
        category: "Rent",
        categoryId: 333,
        amount: 7000
    },
]
export const tempStartExpenseList: GenericItemList[] = [
    {
        category: "Water",
        categoryId: 111,
        amount: 80
    },
    {
        category: "Electricity",
        categoryId: 222,
        amount: 65
    },
    {
        category: "Rent",
        categoryId: 333,
        amount: 10000
    },
]