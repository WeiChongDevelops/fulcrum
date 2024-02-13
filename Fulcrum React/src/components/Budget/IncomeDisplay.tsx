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
    const [incomeFormData, setIncomeFormData] = useState({ income: formatDollarAmountStatic(totalIncome, currency)});


    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") {
            setIncomeFormData({ income: "0" })
        }
        const numericalAmount = parseInt(e.target.value);
        if (numericalAmount >= 0 && numericalAmount <= 9999999.99) {
            setIncomeFormData({ income: formatDollarAmountDynamic(e.target.value) });
        }
    }
    const handleInputBlur = () => {
        setIncomeFormData({ income: formatDollarAmountStatic(totalIncome, currency) });
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
        setIncomeFormData({ income: formatDollarAmountStatic(totalIncome, currency) });
    }, [totalIncome]);

    return (
        <div className="flex flex-row w-full items-center mt-1">
            <div className="flex-1 flex-row text-center justify-center font-bold bg-[#17423f] p-5 rounded-xl my-3 mx-6 text-white monthly-income">
                <span className="text-4xl">MONTHLY INCOME: </span>
                {isEditing ? <form className="inline relative bottom-1" onSubmit={handleSubmit}>
                    <span className="relative left-6 text-black">$</span>
                    <input
                        className="w-[17.5%] h-6 text-center text-xl"
                        type="text"
                        name="incomeDisplay"
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        value={incomeFormData.income}
                        autoFocus
                    />
                </form>: <span className="text-4xl" onClick={handleEditClick}>{formatDollarAmountStatic(totalIncome, currency)}</span>}
            </div>
            <div className="flex-1 text-center p-5 rounded-xl my-3 mx-6 font-bold text-white remaining-income" style={{backgroundColor: `${amountLeftToBudget === 0 ? "#4CCC86" : "#FF3F3F"}`}}>
                <span className="text-4xl">INCOME LEFT TO BUDGET: </span>
                <span className="text-4xl">{formatDollarAmountStatic(amountLeftToBudget, currency)}</span>
            </div>
        </div>
    );
}
