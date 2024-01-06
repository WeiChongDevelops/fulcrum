import "../../css/FulcrumAnimation.css"
import {useEffect, useState} from "react";

interface FulcrumAnimationProps {
    amountLeftToBudget: number;
    totalIncome: number;
}

export default function FulcrumAnimation( { amountLeftToBudget, totalIncome} : FulcrumAnimationProps) {

    const [activeTriangleFulcrum, setActiveTriangleFulcrum] = useState("/src/assets/fulcrum-animation/fulcrum-icon-red.png");
    const [leverEndXOffset, setLeverEndXOffset] = useState(0);
    const [bowlWidth, setBowlWidth] = useState(0);
    const [rightBowlShadowDimensions, setRightBowlShadowDimensions] = useState( {
        width: "0",
        height: "0",
        transform: "translate(-50%, -50%)",
    })

    const dilator = window.innerWidth / 2;
    // const dilator = 500;

    // const percentageIncomeRemaining =
    const percentageIncomeRemaining = amountLeftToBudget/totalIncome * 100;
    // Any disproportionately small or large numbers pulled into normal ranges for the animation
    const functionalPercentageIncomeRemaining = percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining

    const lineAngle = functionalPercentageIncomeRemaining <= -100 ? -14.5 :
        functionalPercentageIncomeRemaining === 100 ? 14.5 :
        functionalPercentageIncomeRemaining / (100/14.5);

    function fetchAnimationNumbers() {
        const leverEndYOffset = window.innerWidth * Math.sin(lineAngle);
        setLeverEndXOffset(0 - Math.pow(leverEndYOffset/dilator, 2));

        const bowlElement = document.querySelector(".fulcrum-bowl-right")
        setBowlWidth(bowlElement ? bowlElement.clientWidth : 135);

        setRightBowlShadowDimensions({
            width: `${bowlWidth - (functionalPercentageIncomeRemaining / bowlWidth * 10)}px`,
            height: `${bowlWidth / 8 - (functionalPercentageIncomeRemaining / bowlWidth)}px`,
            transform: `translate(-50%, -50%) translateX(${leverEndXOffset}px`,
        });
    }

    useEffect( () => {
        fetchAnimationNumbers();

        window.addEventListener('resize',  fetchAnimationNumbers)
        return ( () => window.removeEventListener('resize', fetchAnimationNumbers))
    },[percentageIncomeRemaining, bowlWidth])


    useEffect( () => {
        setActiveTriangleFulcrum(
            functionalPercentageIncomeRemaining === 0
                ? "/src/assets/fulcrum-animation/fulcrum-icon-green.png"
                : "/src/assets/fulcrum-animation/fulcrum-icon-red.png"
        )
    },[percentageIncomeRemaining]);

    return (
      <div className="fulcrum-animation-container">
          <div className="fulcrum-triangle-container">
              <img src={activeTriangleFulcrum} alt="Triangle fulcrum"/>
              <div className="contact-shadow"></div>
              <div className="bowl-shadow-right" style={rightBowlShadowDimensions}></div>
              {/*<div className="bowl-shadow-left" style{{width:}}></div>*/}
          </div>
          <div className="rotating-container" style={{transform: `rotate(${lineAngle}deg) translateX(-50%)`}}>
              <img src="/src/assets/fulcrum-animation/rectangle-fulcrum.png" className="fulcrum-rectangle" alt="Fulcrum lever"/>
              <img src="/src/assets/fulcrum-animation/basket-fulcrum-2.png" alt="Fulcrum bowl" className="fulcrum-bowl-left" style={{transform: `translate(-50%, -50%) rotate(${360 - lineAngle}deg)`}}/>
              <img src="/src/assets/fulcrum-animation/basket-fulcrum-2.png" alt="Fulcrum bowl" className="fulcrum-bowl-right" style={{transform: `translate(-50%, -50%) rotate(${360 - lineAngle}deg) `}}/>
          </div>
      </div>
    );
}