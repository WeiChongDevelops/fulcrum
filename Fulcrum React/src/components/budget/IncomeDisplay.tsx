import {
    formatDollarAmountDynamic,
    formatDollarAmountStatic,
    handleTotalIncomeUpdating,
    PublicUserData
} from "../../util.ts";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react";

interface IncomeDisplayProps {
    totalIncome: number;
    setTotalIncome: Dispatch<SetStateAction<number>>;
    amountLeftToBudget: number;
    publicUserData: PublicUserData;
}

export default function IncomeDisplay({ totalIncome, setTotalIncome, amountLeftToBudget, publicUserData}: IncomeDisplayProps) {

    const currency = publicUserData.currency;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [incomeFormData, setIncomeFormData] = useState({ income: formatDollarAmountDynamic(totalIncome.toString())});

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setIncomeFormData({ income: formatDollarAmountDynamic(e.target.value) })
        }
        const numericalAmount = parseInt(e.target.value);
        if (numericalAmount >= 0 && numericalAmount <= 9999999.99) {
            setIncomeFormData({ income: formatDollarAmountDynamic(e.target.value) });
        }
    }
    const handleInputBlur = () => {
        setIncomeFormData({ income: formatDollarAmountDynamic(totalIncome.toString()) });
        setIsEditing(false);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsEditing(false);

        const newTotalIncomeData = parseFloat(incomeFormData.income);
        setTotalIncome(newTotalIncomeData)
        await handleTotalIncomeUpdating(newTotalIncomeData)
    }

    useEffect(() => {
        setIncomeFormData({ income: formatDollarAmountDynamic(totalIncome.toString()) });
    }, [totalIncome]);

    return (
        <div className="flex flex-row w-full items-center mt-1">
            <div className="income-display monthly-income bg-[#17423f]" onClick={handleEditClick}>
                <span>MONTHLY INCOME: </span>
                {isEditing ? <form className="inline relative bottom-1" onSubmit={handleSubmit}>
                    <input
                        className="w-[20%] text-xl h-6 text-center"
                        type="text"
                        name="incomeDisplay"
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        value={incomeFormData.income}
                        autoFocus
                    />
                </form>: <span >{formatDollarAmountStatic(totalIncome, currency)}</span>}
            </div>
            <div className="income-display" style={{backgroundColor: `${amountLeftToBudget === 0 ? "#4CCC86" : "#FF3F3F"}`}}>
                <span>LEFT TO BUDGET: </span>
                <span>{formatDollarAmountStatic(amountLeftToBudget, currency)}</span>
            </div>
        </div>
    );
}
