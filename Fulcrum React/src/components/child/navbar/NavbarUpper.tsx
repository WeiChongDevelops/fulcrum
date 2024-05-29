import DarkModeToggle from "../toggles/DarkModeToggle.tsx";
import FulcrumButton from "../buttons/FulcrumButton.tsx";
import { EmailContext } from "../../../utility/util.ts";
import { useContext } from "react";
import { UserPreferences } from "../../../utility/types.ts";
import { handleUserLogout } from "../../../utility/api.ts";

interface NavbarUpperProps {
  userPreferences: UserPreferences;
}

/**
 * The upper navbar, which displays the dark-mode toggle, Fulcrum logo, user email, profile icon and sign-out button.
 */
export default function NavbarUpper({ userPreferences }: NavbarUpperProps) {
  const email = useContext(EmailContext);

  return (
    <nav
      className={`flex flex-row flex-shrink justify-between items-center h-[55px] py-1 ${userPreferences.darkModeEnabled ? "bg-dark" : "bg-light"}`}
    >
      <div className="flex-1 ml-10">
        <DarkModeToggle userPreferences={userPreferences} />
      </div>
      <img
        src={`/static/assets-v2/fulcrum-logos/fulcrum-long-${userPreferences.darkModeEnabled ? "white" : "black"}.webp`}
        alt="Fulcrum logo in navbar"
        className="app-navbar-fulcrum-logo"
        onClick={() => (window.location.href = "/home/about")}
      />
      <div className="flex-1 text-right">
        <div className="flex justify-end items-center mr-8">
          <p className={`navbar-email text-sm select-none ${userPreferences.darkModeEnabled ? "text-white" : "text-black"}`}>
            {email}
          </p>
          <img
            src={`/static/assets-v2/profile-icons/${userPreferences.profileIconFileName.slice(0, -4)}-${userPreferences.darkModeEnabled ? "white" : "black"}.svg`}
            className="profile-icon h-12"
            alt="Profile icon"
          />
          <FulcrumButton displayText="Log Out" onClick={handleUserLogout} optionalTailwind={"text-sm"} />
        </div>
      </div>
    </nav>
  );
}
