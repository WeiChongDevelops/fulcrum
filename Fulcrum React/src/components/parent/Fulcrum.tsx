import { Outlet } from "react-router-dom";
import NavbarUpper from "../child/navbar/NavbarUpper.tsx";
import NavbarLower from "../child/navbar/NavbarLower.tsx";
import Loader from "../child/other/Loader.tsx";
import { ErrorBoundary } from "../child/other/ErrorBoundary.tsx";
import { UserPreferences } from "@/utility/types.ts";
import { useContext, useEffect } from "react";
import { getSessionEmailOrNull } from "@/utility/api.ts";
import { LocationContext, useLocation } from "@/utility/util.ts";

interface FulcrumProps {
  userPreferences: UserPreferences;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function Fulcrum({ userPreferences, isAnyLoading }: FulcrumProps) {
  // const routerLocation = useLocation();
  // if (isAnyLoading) {
  //   return <Loader isLoading={isAnyLoading} isDarkMode={userPreferences.darkModeEnabled} />;
  // }
  //
  // useEffect(() => {
  //   getSessionEmailOrNull()
  //     .then((result) => result === null && (window.location.href = "/login"))
  //     .catch(() => (window.location.href = "/login"));
  // }, [routerLocation]);
  //
  // return (
  //   <div
  //     className={`transition-filter duration-500 ease-in-out min-h-screen ${userPreferences.accessibilityEnabled && "accessibility-enabled"}`}
  //   >
  //     <NavbarUpper userPreferences={userPreferences} />
  //     <NavbarLower darkModeEnabled={userPreferences.darkModeEnabled} />
  //     {!window.location.href.includes("tools") && (
  //       <div id="background" className={`${userPreferences.darkModeEnabled ? "bg-dark-2" : "bg-light"}`}></div>
  //     )}
  //
  //     <ErrorBoundary>
  //       <Outlet />
  //     </ErrorBoundary>
  //   </div>
  // );
  return <></>;
}
