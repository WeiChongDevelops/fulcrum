import { ErrorBoundary } from "../subcomponents/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import SideBar from "@/components-v2/subcomponents/other/SideBar.tsx";
import { useContext, useEffect, useState } from "react";
import Loader from "@/components-v2/subcomponents/other/Loader.tsx";
import { cn, LocationContext, SideBarIsOpenContext, useEmail } from "@/utility/util.ts";
import { getSessionEmailOrNullDirect } from "@/utility/supabase-client.ts";
import { UserPreferences } from "@/utility/types.ts";
import { useQueryClient } from "@tanstack/react-query";
import * as Frigade from "@frigade/react";

interface FulcrumV2Props {
  isAnyLoading: boolean;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ isAnyLoading }: FulcrumV2Props) {
  const routerLocation = useContext(LocationContext);
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [sideBarOpen, setSideBarOpen] = useState(true);

  useEffect(() => {
    getSessionEmailOrNullDirect().then((result) => {
      if (result === null) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    });
  }, [routerLocation]);

  if (isAnyLoading) {
    return <Loader isLoading={isAnyLoading} isDarkMode={userPreferences.darkModeEnabled} />;
  }

  return (
    <ErrorBoundary>
      <Frigade.Tour flowId="flow_Yof1mJfk" zIndex={1000} style={{ textAlign: "left" }} />
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
