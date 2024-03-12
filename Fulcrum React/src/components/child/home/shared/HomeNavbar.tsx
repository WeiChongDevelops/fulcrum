import FulcrumButton from "../../other/FulcrumButton.tsx";
import "../../../../css/Home.css"

export default function HomeNavbar() {
    return (
        <div className={"flex flex-row justify-between items-center py-4 bg-white border-b-black border-2"}>
            <div className={"flex flex-1 justify-start item-center ml-4 sm:ml-16"}>
                <div className={"flex flex-row justify-start w-40 transition-all cursor-pointer hover:-rotate-3"}>
                <img src={`/src/assets/fulcrum-logos/fulcrum-long-black.webp`} alt="Fulcrum logo in navbar"
                className="w-full h-auto"
                     onClick={() => window.location.href = "/home/about"}/>
                </div>
            </div>
            <div className={"flex flex-row flex-1 justify-center items-center text-black font-semibold text-lg"}>
                <a href={"http://localhost:5173/home/about"} className={"homepage-navbar-link"}>About</a>
                <a href={"http://localhost:5173/home/pricing"} className={"mx-12 homepage-navbar-link"}>Pricing</a>
                <a href={"http://localhost:5173/home/contact"} className={"homepage-navbar-link"} >Contact</a>
            </div>
            <div className={"flex-1 flex flex-row justify-end mr-4 sm:mr-16"}>
                <FulcrumButton displayText={"Sign Up for Free"} backgroundColour={"green"} onClick={() => window.location.href = "http://localhost:5173/register"} hoverShadow={true}/>
            </div>
        </div>
    );
}