import { ErrorBoundary } from "../../components/child/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import NavigationMenuV2 from "@/components-v2/subcomponents/other/NavigationMenuV2.tsx";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { PublicUserData } from "@/utility/types.ts";
import Loader from "@/components/child/other/Loader.tsx";
import { getSessionEmailOrNull } from "@/utility/api.ts";
import { LocationContext, NavMenuIsOpenContext } from "@/utility/util.ts";
import { Toaster } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FulcrumV2Props {
  publicUserData: PublicUserData;
  navMenuOpen: boolean;
  setNavMenuOpen: Dispatch<SetStateAction<boolean>>;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ publicUserData, navMenuOpen, setNavMenuOpen, isAnyLoading }: FulcrumV2Props) {
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
      <NavMenuIsOpenContext.Provider value={navMenuOpen}>
        <div className={"flex flex-row relative transition-all"}>
          <div className={"fixed top-0 w-screen bg-gray-400 h-[6vh]"}></div>
          <NavigationMenuV2 publicUserData={publicUserData} navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} />
          <div
            className={`absolute top-0 right-0 min-h-screen z-40 ${navMenuOpen ? "w-[calc(100vw-14rem)]" : "w-[calc(100vw-5rem)]"}`}
          >
            <Outlet />
          </div>
        </div>
      </NavMenuIsOpenContext.Provider>
    </ErrorBoundary>
  );
}
