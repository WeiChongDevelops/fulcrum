import DarkModeToggle from "../toggles/DarkModeToggle.tsx";
import FulcrumButton from "../other/FulcrumButton.tsx";
import { EmailContext } from "../../../utility/util.ts";
import { useContext } from "react";
import { PublicUserData } from "../../../utility/types.ts";
import { handleUserLogout } from "../../../utility/api.ts";

interface NavbarUpperProps {
  publicUserData: PublicUserData;
}

/**
 * The upper navbar, which displays the dark-mode toggle, Fulcrum logo, user email, profile icon and sign-out button.
 */
export default function NavbarUpper({ publicUserData }: NavbarUpperProps) {
  const email = useContext(EmailContext);

  return (
    <nav
      className={`flex flex-row flex-shrink justify-between items-center h-[55px] py-1 ${publicUserData.darkModeEnabled ? "bg-dark" : "bg-light"}`}
    >
      <div className="flex-1 ml-10">
        <DarkModeToggle publicUserData={publicUserData} />
      </div>
      <img
        src={`/src/assets/fulcrum-logos/fulcrum-long-${publicUserData.darkModeEnabled ? "white" : "black"}.webp`}
        alt="Fulcrum logo in navbar"
        className="app-navbar-fulcrum-logo"
        onClick={() => (window.location.href = "/budget")}
      />
      <div className="flex-1 text-right">
        <div className="flex justify-end items-center mr-8">
          <p className={`navbar-email select-none ${publicUserData.darkModeEnabled ? "text-white" : "text-black"}`}>
            {email}
          </p>
          <img
            src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-${publicUserData.darkModeEnabled ? "white" : "black"}.svg`}
            className="profile-icon h-12"
            alt="Profile icon"
          />
          {email != "" ? (
            <FulcrumButton displayText="Log Out" onClick={handleUserLogout} />
          ) : (
            <FulcrumButton displayText="Register" onClick={() => (window.location.href = "/register")} />
          )}
        </div>
      </div>
    </nav>
  );
}
