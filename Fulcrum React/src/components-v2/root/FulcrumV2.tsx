import { ErrorBoundary } from "../subcomponents/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import SideBar from "@/components-v2/subcomponents/other/SideBar.tsx";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UserPreferences } from "@/utility/types.ts";
import Loader from "@/components-v2/subcomponents/other/Loader.tsx";
import { getSessionEmailOrNull } from "@/utility/api.ts";
import { LocationContext, SideBarIsOpenContext } from "@/utility/util.ts";
import { Toaster } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "@/lib/utils.ts";
import { getSessionEmailOrNullDirect } from "@/utility/supabase-client.ts";

interface FulcrumV2Props {
  userPreferences: UserPreferences;
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ userPreferences, isAnyLoading }: FulcrumV2Props) {
  const routerLocation = useContext(LocationContext);

  const [sideBarOpen, setSideBarOpen] = useState(true);

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={userPreferences.darkModeEnabled} />;
  }

  useEffect(() => {
    getSessionEmailOrNullDirect().then((result) => {
      if (result === null) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    });
  }, [routerLocation]);

  return (
    <ErrorBoundary>
      <SideBarIsOpenContext.Provider value={sideBarOpen}>
        <div
          className={cn(
            "flex flex-row relative transition-all font-source",
            userPreferences.accessibilityEnabled && "saturate-0 contrast-125",
            userPreferences.darkModeEnabled && "dark",
          )}
        >
          <div className={"fixed top-0 w-screen bg-gray-400 h-[6vh]"}></div>
          <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
          <div
            className={cn(
              "absolute top-0 right-0 min-h-screen text-foreground bg-background z-40",
              sideBarOpen ? "w-[calc(100vw-13rem)]" : "w-[calc(100vw-5rem)]",
            )}
          >
            <Outlet />
          </div>
        </div>
      </SideBarIsOpenContext.Provider>
    </ErrorBoundary>
  );
}
