import {useEffect, useState} from "react";

interface FulcrumAnimationProps {
    lineAngle: number;
    isDarkMode: boolean;
}

export default function FulcrumAnimation( { lineAngle, isDarkMode } : FulcrumAnimationProps) {

    const [activeTriangleFulcrum, setActiveTriangleFulcrum] = useState("/src/assets/fulcrum-animation/fulcrum-tri-red.webp");
    const [leverEndXOffset, setLeverEndXOffset] = useState({leftEnd: 0, rightEnd: 0});
    const [bowlWidth, setBowlWidth] = useState(window.innerWidth * 0.07);
    const [bowlShadowDimensions, setBowlShadowDimensions] = useState({
        right: {
            width: `${bowlWidth}px`,
            height: `${bowlWidth / 12}px`,
            transform: `translate(-50%, -50%) translateX(${leverEndXOffset.rightEnd}px)`,
        },
        left: {
            width: `${bowlWidth}px`,
            height: `${bowlWidth / 12}px`,
            transform: `translate(50%, -50%) translateX(${leverEndXOffset.leftEnd}px)`,
        }
    })

    function recalculateShadowDimensions() {
        setBowlWidth(window.innerWidth * 0.07);

        const newOffset = {
            leftEnd: Math.abs(lineAngle / 2.1),
            rightEnd: -Math.abs(lineAngle / 2.1)
        };
        if (newOffset.leftEnd !== leverEndXOffset.leftEnd || newOffset.rightEnd !== leverEndXOffset.rightEnd) {
            setLeverEndXOffset(newOffset);
        }
    }

    function setShadowDimensions() {
        setBowlShadowDimensions(
            {
                right: {
                    width: `${bowlWidth + lineAngle * 2.7}px`,
                    height: `${(bowlWidth + lineAngle * 1.4) / 10}px`,
                    transform: `translate(-50%, -50%) translateX(${leverEndXOffset.rightEnd}px)`,
                },
                left: {
                    width: `${bowlWidth - lineAngle * 2.7}px`,
                    height: `${(bowlWidth - lineAngle * 1.4) / 10}px`,
                    transform: `translate(50%, -50%) translateX(${leverEndXOffset.leftEnd}px)`,
                }
            }
        )
    }

    useEffect( () => {
        function recalculateAnimationStyling() {
            recalculateShadowDimensions();
            setShadowDimensions();
        }

        window.addEventListener("resize", recalculateAnimationStyling)
        return (() => window.removeEventListener("resize", recalculateAnimationStyling))
    }, [])

    useEffect(() => {
        setShadowDimensions();
    }, [lineAngle, leverEndXOffset, bowlWidth]);

    useEffect( () => {
        recalculateShadowDimensions();
        // Show green fulcrum if scale is balanced, red otherwise
        setActiveTriangleFulcrum(`/src/assets/fulcrum-animation/fulcrum-tri-${lineAngle === 0 ? "green" : "red"}.webp`);
    },[lineAngle]);

    return (
        <div className="fulcrum-animation-container">
            <div className="fulcrum-triangle-container">
                <img src={activeTriangleFulcrum} alt="Triangle fulcrum"/>
                <div className="contact-shadow"></div>
                <div className="bowl-shadow-right" style={bowlShadowDimensions.right}></div>
                <div className="bowl-shadow-left" style={bowlShadowDimensions.left}></div>
            </div>
            <div className="rotating-container" style={{transform: `rotate(${-lineAngle}deg) translateX(-50%)`}}>
                <div className="rotating-text-label-container">
                    <b className={`${isDarkMode ? "text-white" : "text-black"}`}>BUDGET</b>
                    <b className={`${isDarkMode ? "text-white" : "text-black"}`}>INCOME</b>
                </div>
                <img src={`/src/assets/fulcrum-animation/fulcrum-rectangle-${isDarkMode ? "grey" : "black"}.png`} className="fulcrum-rectangle" alt="Fulcrum lever"/>
                <img src={`/src/assets/fulcrum-animation/fulcrum-basket-${isDarkMode ? "grey" : "black"}.webp`} alt="Fulcrum bowl" className="fulcrum-bowl-left" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg)`}}/>
                <img src={`/src/assets/fulcrum-animation/fulcrum-basket-${isDarkMode ? "grey" : "black"}.webp`} alt="Fulcrum bowl" className="fulcrum-bowl-right" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg) `}}/>
            </div>
        </div>
    );
}