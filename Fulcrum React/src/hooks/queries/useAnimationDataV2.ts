import { useEffect, useRef, useState } from "react";
import { getLineAngle } from "@/utility/util.ts";
import { debounce } from "lodash";

interface useAnimationDataV2Props {
  sideBarOpen: boolean;
  totalIncome: number;
  totalBudget: number;
  budgetLayoutIsSideBySide: boolean;
}

export default function useAnimationDataV2({
  sideBarOpen,
  totalIncome,
  totalBudget,
  budgetLayoutIsSideBySide,
}: useAnimationDataV2Props) {
  const leverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<HTMLImageElement>(null);

  const [lineAngle, setLineAngle] = useState(0);
  const [leverLeft, setLeverLeft] = useState(0);
  const [containerLeft, setContainerLeft] = useState(0);
  const [leftOffset, setLeftOffset] = useState(leverLeft - containerLeft);
  const [rightOffset, setRightOffset] = useState(leftOffset);
  const [bowlWidth, setBowlWidth] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(1);

  const updateRect = async () => {
    const leverRect = leverRef.current?.getBoundingClientRect();
    if (!!leverRect) {
      setLeverLeft(leverRect.left);
    }
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!!containerRect) {
      setContainerLeft(containerRect.left);
    }
  };

  const shadowMoveStart = async () => {
    setShadowOpacity(0);
  };

  const shadowMoveEnd = async () => {
    await updateRect();
    setShadowOpacity(1);
  };

  const debouncedShadowMoveEnd = debounce(shadowMoveEnd, 400);

  useEffect(() => {
    window.addEventListener("resize", shadowMoveStart);
    window.addEventListener("resize", debouncedShadowMoveEnd);
    return () => {
      window.removeEventListener("resize", shadowMoveStart);
      window.removeEventListener("resize", debouncedShadowMoveEnd);
      debouncedShadowMoveEnd.cancel();
    };
  }, []);

  useEffect(() => {
    shadowMoveStart();
    debouncedShadowMoveEnd();
    !!bowlRef.current && setBowlWidth(bowlRef.current.getBoundingClientRect().width);
    return () => debouncedShadowMoveEnd.cancel();
  }, [sideBarOpen, budgetLayoutIsSideBySide, containerRef.current?.style.rotate]);

  useEffect(() => {
    updateRect();
  }, [lineAngle]);

  useEffect(() => {
    setLineAngle(getLineAngle(totalBudget - totalIncome, totalIncome));
  }, [totalIncome, totalBudget]);

  useEffect(() => {
    setLeftOffset(leverLeft - containerLeft);

    if (!!leverRef.current) {
      const leverRect = leverRef.current.getBoundingClientRect();
      setRightOffset(leverLeft - containerLeft + leverRect!.width);
    }
  }, [leverLeft, containerLeft]);

  return { bowlWidth, containerRef, lineAngle, leverRef, bowlRef, leftOffset, rightOffset, shadowOpacity };
}
