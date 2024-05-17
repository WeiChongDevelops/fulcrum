import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { getLineAngle } from "@/utility/util.ts";

interface FulcrumAnimationV2Props {
  totalIncome: number;
  totalBudget: number;
}

export default function FulcrumAnimationV2({ totalIncome, totalBudget }: FulcrumAnimationV2Props) {
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
    setTimeout(() => {
      const leverRect = leverRef.current?.getBoundingClientRect();
      if (!!leverRect) {
        setLeverLeft(leverRect.left);
      }

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!!containerRect) {
        setContainerLeft(containerRect.left);
      }
    }, 250);
  };

  useEffect(() => {
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  useEffect(() => {
    setLineAngle(getLineAngle(totalBudget - totalIncome, totalIncome));
  }, [totalIncome, totalBudget]);

  useEffect(() => {
    updateRect();
    !!bowlRef.current && setBowlWidth(bowlRef.current.getBoundingClientRect().width);
    console.log(lineAngle);
    console.log(totalBudget);
    console.log(totalIncome);
  }, [lineAngle]);

  useEffect(() => {
    setLeftOffset(leverLeft - containerLeft);

    const leverRect = leverRef.current?.getBoundingClientRect();
    setRightOffset(leverLeft - containerLeft + leverRect!.width);
  }, [leverLeft, containerLeft]);

  const turnClockwise = () => {
    setLineAngle(lineAngle + 15);
  };
  const turnAntiClockwise = () => {
    setLineAngle(lineAngle - 15);
  };
  const resetLever = () => {
    setLineAngle(0);
  };

  const activeTriangleFulcrum = `/static/assets-v2/fulcrum-animation/fulcrum-tri-${lineAngle === 0 ? "green" : "red"}.webp`;
  const baseShadowWidth = bowlWidth * 0.85;

  return (
    <div className={"relative min-h-18 p-40 bg-blue-300 rounded-xl"} ref={containerRef}>
      {/*<div className={"absolute top-0 gap-2 flex flex-row justify-center items-center"}>*/}
      {/*  <Button onClick={turnClockwise}>Clockwise</Button>*/}
      {/*  <Button onClick={turnAntiClockwise}>Anti-Clockwise</Button>*/}
      {/*  <Button onClick={resetLever}>Reset</Button>*/}
      {/*  <Button onClick={updateRect}>Update</Button>*/}
      {/*</div>*/}

      {/*<div*/}
      {/*  ref={leverRef}*/}
      {/*  className={*/}
      {/*    "absolute z-20 bottom-[50%] left-1/2 w-[75%] h-4 rounded-md bg-black origin-center transition-transform ease-out"*/}
      {/*  }*/}
      {/*  style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)` }}*/}
      {/*></div>*/}
      <div
        className={
          "absolute flex flex-row justify-center z-20 bottom-[7.5rem] 2xl:bottom-24 left-1/2 w-[90%] origin-top transition-transform ease-out duration-300"
        }
        style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)` }}
      >
        <img
          src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
          alt="Fulcrum bowl"
          className="w-20 2xl:w-28 -mr-10 2xl:-mr-14 z-20 transition-transform origin-top duration-1000"
          style={{ transform: `rotate(${-lineAngle}deg` }}
        />
        <div ref={leverRef} className={"w-[75%] z-10 2xl:h-4 h-3 rounded-md bg-black"}></div>
        <img
          ref={bowlRef}
          src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
          alt="Fulcrum bowl"
          className="w-20 2xl:w-28 -ml-10 2xl:-ml-14 z-20 transition-transform origin-top duration-700"
          style={{ transform: `rotate(${-lineAngle}deg` }}
        />
      </div>
      <div className={"absolute z-10 bottom-10 left-1/2 -translate-x-1/2"}>
        <img src={activeTriangleFulcrum} className={"w-36"} alt="Triangle fulcrum" />
      </div>

      {/*<div*/}
      {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
      {/*  style={{ left: leftOffset }}*/}
      {/*></div>*/}

      <div
        className={"absolute bottom-[10.6%] bg-black rounded-[50%] transition-all ease-out"}
        style={{
          left: leftOffset,
          width: baseShadowWidth + lineAngle * 2,
          height: (baseShadowWidth + lineAngle * 2) / 10,
          transform: `translate(-50%, 50%) scale(${100 + lineAngle}%)`,
        }}
      ></div>

      {/*<div*/}
      {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
      {/*  style={{ left: rightOffset }}*/}
      {/*></div>*/}

      <div
        className={"absolute bottom-[10.6%] bg-black rounded-[50%] transition-all ease-out -translate-x-1/2 "}
        style={{
          left: rightOffset,
          width: baseShadowWidth - lineAngle * 2,
          height: (baseShadowWidth + lineAngle * 2) / 10,
          transform: `translate(-50%, 50%) scale(${100 - lineAngle}%)`,
        }}
      ></div>

      <div className={"absolute bottom-[10.6%] bg-black rounded-[50%] left-1/2 w-6 h-2 -translate-x-1/2"}></div>
    </div>
  );
}
