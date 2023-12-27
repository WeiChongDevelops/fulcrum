import "../../css/FulcrumAnimation.css"
import TotalIncomeDisplay from "./TotalIncomeDisplay.tsx";
import {Dispatch, SetStateAction} from "react";

interface FulcrumAnimationProps {
    amountLeftToBudget: number;
    totalIncome: number;
    setTotalIncome: Dispatch<SetStateAction<number>>;
}

export default function FulcrumAnimation( { amountLeftToBudget, totalIncome, setTotalIncome} : FulcrumAnimationProps) {

    const percentageIncomeRemaining = amountLeftToBudget/totalIncome * 100
    const lineAngle = percentageIncomeRemaining <= -100 ? -25: percentageIncomeRemaining / 4

    // const [lineAngleIndex, setLineAngleIndex] = useState<number>(0)

    return (
        <div className="container">
            <div>
            <div className="line" style={{transform: `rotate(${lineAngle}deg)`}}>
                {/*<TotalIncomeDisplay totalIncome={totalIncome} setTotalIncome={setTotalIncome} amountLeftToBudget={amountLeftToBudget}/>*/}
            </div>
            </div>
            <img src="/src/assets/fulcrum-animation/fulcrum-tri-red.svg" alt="Fulcrum base" className="triangle"/>
        </div>
    )
}