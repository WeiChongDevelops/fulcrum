import { useEffect, useRef, useState } from "react";
import { getLineAngle } from "@/utility/util.ts";

interface useAnimationDataV2Props {
  navMenuOpen: boolean;
  totalIncome: number;
  totalBudget: number;
}

export default function useAnimationDataV2({ navMenuOpen, totalIncome, totalBudget }: useAnimationDataV2Props) {
  const [lineAngle, setLineAngle] = useState(0);
  const leverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<HTMLImageElement>(null);

  const [leverLeft, setLeverLeft] = useState(0);

  const [containerLeft, setContainerLeft] = useState(0);

  const [leftOffset, setLeftOffset] = useState(leverLeft - containerLeft);
  const [rightOffset, setRightOffset] = useState(leftOffset);

  const [bowlWidth, setBowlWidth] = useState(0);

  const updateRect = () => {
    const leverRect = leverRef.current?.getBoundingClientRect();
    if (!!leverRect) {
      setLeverLeft(leverRect.left);
    }

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!!containerRect) {
      setContainerLeft(containerRect.left);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  useEffect(() => {
    setTimeout(updateRect, 225);
  }, [navMenuOpen]);

  useEffect(() => {
    setLineAngle(getLineAngle(totalBudget - totalIncome, totalIncome));
  }, [totalIncome, totalBudget]);

  useEffect(() => {
    setTimeout(updateRect, 250);
    !!bowlRef.current && setBowlWidth(bowlRef.current.getBoundingClientRect().width);
  }, [lineAngle]);

  useEffect(() => {
    setLeftOffset(leverLeft - containerLeft);

    if (!!leverRef.current) {
      const leverRect = leverRef.current.getBoundingClientRect();
      setRightOffset(leverLeft - containerLeft + leverRect!.width);
    }
  }, [leverLeft, containerLeft]);

  return { bowlWidth, containerRef, lineAngle, leverRef, bowlRef, leftOffset, rightOffset };
}
