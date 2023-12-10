import BudgetList from "./BudgetList.tsx";
import BudgetCreationForm from "./BudgetCreationForm.tsx";
import { BudgetItemEntity, getBudgetList } from "../../util.ts";
import { useEffect, useState } from "react";
import AddNewBudgetButton from "./AddNewBudgetButton.tsx";
import BudgetUpdatingForm from "./BudgetUpdatingForm.tsx";

export default function Budget() {
    const [budgetArray, setBudgetArray] = useState<BudgetItemEntity[]>([]);
    const [isCreateBudgetVisible, setIsCreateBudgetVisible] = useState<boolean>(false);
    const [isUpdateBudgetVisible, setIsUpdateBudgetVisible] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editingOldAmount, setEditingOldAmount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            const budgetList = await getBudgetList();
            setBudgetArray(budgetList);
        }
        fetchData()
    }, []);

    return (
        <div>
            <div className={`elementsBelowPopUpForm ${(isCreateBudgetVisible || isUpdateBudgetVisible) && "blur"}`}>
                <BudgetList
                    budgetArray={budgetArray}
                    setBudgetArray={setBudgetArray}
                    setIsUpdateBudgetVisible={setIsUpdateBudgetVisible}
                    setEditingCategory={setEditingCategory}
                    setEditingOldAmount={setEditingOldAmount}
                />
                <AddNewBudgetButton setIsFormVisible={setIsCreateBudgetVisible} />
            </div>
            {isCreateBudgetVisible && <BudgetCreationForm setIsCreateBudgetVisible={setIsCreateBudgetVisible} setBudgetArray={setBudgetArray} />}
            {isUpdateBudgetVisible && <BudgetUpdatingForm setBudgetArray={setBudgetArray} category={editingCategory} setIsUpdateBudgetVisible={setIsUpdateBudgetVisible} oldAmount={editingOldAmount}/>}
        </div>
    );
}
