import FulcrumButton from "../../buttons/FulcrumButton.tsx";

/**
 * The Pricing section of the Fulcrum homepage.
 */
export default function Pricing() {
  return (
    <div className={"pricing-container w-screen h-[calc(100vh-170px)] flex flex-row p-[8vw] relative -mb-[3vw]"}>
      <img
        src="/src/assets/homepage-assets/pricing-background.png"
        className={"absolute top-0 left-0 -z-10 w-full h-[84vh]"}
        alt="Pricing background"
      />
      <div className={"pricing-copy"}>
        <p className={"text-5xl text-left font-bold text-black ml-2 mb-8"}>It's free, what are you doing here?</p>
        <FulcrumButton
          displayText={"Sign up now."}
          hoverShadow={true}
          backgroundColour={"green"}
          onClick={() => (window.location.href = "/register")}
        />
      </div>
      <div className={"pricing-badge-container"}>
        <img src="/src/assets/fulcrum-logos/inside.png" alt="Fulcrum icon" className={"animated-pricing-icon-inside"} />
        <img src="/src/assets/fulcrum-logos/outside.png" alt="Fulcrum icon" className={"animated-pricing-icon-outside"} />
      </div>
    </div>
  );
}
