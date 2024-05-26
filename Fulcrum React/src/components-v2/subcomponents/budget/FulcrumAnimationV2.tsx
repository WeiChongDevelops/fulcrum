import useAnimationDataV2 from "@/hooks/queries/useAnimationDataV2.ts";
import { cn } from "@/lib/utils.ts";
import { formatDollarAmountStatic } from "@/utility/util.ts";

interface FulcrumAnimationV2Props {
  sideBarOpen: boolean;
  totalIncome: number;
  totalBudget: number;
  currency: string;
  budgetLayoutIsSideBySide: boolean;
}

export default function FulcrumAnimationV2({
  sideBarOpen,
  totalIncome,
  totalBudget,
  currency,
  budgetLayoutIsSideBySide,
}: FulcrumAnimationV2Props) {
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
    <div className={"z-10 px-32 py-40 rounded-xl transition-opacity enableFadeIn h-96"} ref={containerRef}>
      <div
        className={cn(
          "absolute flex flex-row justify-center bottom-[8.3rem] z-20 left-1/2 w-[90%] origin-top",
          lineAngle === 0 && "animateInfiniteWobble",
        )}
        style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)`, transition: "transform ease-out 400ms" }}
      >
        <div className={"flex flex-col items-center relative -mr-10"}>
          {/*<div className={"absolute -top-full "} style={{ transform: `rotate(${-lineAngle}deg` }}>*/}
          <div
            className={"absolute -top-full origin-bottom-right -left-3.5"}
            style={{ transform: `rotate(${-lineAngle}deg` }}
          >
            <p className={"font-bold text-xs"}>Budget</p>
            <p className={"font-light text-[1.25rem]"}>{formatDollarAmountStatic(totalBudget, currency)}</p>
          </div>
          <img
            src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
            ref={bowlRef}
            alt="Fulcrum bowl"
            className="w-20 z-20 origin-top animateSettleSwingLeft"
            style={{ transform: `rotate(${-lineAngle}deg`, transition: "transform ease-out 650ms" }}
          />
        </div>

        <div ref={leverRef} className={"w-[75%] max-w-3xl z-10 h-3 bg-black "}></div>

        <div className={"flex flex-col items-center relative -ml-10"}>
          <div
            className={"absolute -top-full origin-bottom-left -right-3.5"}
            style={{ transform: `rotate(${-lineAngle}deg` }}
          >
            <p className={"font-bold text-xs"}>Income</p>
            <p className={"font-light text-[1.25rem]"}>{formatDollarAmountStatic(totalIncome, currency)}</p>
          </div>
          <img
            src={`/static/assets-v2/fulcrum-animation/fulcrum-basket-black.webp`}
            alt="Fulcrum bowl"
            className="w-20 z-20 origin-top animateSettleSwingRight"
            style={{ transform: `rotate(${-lineAngle}deg`, transition: "transform ease-out 550ms" }}
          />
        </div>
      </div>
      <div
        className={"absolute z-10 bottom-12 left-1/2 -translate-x-1/2 grid place-items-center"}
        style={{ gridArea: "stack" }}
      >
        <div className={cn("absolute w-60", budgetLayoutIsSideBySide ? "-top-[115%]" : "-top-full")}>
          {leftToBudget !== 0 ? (
            <>
              <p className={"font-extrabold text-red-6000 mb-1"}>Give every dollar a job!</p>
              {leftToBudget < 0 ? (
                <span className={"font-medium text-sm"}>
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
              <p className={"font-extrabold text-emerald-600 mb-1"}>Every dollar has a job!</p>
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
        <img
          src="/static/assets-v2/fulcrum-animation/fulcrum-icon-outline.svg"
          className={"w-36"}
          style={{ gridArea: "stack" }}
          alt=""
        />
      </div>
      {/*<div*/}
      {/*  className={"absolute top-0 w-1 h-full -translate-x-1/2 bg-blue-950 transition-all ease-out"}*/}
      {/*  style={{ left: leftOffset }}*/}
      {/*></div>*/}
      <div
        className={cn("absolute bottom-[11%] bg-black rounded-[50%]", lineAngle === 0 && "animateLeftShadowSway")}
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
          "absolute bottom-[11%] bg-black rounded-[50%] -translate-x-full",
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
      <div className={"absolute bottom-[10.4%] bg-black rounded-[50%] left-1/2 w-6 h-2 -translate-x-1/2"}></div>
    </div>
  );
}
