import { ErrorBoundary } from "../../components/child/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import NavigationMenuV2 from "@/components-v2/subcomponents/other/NavigationMenuV2.tsx";
import { useContext, useEffect } from "react";
import { PublicUserData } from "@/utility/types.ts";
import Loader from "@/components/child/other/Loader.tsx";
import { getSessionEmailOrNull } from "@/utility/api.ts";
import { LocationContext } from "@/utility/util.ts";

interface FulcrumV2Props {
  publicUserData: PublicUserData;
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ publicUserData, navMenuOpen, toggleNavMenu, isAnyLoading }: FulcrumV2Props) {
  const routerLocation = useContext(LocationContext);

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={publicUserData.darkModeEnabled} />;
  }

  useEffect(() => {
    getSessionEmailOrNull()
      .then((result) => result === null && (window.location.href = "/login"))
      .catch(() => (window.location.href = "/login"));
  }, [routerLocation]);

  return (
    <ErrorBoundary>
      <>
        <div className={"flex flex-row"}>
          <NavigationMenuV2 publicUserData={publicUserData} navMenuOpen={navMenuOpen} toggleNavMenu={toggleNavMenu} />
          <div
            className={`absolute right-0 top-0 min-h-screen transition-all duration-200 ease-out ${navMenuOpen ? "w-[calc(100vw-14rem)]" : "w-full"}`}
          >
            <Outlet />
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
}
