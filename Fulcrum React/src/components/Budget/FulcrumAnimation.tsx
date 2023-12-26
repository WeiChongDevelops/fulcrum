import "../../css/FulcrumAnimation.css"

interface FulcrumAnimationProps {
    amountLeftToBudget: number;
    totalIncome: number;
}

export default function FulcrumAnimation( { amountLeftToBudget, totalIncome } : FulcrumAnimationProps) {

    const percentageIncomeRemaining = amountLeftToBudget/totalIncome * 100
    const lineAngle = percentageIncomeRemaining <= -100 ? -25: percentageIncomeRemaining / 4

    // const [lineAngleIndex, setLineAngleIndex] = useState<number>(0)

    return (
        <div className="container">
            <div className="line" style={{transform: `rotate(${lineAngle}deg)`}}></div>
            <img src="/src/assets/fulcrum-animation/fulcrum-tri-red.svg" alt="Fulcrum base" className="triangle"/>
        </div>
    )
}