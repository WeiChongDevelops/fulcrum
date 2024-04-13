import { Outlet } from "react-router-dom";
import { PublicUserData } from "../../util.ts";
import NavbarUpper from "../child/navbar/NavbarUpper.tsx";
import NavbarLower from "../child/navbar/NavbarLower.tsx";
import Loader from "../child/other/Loader.tsx";
import { ErrorBoundary } from "./ErrorBoundary.tsx";

interface FulcrumProps {
  publicUserData: PublicUserData;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function Fulcrum({ publicUserData, isAnyLoading }: FulcrumProps) {
  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={publicUserData.darkModeEnabled} />;
  }

  return (
    <div
      className={`transition-filter duration-500 ease-in-out min-h-screen ${publicUserData.accessibilityEnabled && "accessibility-enabled"}`}
    >
      <NavbarUpper publicUserData={publicUserData} />
      <NavbarLower darkModeEnabled={publicUserData.darkModeEnabled} />
      {!window.location.href.includes("tools") && (
        <div id="background" className={`${publicUserData.darkModeEnabled ? "bg-dark-2" : "bg-light"}`}></div>
      )}

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
