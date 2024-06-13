import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import { cn } from "@/utility/util.ts";

/**
 * The Pricing section of the Fulcrum homepage.
 */
export default function Pricing() {
  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={
          "pricing-container flex flex-row justify-around items-center w-screen relative bg-[#C0E2D1] pt-[5vw] px-[20vw] pb-[10vw] -mb-[3vw] z-0"
        }
      >
        <div className={"pricing-copy"}>
          <p className={"text-5xl text-left font-bold text-black ml-2 mb-8"}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
          <a href="/register">
            <FulcrumButton
              displayText={"Get Started"}
              hoverShadow={true}
              backgroundColour={"green"}
              optionalTailwind={"homepage-button"}
            />
          </a>
        </div>
        <div className={"flex flex-col justify-start items-center w-[60vw] min-h-96"}>
          <div className={"grid place-items-center animate-bobbing"} style={{ gridTemplateAreas: "stack" }}>
            <img
              src="/static/assets-v2/fulcrum-animation/fulcrum-icon-red-v2.webp"
              className={"w-[20vw]"}
              style={{ gridArea: "stack" }}
              alt=""
            />
            <img
              src="/static/assets-v2/fulcrum-animation/fulcrum-icon-green-v2.webp"
              className={"w-[20vw] loop-animate-opacity"}
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
      <div className={cn("w-full flex flex-row justify-center items-center gap-12 -mt-24 z-10")}>
        <div className={"w-[28vw] aspect-[5/3] bg-black rounded-lg"}></div>
        <div className={"w-[28vw] aspect-[5/3] bg-black rounded-lg"}></div>
      </div>
      <div className={"flex flex-row justify-center mt-14 relative"}>
        <img src="/static/assets-v2/homepage-assets/homepage-highlight-3.png" className={"size-5"} alt="" />
        <p className={"w-[55ch] font-medium"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, rerum, veritatis. A ad, odio omnis qui ratione
          rerum ullam.
        </p>
        <img
          src="/static/assets-v2/homepage-assets/homepage-highlight-2.png"
          className={"w-14 absolute -top-12 -right-60"}
          alt=""
        />
      </div>
      <FulcrumButton displayText={"Lorem ipsum"} optionalTailwind={"w-48 mt-6"} />
    </div>
  );
}
