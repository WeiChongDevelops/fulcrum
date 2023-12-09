import {BudgetItemEntity} from "../../util.ts";
import BudgetItem2 from "./BudgetItem2.tsx";

interface BudgetList2Props {
    budgetArray: BudgetItemEntity[]
}

export default function BudgetList2({budgetArray}: BudgetList2Props) {

    return(
        <>
            <h1>BudgetList</h1>
            <div>
            {budgetArray?.map((budgetElement, key) => {
                return <BudgetItem2 category={budgetElement.category}
                                   amount={budgetElement.amount}
                                    icon="/src/assets/icons/construction-symbol.svg"
                                    key={key}/>
            })}
            </div>
        </>
    )
}