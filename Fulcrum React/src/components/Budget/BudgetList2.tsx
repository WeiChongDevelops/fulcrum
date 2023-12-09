import {BudgetItemEntity} from "../../util.ts";
import BudgetItem2 from "./BudgetItem2.tsx";
import {Dispatch, SetStateAction} from "react";

interface BudgetList2Props {
    budgetArray: BudgetItemEntity[]
    setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>
}

export default function BudgetList2({budgetArray, setBudgetArray}: BudgetList2Props) {

    return(
        <>
            <h1>BudgetList</h1>
            <div>
            {budgetArray?.map((budgetElement, key) => {
                return <BudgetItem2 category={budgetElement.category}
                                   amount={budgetElement.amount}
                                    icon="/src/assets/icons/construction-icon.svg"
                                    setBudgetArray={setBudgetArray}
                                    key={key}/>
            })}
            </div>
        </>
    )
}