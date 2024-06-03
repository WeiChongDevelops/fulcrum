import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import { useContext, useEffect, useRef } from "react";
import { LocationContext, useLocation } from "../../../../../utility/util.ts";

/**
 * Upper-page component displaying sales copy and a concise version of the user steps.
 */
export default function UpperCopy() {
  const spotlightContainerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const body = document.querySelector("body")!;
  const routerLocation = useLocation();

  useEffect(() => {
    function shiftCursorSpotlight(e: MouseEvent) {
      spotlightRef.current!.style.opacity = "1";
      spotlightRef.current!.style.left = `${e.clientX - spotlightContainerRef.current!.getBoundingClientRect().left}px`;
      spotlightRef.current!.style.top = `${e.clientY - spotlightContainerRef.current!.getBoundingClientRect().top}px`;
    }
    const hideSpotlight = () => {
      spotlightRef.current!.style.opacity = "0";
    };

    document.addEventListener("mousemove", shiftCursorSpotlight);
    body.addEventListener("scroll", hideSpotlight);
    return () => {
      document.removeEventListener("mousemove", shiftCursorSpotlight);
      body.removeEventListener("scroll", hideSpotlight);
    };
  }, [routerLocation]);

  return (
    <div className={"flex flex-col justify-start items-center w-screen px-20 pt-40 pb-6 text-black relative"}>
      <div className={"upper-copy-first-row"}>
        <div className={"upper-copy-left-col mr-8 sm:mr-32"}>
          <img
            src="/assets-v2/homepage-assets/homepage-highlight-1.png"
            className={"w-8 absolute left-[100%] top-0"}
            alt="Page highlight"
          />
          <p className={"text-5xl text-left font-bold"}>It's time to start paying yourself first.</p>
          <p className={"my-6 font-bold"}>180,000 others have found their balance.</p>
          <div className={"flex flex-row justify-start items-center mb-8"}>
            <img src="/assets-v2/homepage-assets/testimonials.svg" alt="Testimonials" className={"w-32"} />
            <div
              className={
                "flex flex-row justify-start items-center rounded-full bg-[#F7FFFAFF] py-2 pl-2.5 pr-6 ml-2 relative"
              }
            >
              <img
                src="/assets-v2/homepage-assets/kylie.webp"
                className={
                  "rounded-full border-4 border-white w-20 hover:scale-110 transition-transform ease-out duration-150"
                }
                alt="Testimonial user"
              />
              <div className={"flex flex-col justify-center items-start ml-4 w-80"}>
                <p className={"text-sm font-medium text-left"}>
                  "The financial stress relief has been an absolute game changer for my family and I."
                </p>
                <p className={"font-bold text-xs ml-0.5 mt-1"}>Kylie Capelli</p>
              </div>
            </div>
          </div>
          <p className={"font-medium"}>Integrated Budgeting and Expense Tracking</p>
        </div>
        <div className={"upper-instructions-container"}>
          <div className={"upper-instruction"}>
            <div className={"homepage-number-circle"}>1</div>
            <p>Sign up for a free account.</p>
          </div>
          <div className={"upper-instruction mt-4"}>
            <div className={"homepage-number-circle"}>2</div>
            <p>Estimate your income and create your budget, giving every dollar a job.</p>
          </div>
          <div className={"upper-instruction mt-4"}>
            <div className={"homepage-number-circle"}>3</div>
            <p>Log your expenses over time, checking in with your budget to stay on track.</p>
          </div>
          <div className={"upper-instruction mt-4"}>
            <div className={"homepage-number-circle"}>4</div>
            <p>Watch as your savings grow and your financial stress fade away.</p>
          </div>
          <div>
            <a href={"/register"}>
              <FulcrumButton
                displayText={"Start Saving"}
                backgroundColour={"green"}
                hoverShadow={true}
                optionalTailwind={
                  "homepage-button shadow-[0.4rem_0.4rem_0px_black] mt-8 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[0.75rem_0.75rem_0px_black]"
                }
              />
            </a>
            <img
              src="/assets-v2/homepage-assets/homepage-highlight-2.png"
              className={"w-8 absolute left-[90%] bottom-0"}
              alt="Page highlight"
            />
          </div>
        </div>
      </div>
      <div
        className={
          "relative overflow-hidden flex flex-col justify-center items-center rounded-lg w-[90vw] h-60 bg-[#282d33] text-white text-xl shadow-[1rem_1rem_0_black] select-none mt-40"
        }
        ref={spotlightContainerRef}
      >
        <div className={"circle-spotlight"} ref={spotlightRef}></div>
        <img
          src="/assets-v2/homepage-assets/complicated.png"
          className={"w-[30rem] sm:w-[42rem] mb-3 relative z-10"}
          alt="Homepage copy"
        />
        <p className={"font-extrabold text-md mt-8 text-[#44b775] z-10"}>
          Find <span className={"underline underline-offset-2 relative z-10"}>your</span> balance.
        </p>
      </div>
      <div className={"flex flex-row justify-start items-center relative mt-20 font-bold text-lg sm:text-[1.7rem]"}>
        <img
          src="/assets-v2/homepage-assets/homepage-highlight-3.png"
          className={"w-2 sm:w-5 mr-6 mb-3"}
          alt="Page highlight"
        />
        <div className={"flex flex-row justify-center"}>
          <p>All the features you need, for free,</p>
          <div className={"flex flex-col items-center sm:ml-1"}>
            <p>forever.</p>
            <img
              src="/assets-v2/homepage-assets/homepage-highlight-4.png"
              className={"w-20 sm:w-[6.5rem] -bottom-[1rem]"}
              alt="Page highlight"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
