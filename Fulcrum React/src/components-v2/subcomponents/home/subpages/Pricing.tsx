import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import { cn } from "@/utility/util.ts";
import { ChartPieSlice, Headphones, Package, UsersThree } from "@phosphor-icons/react";

/**
 * The Pricing section of the Fulcrum homepage.
 */
export default function Pricing() {
  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={cn(
          "pricing-container flex flex-row justify-around items-center w-screen relative bg-gradient-to-br from-[#77baaa] to-[#bdfccd]  pt-[4vw] pb-[10vw] -mb-[3vw] z-0",
          "min-[1750px]:px-[18vw]",
        )}
      >
        <div className={"pricing-copy"}>
          <p className={"text-5xl text-left font-bold text-black max-w-[24ch]"}>Fulcrum, your way.</p>
          <p className={"text-lg text-black font-bold mt-4 mb-2 font-sans"}>
            Trusted for simplicity and results, Fulcrum powers finances globally.
          </p>
          <p className={"text-sm text-black font-medium mb-4 font-sans"}>Explore which option is right for you.</p>
        </div>
        <div className={"pricing-animation flex flex-col justify-start items-center min-h-96 w-[20vw]"}>
          <div className={"grid place-items-center animate-bobbing"} style={{ gridTemplateAreas: "stack" }}>
            <img
              src="/static/assets-v2/fulcrum-animation/fulcrum-icon-red-v2.webp"
              className={""}
              style={{ gridArea: "stack" }}
              alt=""
            />
            <img
              src="/static/assets-v2/fulcrum-animation/fulcrum-icon-green-v2.webp"
              className={"animate-opacity"}
              style={{ gridArea: "stack" }}
              alt=""
            />
          </div>
          <div className={"bg-black w-[3vw] h-[0.5vw] rounded-[50%] loop-animate-scale mt-1"}></div>
        </div>
        {/*<div className={"pricing-badge-container"}>*/}
        {/*  <img*/}
        {/*    src="/static/assets-v2/fulcrum-logos/inside.png"*/}
        {/*    alt="Fulcrum icon"*/}
        {/*    className={"animated-pricing-icon-inside"}*/}
        {/*  />*/}
        {/*  <img*/}
        {/*    src="/static/assets-v2/fulcrum-logos/outside.png"*/}
        {/*    alt="Fulcrum icon"*/}
        {/*    className={"animated-pricing-icon-outside"}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
      <div className={cn("w-full flex flex-row justify-center items-center gap-10 -mt-24 z-10", "max-[900px]:flex-col")}>
        <div
          className={
            "flex flex-col justify-start items-start gap-4 w-[34rem] min-h-[28rem] py-6 px-8 text-left text-white rounded-lg bg-[#002E38]"
          }
        >
          <p className={"font-bold text-4xl mt-2"}>PERSONAL</p>
          <p className={"flex flex-row gap-1 items-end"}>
            <span className={"text-2xl mb-1"}>$</span>
            <span className={"text-6xl font-medium font-sans tracking-tight"}>0</span>
            <span className={"text-2xl mb-0.5"}>AUD</span>
          </p>
          <p className={"font-bold mb-1 font-sans"}>For individuals looking to reign in financial stress.</p>
          <div className={"flex flex-col justify-start items-center gap-4 font-sans"}>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <ChartPieSlice size={"1.5rem"} />
              <p>Unlimited budget categories.</p>
            </div>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <Package size={"1.5rem"} />
              <p>Up to 16 budget category groups.</p>
            </div>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <Headphones size={"1.5rem"} />
              <p>Standard customer support, with 24-72 hour response times.</p>
            </div>
          </div>
          <a href="/register" className={"w-full mt-auto"}>
            <FulcrumButton displayText={"Get Started"} backgroundColour={"white"} optionalTailwind={"w-full"} hoverShadow />
          </a>
        </div>
        <div
          className={
            "flex flex-col justify-start items-start gap-4 w-[34rem] min-h-[28rem] py-6 px-8 text-left text-white rounded-lg bg-gradient-to-br from-[#002E38] to-[#246660] relative"
          }
        >
          <p className={"font-bold text-4xl mt-2"}>ENTERPRISE</p>
          <p className={"flex flex-row gap-1 items-end"}>
            <span className={"text-2xl mb-1"}>$</span>
            <span className={"text-6xl font-medium font-sans tracking-tight"}>7.50</span>
            <span className={"text-2xl mb-0.5"}>AUD</span>
          </p>
          <p className={"font-bold mb-1 font-sans"}>For organisations looking for optimised collaboration.</p>
          <div className={"flex flex-col justify-start items-center gap-4 font-sans"}>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <ChartPieSlice size={"1.5rem"} />
              <p>Unlimited budget categories.</p>
            </div>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <Package size={"1.5rem"} />
              <p>Unlimited budget category groups.</p>
            </div>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <Headphones size={"1.5rem"} />
              <p>Same-day customer support, with 4-12 hour response times.</p>
            </div>
            <div className={"flex flex-row justify-start items-start w-full gap-3"}>
              <UsersThree size={"1.5rem"} />
              <p>Shared budgeting with support for multi-user access.</p>
            </div>
          </div>
          <FulcrumButton displayText={"Try for Free"} backgroundColour={"white"} optionalTailwind={"w-full mt-auto"} />
          <img
            src="/static/assets-v2/homepage-assets/homepage-highlight-2.png"
            className={"w-14 absolute -bottom-16 -right-20 "}
            alt=""
          />
        </div>
      </div>
      <div className={"flex flex-row gap-2 justify-center mt-14 relative"}>
        <img src="/static/assets-v2/homepage-assets/homepage-highlight-3.png" className={"size-4 mt-1"} alt="" />
        <p className={"w-[41ch] font-medium font-sans"}>
          Personal offers everything you need to get started building unshakable financial habits.
        </p>
      </div>
      <p className={"w-[55ch] font-bold text-sm mt-10 mb-3 font-sans"}>Looking for more?</p>
      <FulcrumButton displayText={"Contact Sales"} optionalTailwind={"w-48"} />
    </div>
  );
}
