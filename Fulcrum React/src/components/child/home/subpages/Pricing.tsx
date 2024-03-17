import FulcrumButton from "../../other/FulcrumButton.tsx";

export default function Pricing() {
    return (
        <div className={"w-screen h-[75vh] flex flex-row p-32 relative -mb-20"}>
            <img src="/src/assets/homepage-assets/pricing-background.png" className={"absolute top-0 left-0 -mt-28 -z-10 w-full h-full"} alt="Pricing background"/>
            <div className={"flex flex-col justify-start items-start max-w-[35vw] text-left"}>
                <p className={"text-5xl text-left font-bold text-black ml-2 mb-8"}>It's free, what are you doing here?</p>
                <FulcrumButton displayText={"Sign up now."} hoverShadow={true} backgroundColour={"green"} onClick={() => window.location.href = "/register"}/>
            </div>
            <div className={"flex flex-col justify-center items-center w-[60vw]"}>
                <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" alt="Fulcrum icon" className={"animated-pricing-icon"}/>
            </div>
        </div>
    );
}