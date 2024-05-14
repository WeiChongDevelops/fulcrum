import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";

interface FulcrumAnimationV2Props {
  totalIncome: number;
  budgetTotal: number;
}

export default function FulcrumAnimationV2({ totalIncome, budgetTotal }: FulcrumAnimationV2Props) {
  const [lineAngle, setLineAngle] = useState(0);
  const leverRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [leverLeft, setLeverLeft] = useState(0);

  const [containerLeft, setContainerLeft] = useState(0);

  const [leftOffset, setLeftOffset] = useState(leverLeft - containerLeft);
  const [rightOffset, setRightOffset] = useState(leftOffset);

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
    setTimeout(updateRect, 100);
    console.log(lineAngle);
  }, [lineAngle]);

  useEffect(() => {
    setLeftOffset(leverLeft - containerLeft);

    const leverRect = leverRef.current?.getBoundingClientRect();
    setRightOffset(leverLeft - containerLeft + leverRect!.width);
  }, [leverLeft, containerLeft]);

  const turnClockwise = () => {
    setLineAngle(lineAngle + 5);
  };
  const turnAntiClockwise = () => {
    setLineAngle(lineAngle - 5);
  };
  const resetLever = () => {
    setLineAngle(0);
  };

  return (
    <div className={"relative w-[55%] bg-blue-500 py-64"} ref={containerRef}>
      <div className={"absolute top-0 gap-2 flex flex-row justify-center items-center"}>
        <Button onClick={turnClockwise}>Clockwise</Button>
        <Button onClick={turnAntiClockwise}>Anti-Clockwise</Button>
        <Button onClick={resetLever}>Reset</Button>
        <Button onClick={updateRect}>Update</Button>
      </div>

      <div
        ref={leverRef}
        className={
          "absolute z-20 bottom-[43%] left-1/2 w-[70%] h-4 bg-purple-500 origin-center transition-transform ease-out"
        }
        style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)` }}
      ></div>
      <div className={"absolute z-10 bottom-[15%] left-1/2 -translate-x-1/2 size-36 rounded-full bg-orange-500"}></div>

      <div
        className={"absolute top-0 w-1 h-screen -translate-x-1/2 bg-blue-950 transition-all ease-out"}
        style={{ left: leftOffset }}
      ></div>

      <div
        className={"absolute bottom-[18%] bg-black w-[3vw] h-[1vw] rounded-[50%] transition-all ease-out origin-center"}
        style={{ left: leftOffset, transform: `translateX(-50%) scale(${100 + lineAngle}%)` }}
      ></div>

      <div
        className={"absolute top-0 w-1 h-screen -translate-x-1/2 bg-blue-950 transition-all ease-out"}
        style={{ left: rightOffset }}
      ></div>

      <div
        className={"absolute bottom-[18%] -translate-x-1/2 bg-black w-[3vw] h-[1vw] rounded-[50%] transition-all ease-out"}
        style={{ left: rightOffset, transform: `translateX(-50%) scale(${100 - lineAngle}%)` }}
      ></div>
    </div>
  );
}
