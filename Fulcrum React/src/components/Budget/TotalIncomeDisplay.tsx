import {formatDollarAmount} from "../../util.ts";
import {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from "react";

interface TotalIncomeDisplayProps {
    totalIncome: number;
    setTotalIncome: Dispatch<SetStateAction<number>>;
    amountLeftToBudget: number;
}

export default function TotalIncomeDisplay({ totalIncome, setTotalIncome, amountLeftToBudget }: TotalIncomeDisplayProps) {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [incomeFormData, setIncomeFormData] = useState<{ income: number }>({ income: 0});

    const handleEditClick = () => {
        setIsEditing(true);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIncomeFormData({ income: parseFloat(e.target.value)})
    }
    const handleInputBlur = () => {
        setIsEditing(false)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Needs to be stored in database as well - not implemented yet.
        setTotalIncome(incomeFormData.income)
        setIsEditing(false);
    }

    return (
        <div className="flex flex-row w-full items-center mt-1">
            <div className="flex-1 flex-row text-center font-bold bg-[#3f4540] py px-2.5 rounded-xl my-3 mx-6 text-white p-5 monthly-income">
                <span className="text-4xl">MONTHLY INCOME: </span>
                {isEditing ? <form className="inline" onSubmit={handleSubmit}>
                    <input
                        className="w-auto h-5 text-center"
                        type="text"
                        name="incomeDisplay"
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        autoFocus
                        min={0.01}
                        step={0.01}
                    />
                </form>: <span className="text-4xl" onClick={handleEditClick}>${formatDollarAmount(totalIncome)}</span>}
            </div>
            <div className="flex-1 text-center py1.5 px-2.5 rounded-xl my-3 mx-6 font-bold text-white p-5 remaining-income" style={{backgroundColor: `${amountLeftToBudget === 0 ? "#4CCC86" : "#FF3F3F"}`}}>
                <span className="text-4xl">REMAINING INCOME: </span>
                <span className="text-4xl">${formatDollarAmount(amountLeftToBudget)}</span>
            </div>
        </div>
    );
}
