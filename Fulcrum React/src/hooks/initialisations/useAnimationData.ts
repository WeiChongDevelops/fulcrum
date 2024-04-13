import { useEffect, useMemo, useState } from "react";

export default function useAnimationData(lineAngle: number) {
  const [animationDataLoadingStatus, setAnimationDataLoadingStatus] = useState({
    setShadows: true,
    calculateShadows: true,
  });
  const [animationDataIsLoading, setAnimationDataIsLoading] = useState(true);

  useEffect(() => {
    setAnimationDataIsLoading(animationDataLoadingStatus.setShadows || animationDataLoadingStatus.calculateShadows);
  }, [animationDataLoadingStatus]);

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

  useMemo(() => {
    async function recalculateAnimationStyling() {
      await recalculateShadowDimensions();
      await setShadowDimensions();
    }
    document.addEventListener("resize", recalculateAnimationStyling);
    return () => document.removeEventListener("resize", recalculateAnimationStyling);
  }, []);

  useMemo(async () => {
    await setShadowDimensions();
    setAnimationDataLoadingStatus((curr) => ({ ...curr, setShadows: false }));
  }, [lineAngle, leverEndXOffset, bowlWidth]);

  useMemo(async () => {
    await recalculateShadowDimensions();
    setAnimationDataLoadingStatus((curr) => ({ ...curr, calculateShadows: false }));
    setActiveTriangleFulcrum(`/src/assets/fulcrum-animation/fulcrum-tri-${lineAngle !== 0 ? "red" : "green"}.webp`);
  }, [lineAngle]);

  return {
    animationDataIsLoading,
    activeTriangleFulcrum,
    bowlShadowDimensions,
  };
}
