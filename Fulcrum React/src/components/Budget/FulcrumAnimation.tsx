import {useEffect, useState} from "react";

interface FulcrumAnimationProps {
    lineAngle: number;
}

export default function FulcrumAnimation( { lineAngle } : FulcrumAnimationProps) {
    console.log(`lineAngle: ${lineAngle}`)

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
        console.log(`Line angle is ${lineAngle}`)
        console.log(`X offset: ${-Math.abs(lineAngle)}`)

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
                ? "/src/assets/fulcrum-animation/fulcrum-tri-green.webp"
                : "/src/assets/fulcrum-animation/fulcrum-tri-red.webp"
        )
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
                <div className="rotating-text-label-container absolute flex flex-row justify-between w-[100%] text-[1.5em] bottom-8 ">
                    <b className="text-black">Budget</b>
                    <b className="text-black">Income</b>
                </div>
                <img src="/src/assets/fulcrum-animation/fulcrum-rectangle.png" className="fulcrum-rectangle" alt="Fulcrum lever"/>
                <img src="/src/assets/fulcrum-animation/fulcrum-basket.webp" alt="Fulcrum bowl" className="fulcrum-bowl-left" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg)`}}/>
                <img src="/src/assets/fulcrum-animation/fulcrum-basket.webp" alt="Fulcrum bowl" className="fulcrum-bowl-right" style={{transform: `translate(-50%, -50%) rotate(${360 + lineAngle}deg) `}}/>
            </div>
        </div>
    );
}