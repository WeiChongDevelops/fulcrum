import FulcrumButton from "../../other/FulcrumButton.tsx";

export default function Pricing() {
    return (
        <div className={"w-screen h-[calc(100vh-100px)] flex flex-row p-32 relative -mb-20"}>
            <img src="/src/assets/homepage-assets/pricing-background.png" className={"absolute top-0 left-0 -mt-28 -z-10 w-full h-full"} alt="Pricing background"/>
            <div className={"flex flex-col justify-start items-start max-w-[35vw] text-left"}>
                <p className={"text-5xl text-left font-bold text-black ml-2 mb-8"}>It's free, what are you doing here?</p>
                <FulcrumButton displayText={"Sign up now."} hoverShadow={true} backgroundColour={"green"} onClick={() => window.location.href = "/register"}/>
            </div>
            <div className={"pricing-badge-container flex flex-col justify-center items-center w-[60vw]"}>
                <img src="/src/assets/fulcrum-logos/inside.svg" alt="Fulcrum icon" className={"animated-pricing-icon-inside"}/>
                <img src="/src/assets/fulcrum-logos/outside.svg" alt="Fulcrum icon" className={"animated-pricing-icon-outside"}/>
            </div>
        </div>
    );
}