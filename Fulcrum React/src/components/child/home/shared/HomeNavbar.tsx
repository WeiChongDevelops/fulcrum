import FulcrumButton from "../../buttons/FulcrumButton.tsx";
import "../../../../css/Home.css";

/**
 * The header of the Fulcrum homepage.
 */
export default function HomeNavbar() {
  return (
    <div className={"flex flex-row justify-between items-center py-4 bg-white border-b-black border-2 w-screen"}>
      <div className={"flex flex-1 justify-start item-center ml-4 sm:ml-16"}>
        <div className={"flex flex-row justify-start w-40 transition-all cursor-pointer hover:-rotate-3 hover:scale-110"}>
          <a href={"/home/about"}>
            <img
              src={`/static/assets/fulcrum-logos/fulcrum-long-black.webp`}
              alt="Fulcrum logo in navbar"
              className="w-full h-auto"
            />
          </a>
        </div>
      </div>
      <div className={"flex flex-row flex-1 justify-center items-center text-black font-semibold text-lg gap-8"}>
        <a className={"homepage-navbar-link"} href={"/home/about"}>
          About
        </a>
        <a className={"homepage-navbar-link"} href={"/home/pricing"}>
          Pricing
        </a>
        <a className={"homepage-navbar-link"} href={"/home/contact"}>
          Contact
        </a>
        <a className={"homepage-navbar-link"} href={"/home/faq"}>
          FAQ
        </a>
      </div>
      <div className={"flex-1 flex flex-row justify-end mr-4 sm:mr-16"}>
        <a href={window.location.origin + "/register"}>
          <FulcrumButton displayText={"Sign Up for Free"} backgroundColour={"green"} hoverShadow={true} />
        </a>
      </div>
    </div>
  );
}
