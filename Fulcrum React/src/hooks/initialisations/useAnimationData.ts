import { useEffect, useState } from "react";

export default function useAnimationData(lineAngle: number) {
  const [animationDataIsLoading, setAnimationDataIsLoading] = useState(true);

  const [activeTriangleFulcrum, setActiveTriangleFulcrum] = useState("/src/assets/fulcrum-animation/fulcrum-tri-red.webp");
  const [leverEndXOffset, setLeverEndXOffset] = useState({
    leftEnd: 0,
    rightEnd: 0,
  });
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
    },
  });

  async function recalculateShadowDimensions() {
    setBowlWidth(window.innerWidth * 0.07);

    const newOffset = {
      leftEnd: Math.abs(lineAngle / 2.1),
      rightEnd: -Math.abs(lineAngle / 2.1),
    };
    if (newOffset.leftEnd !== leverEndXOffset.leftEnd || newOffset.rightEnd !== leverEndXOffset.rightEnd) {
      setLeverEndXOffset(newOffset);
    }
  }

  async function setShadowDimensions() {
    setBowlShadowDimensions({
      right: {
        width: `${bowlWidth + lineAngle * 2.7}px`,
        height: `${(bowlWidth + lineAngle * 1.4) / 10}px`,
        transform: `translate(-50%, -50%) translateX(${leverEndXOffset.rightEnd}px)`,
      },
      left: {
        width: `${bowlWidth - lineAngle * 2.7}px`,
        height: `${(bowlWidth - lineAngle * 1.4) / 10}px`,
        transform: `translate(50%, -50%) translateX(${leverEndXOffset.leftEnd}px)`,
      },
    });
  }

  useEffect(() => {
    setShadowDimensions().then(() => setAnimationDataIsLoading(false));
  }, [bowlWidth, leverEndXOffset]);

  useEffect(() => {
    recalculateShadowDimensions();
  }, [lineAngle, leverEndXOffset, bowlWidth]);

  useEffect(() => {
    setActiveTriangleFulcrum(`/src/assets/fulcrum-animation/fulcrum-tri-${lineAngle !== 0 ? "red" : "green"}.webp`);
  }, [lineAngle]);

  useEffect(() => {
    window.addEventListener("resize", recalculateShadowDimensions);
    return () => window.removeEventListener("resize", recalculateShadowDimensions);
  }, []);

  return {
    animationDataIsLoading,
    activeTriangleFulcrum,
    bowlShadowDimensions,
  };
}
