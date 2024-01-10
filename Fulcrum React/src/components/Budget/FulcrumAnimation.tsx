import {useEffect, useState} from "react";

interface FulcrumAnimationProps {
    lineAngle: number;
}

export default function FulcrumAnimation( { lineAngle } : FulcrumAnimationProps) {
    const getBowlWidth = () => {
        const bowlElement = document.querySelector(".fulcrum-bowl-right")
        return bowlElement ? bowlElement.clientWidth : 135;
    }

    const [activeTriangleFulcrum, setActiveTriangleFulcrum] = useState("/src/assets/fulcrum-animation/fulcrum-icon-red.png");
    const [leverEndXOffset, setLeverEndXOffset] = useState({leftEnd: 0, rightEnd: 0});
    const [bowlWidth, setBowlWidth] = useState(getBowlWidth);
    const [rightBowlShadowDimensions, setRightBowlShadowDimensions] = useState( {
        width: `${bowlWidth}px`,
        height: `${bowlWidth / 12}px`,
        transform: `translate(-50%, -50%) translateX(${leverEndXOffset.rightEnd}px)`,
    })
    const [leftBowlShadowDimensions, setLeftBowlShadowDimensions] = useState( {
        width: `${bowlWidth}px`,
        height: `${bowlWidth / 12}px`,
        transform: `translate(50%, -50%) translateX(${leverEndXOffset.leftEnd}px)`,
    })

    function recalculateShadowDimensions() {
        const bowlElement = document.querySelector(".fulcrum-bowl-right")
        setBowlWidth(bowlElement ? bowlElement.clientWidth : 135);
        console.log(`Line angle is ${lineAngle}`)
        console.log(`X offset: ${-Math.abs(lineAngle)}`)

        const newOffset = {
            leftEnd: Math.abs(lineAngle / 1.5),
            rightEnd: -Math.abs(lineAngle / 1.5)
        };
        if (newOffset.leftEnd !== leverEndXOffset.leftEnd || newOffset.rightEnd !== leverEndXOffset.rightEnd) {
            setLeverEndXOffset(newOffset);
        }
    }

    function setShadowDimensions() {
        setRightBowlShadowDimensions({
            width: `${bowlWidth + lineAngle * 1.4}px`,
            height: `${(bowlWidth + lineAngle * 1.4) / 8}px`,
            transform: `translate(-50%, -50%) translateX(${leverEndXOffset.rightEnd}px)`,
        });
        setLeftBowlShadowDimensions({
            width: `${bowlWidth - lineAngle * 1.4}px`,
            height: `${(bowlWidth - lineAngle * 1.4) / 8}px`,
            transform: `translate(50%, -50%) translateX(${leverEndXOffset.leftEnd}px)`,
        });
    }

    useEffect( () => {
        function recalculateAnimationStyling() {
            recalculateShadowDimensions();
            setShadowDimensions();
        }
        window.addEventListener("resize", recalculateAnimationStyling)
        return (() => window.removeEventListener("resize", recalculateAnimationStyling))
    })

    useEffect(() => {
        recalculateShadowDimensions();
    }, [lineAngle]);

    useEffect(() => {
        setShadowDimensions();
    }, [lineAngle, leverEndXOffset, bowlWidth]);


    useEffect( () => {
        setActiveTriangleFulcrum(
            lineAngle === 0
                ? "/src/assets/fulcrum-animation/fulcrum-icon-green.png"
                : "/src/assets/fulcrum-animation/fulcrum-icon-red.png"
        )
    },[lineAngle]);

    return (
        <div className="fulcrum-animation-container">
            <div className="fulcrum-triangle-container">
                <img src={activeTriangleFulcrum} alt="Triangle fulcrum"/>
                <div className="contact-shadow"></div>
                <div className="bowl-shadow-right" style={rightBowlShadowDimensions}></div>
                <div className="bowl-shadow-left" style={leftBowlShadowDimensions}></div>
            </div>
            <div className="rotating-container" style={{transform: `rotate(${-lineAngle}deg) translateX(-50%)`}}>
                <div className="rotating-text-label-container absolute flex flex-row justify-between w-[95%] ml-[2.5%] text-[1.5em] bottom-8">
                    <b className="text-black">Budget</b>
                    <b className="text-black">Income</b>
                </div>
                <img src="/src/assets/fulcrum-animation/rectangle-fulcrum.png" className="fulcrum-rectangle" alt="Fulcrum lever"/>
                <img src="/src/assets/fulcrum-animation/basket-fulcrum-2.png" alt="Fulcrum bowl" className="fulcrum-bowl-left" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg)`}}/>
                <img src="/src/assets/fulcrum-animation/basket-fulcrum-2.png" alt="Fulcrum bowl" className="fulcrum-bowl-right" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg) `}}/>
            </div>
        </div>
    );
}