import FulcrumButton from "../../buttons/FulcrumButton.tsx";

interface HomeFooterProps {
  backgroundPath?: string;
}

/**
 * The footer of the Fulcrum homepage.
 */
export default function HomeFooter({ backgroundPath }: HomeFooterProps) {
  return (
    <div className={"relative w-screen z-30 text-black pt-12 mb-24 sm:mb-16 sm:px-8"}>
      {backgroundPath && (
        <img
          src={backgroundPath}
          className={"absolute -top-6 left-1/2 -translate-x-1/2 -z-10 w-screen h-[150%]"}
          alt="Pricing background"
        />
      )}
      <div className={"homepage-footer grid grid-cols-3 grid-rows-9 justify-items-start items-end gap-y-1"}>
        <img
          className={
            "row-start-1 row-end-5 col-start-1 w-20 ml-[10vw] hover:cursor-pointer hover:-rotate-12 hover:scale-110 transition-all ease-out duration-300"
          }
          src={"/static/assets-v2/fulcrum-logos/fulcrum-icon.png"}
          onClick={() => (window.location.href = "/home/about")}
          alt={"icon"}
        ></img>
        <a href={"/register"} className={"row-start-5 row-end-7 col-start-1 ml-[8.5vw] mt-5"}>
          <FulcrumButton
            displayText={"Sign Up for Free"}
            backgroundColour={"green"}
            optionalTailwind={"homepage-button"}
            hoverShadow={true}
          />
        </a>
        <div className={"row-start-[8] col-start-1 pl-[9vw] text-[0.55rem] text-left"}>
          Copyright © {new Date().getFullYear()}, Fulcrum. All Rights Reserved.
        </div>

        <b className={"row-start-5 col-start-2 pl-[10vw] pb-1"}>Navigation</b>
        <a href={"/home/about"} className={"homepage-footer-link row-start-6 col-start-2 pl-[10vw]"}>
          About
        </a>
        <a href={"/home/pricing"} className={"homepage-footer-link row-start-7 col-start-2 pl-[10vw]"}>
          Pricing
        </a>
        <a href={"/home/contact"} className={"homepage-footer-link row-start-[8] col-start-2 pl-[10vw]"}>
          Contact
        </a>

        <b className={"row-start-5 col-start-3 pl-[10vw] pb-1"}>Additional</b>
        <a
          href={"https://github.com/WeiChongDevelops/Fulcrum"}
          className={"homepage-footer-link row-start-6 col-start-3 pl-[10vw]"}
        >
          GitHub
        </a>
        <a
          href={"https://github.com/WeiChongDevelops/Fulcrum/blob/main/LICENSE"}
          className={"homepage-footer-link row-start-7 col-start-3 pl-[10vw]"}
        >
          License
        </a>
        <a href={"https://weichong.dev/"} className={"homepage-footer-link row-start-[8] col-start-3 pl-[10vw]"}>
          More from Developer
        </a>
        <a href={"/privacy"} className={"homepage-footer-link row-start-[9] col-start-3 pl-[10vw]"}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
