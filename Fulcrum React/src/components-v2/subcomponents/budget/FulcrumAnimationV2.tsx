import useAnimationDataV2 from "@/hooks/queries/useAnimationDataV2.ts";
import { cn, formatDollarAmountStatic, useSideBarIsOpen } from "@/utility/util.ts";
import BowlSVG from "@/components-v2/subcomponents/budget/BowlSVG.tsx";
import PivotOutlineSVG from "@/components-v2/subcomponents/budget/PivotOutlineSVG.tsx";

interface FulcrumAnimationV2Props {
  totalIncome: number;
  totalBudget: number;
  currency: string;
  budgetLayoutIsSideBySide: boolean;
}

export default function FulcrumAnimationV2({
  totalIncome,
  totalBudget,
  currency,
  budgetLayoutIsSideBySide,
}: FulcrumAnimationV2Props) {
  const sideBarOpen = useSideBarIsOpen();
  const { bowlWidth, containerRef, lineAngle, leverRef, bowlRef, leftOffset, rightOffset, shadowOpacity } =
    useAnimationDataV2({
      sideBarOpen,
      totalIncome,
      totalBudget,
      budgetLayoutIsSideBySide,
    });

  const activeTriangleFulcrum = `/static/assets-v2/fulcrum-animation/fulcrum-icon-${lineAngle === 0 ? "green" : "red"}-v2.webp`;
  const baseShadowWidth = bowlWidth * 0.85;
  const leftToBudget = totalIncome - totalBudget;

  return (
    <div className={"relative bg-primary-foreground z-10 border-[3px] border-border rounded-xl"}>
      <div
        className={"z-10 px-32 py-40 rounded-xl transition-opacity enableFadeIn h-96"}
        ref={containerRef}
        id={"tooltip-select-2"}
      >
        <div
          className={cn(
            "rotating-container absolute flex flex-row justify-center bottom-[8.3rem] z-20 left-1/2 w-[90%] origin-top will-change-transform",
            lineAngle === 0 && "animateInfiniteWobble",
          )}
          style={{
            transform: `translateX(-50%) translateZ(0) rotate(${lineAngle}deg) `,
            transition: "transform ease-out 400ms",
            textRendering: "optimizeLegibility",
          }}
        >
          <div className={"flex flex-col items-center relative -mr-10"}>
            <div
              className={"absolute -top-full origin-bottom-right -left-3.5 will-change-transform"}
              style={{
                transform: `rotate(${-lineAngle}deg`,
                transition: "transform ease-out 650ms",
                textRendering: "optimizeLegibility",
              }}
            >
              <p className={"font-bold text-xs"} style={{ textRendering: "optimizeLegibility" }}>
                Budget
              </p>
              <p className={"font-light text-[1.25rem]"} style={{ textRendering: "optimizeLegibility" }}>
                {formatDollarAmountStatic(totalBudget, currency)}
              </p>
            </div>
            <BowlSVG
              className={"text-lever w-20 z-20 origin-top animateSettleSwingLeft"}
              style={{ transform: `rotate(${-lineAngle}deg`, transition: "transform ease-out 650ms" }}
            />
          </div>

          <div ref={leverRef} className={"w-[78%] max-w-3xl z-10 h-3 bg-lever"}></div>

          <div className={"flex flex-col items-center relative -ml-10"}>
            <div
              className={"absolute -top-full origin-bottom-left -right-3.5 will-change-transform"}
              style={{
                transform: `rotate(${-lineAngle}deg`,
                transition: "transform ease-out 650ms",
                textRendering: "optimizeLegibility",
              }}
            >
              <p className={"font-bold text-xs"} style={{ textRendering: "optimizeLegibility" }}>
                Income
              </p>
              <p className={"font-light text-[1.25rem]"} style={{ textRendering: "optimizeLegibility" }}>
                {formatDollarAmountStatic(totalIncome, currency)}
              </p>
            </div>
            <BowlSVG
              className={"text-lever w-20 z-20 origin-top animateSettleSwingRight"}
              style={{ transform: `rotate(${-lineAngle}deg`, transition: "transform ease-out 550ms" }}
            />
          </div>
        </div>
        <div
          className={"absolute z-10 bottom-12 left-1/2 -translate-x-1/2 grid place-items-center"}
          style={{ gridTemplateAreas: "stack" }}
        >
          <div className={cn("absolute w-60", budgetLayoutIsSideBySide ? "-top-[115%]" : "-top-full")}>
            {leftToBudget !== 0 ? (
              <>
                <p className={"font-extrabold text-[#FF3F3F] text-lg mb-1"}>
                  {leftToBudget > 0 ? "Give every dollar a job!" : "Budget exceeds income."}
                </p>
                {leftToBudget < 0 ? (
                  <span className={"font-medium text-sm text-primary/50"}>
                    You have over-budgeted by <b>{formatDollarAmountStatic(leftToBudget * -1, currency)}</b>.
                  </span>
                ) : (
                  <span className={"font-medium text-xs"}>
                    You have <b>{formatDollarAmountStatic(leftToBudget, currency)}</b> left to budget.
                  </span>
                )}
              </>
            ) : (
              <>
                <p className={"font-extrabold text-[#058403] text-lg mb-1"}>Every dollar has a job!</p>
                <p className={"font-light text-xs"}>Make sure your budget below reflects your monthly expenditure.</p>
              </>
            )}
          </div>
          <img
            src={activeTriangleFulcrum}
            className={cn("w-36", lineAngle !== 0 && "animate-pulse")}
            style={{ gridArea: "stack" }}
            alt="Triangle fulcrum"
          />
          <PivotOutlineSVG className={"w-36 text-black z-10"} style={{ gridArea: "stack" }} />
        </div>
        {/*<div*/}
        {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
        {/*  style={{ left: leftOffset }}*/}
        {/*></div>*/}
        <div
          className={cn("absolute bottom-[11%] bg-lever rounded-[50%]", lineAngle === 0 && "animateLeftShadowSway")}
          style={{
            left: leftOffset,
            width: baseShadowWidth + lineAngle * 1.3,
            height: (baseShadowWidth + lineAngle * 1.3) / 9,
            transform: `translate(-50%, 50%) scale(${100 + lineAngle}%)`,
            opacity: shadowOpacity,
            transition: "transform 200ms cubic-bezier(0.0, 0.85, 0.95, 1.0)",
          }}
        ></div>
        {/*<div*/}
        {/*  className={"absolute top-0 w-1 h-full -translate-x-full bg-blue-950 transition-all ease-out"}*/}
        {/*  style={{ left: rightOffset }}*/}
        {/*></div>*/}
        <div
          className={cn(
            "absolute bottom-[11%] rounded-[50%] -translate-x-full bg-lever",
            lineAngle === 0 && "animateRightShadowSway",
          )}
          style={{
            left: rightOffset,
            width: baseShadowWidth - lineAngle * 1.3,
            height: (baseShadowWidth + lineAngle * 1.3) / 9,
            transform: `translate(-50%, 50%) scale(${100 - lineAngle}%)`,
            opacity: shadowOpacity,
            transition: "transform 200ms cubic-bezier(0.0, 0.85, 0.95, 1.0)",
          }}
        ></div>

        <div className={"absolute bottom-[10.4%] bg-black rounded-[50%] left-1/2 w-6 h-2 -translate-x-1/2 bg-lever"}></div>
        <img
          src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
          alt=""
          ref={bowlRef}
          className="w-20 origin-top opacity-0 absolute"
          style={{ transform: `rotate(${-lineAngle}deg`, transition: "transform ease-out 650ms" }}
        />
      </div>
    </div>
  );
}
