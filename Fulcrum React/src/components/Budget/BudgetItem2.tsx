
interface BudgetItem2Props {
    category: string;
    amount: number;
    icon: string;
}

export default function BudgetItem2({category, amount, icon}: BudgetItem2Props) {
    const styles = {
        boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 1)" // 100% opacity black shadow
    }

    return (
        <div className="flex flex-row justify-between items-center bg-blue-200 py-1.5 px-2.5 rounded-3xl my-3 text-black"
             style={styles}>
            <div className="flex flex-row items-start">
                <div className="rounded-full bg-green-950 p-2">
                    <img src={icon} alt=""/>
                </div>
                <div className="flex flex-col items-start ml-2">
                    <b>{category}</b>
                    <h3>Parent Category Filler</h3>
                </div>
            </div>
            <h2>${amount}</h2>
        </div>
    )
}