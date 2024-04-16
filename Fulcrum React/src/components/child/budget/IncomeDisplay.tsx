import { formatDollarAmountDynamic, formatDollarAmountStatic } from "../../../utility/util.ts";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useUpdateTotalIncome from "../../../hooks/mutations/budget/useUpdateTotalIncome.ts";
import { PublicUserData } from "../../../utility/types.ts";

interface IncomeDisplayProps {
  totalIncome: number;
  amountLeftToBudget: number;
  publicUserData: PublicUserData;
}

/**
 * Displays the user's total income and the amount left to budget, also allowing users to edit their total income.
 */
export default function IncomeDisplay({ totalIncome, amountLeftToBudget, publicUserData }: IncomeDisplayProps) {
  const currency = publicUserData.currency;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [incomeFormData, setIncomeFormData] = useState({
    income: totalIncome ? formatDollarAmountDynamic(totalIncome.toString()) : "8000",
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setIncomeFormData({ income: formatDollarAmountDynamic(e.target.value) });
    }
    const numericalAmount = parseInt(e.target.value);
    if (numericalAmount >= 0 && numericalAmount <= 9999999.99) {
      setIncomeFormData({ income: formatDollarAmountDynamic(e.target.value) });
    }
  };
  const handleInputBlur = () => {
    setIncomeFormData({
      income: totalIncome ? formatDollarAmountDynamic(totalIncome.toString()) : "8000",
    });
    setIsEditing(false);
  };

  const { mutate } = useUpdateTotalIncome();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);

    const newTotalIncomeData = parseFloat(incomeFormData.income);
    mutate(newTotalIncomeData);
  };

  useEffect(() => {
    setIncomeFormData({
      income: totalIncome ? formatDollarAmountDynamic(totalIncome.toString()) : "8000",
    });
  }, [totalIncome]);

  return (
    <div className="flex flex-row w-full items-center mt-1">
      <div className="income-display monthly-income bg-[#17423f]" onClick={handleEditClick}>
        <span>MONTHLY INCOME: </span>
        {isEditing ? (
          <form className="inline relative bottom-1" onSubmit={handleSubmit}>
            <input
              className="w-[20%] text-xl h-6 text-center"
              type="text"
              name="incomeDisplay"
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              value={incomeFormData.income}
              autoComplete={"off"}
              autoFocus
            />
          </form>
        ) : (
          <span>{formatDollarAmountStatic(totalIncome, currency)}</span>
        )}
      </div>
      <div
        className="income-display"
        style={{
          backgroundColor: `${amountLeftToBudget === 0 ? "#4CCC86" : "#FF3F3F"}`,
        }}
      >
        <span>LEFT TO BUDGET: </span>
        <span>{formatDollarAmountStatic(amountLeftToBudget, currency)}</span>
      </div>
    </div>
  );
}
