import { ErrorBoundary } from "../../components/child/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import NavigationMenuV2 from "@/components-v2/subcomponents/other/NavigationMenuV2.tsx";
import { useState } from "react";
import { PublicUserData } from "@/utility/types.ts";

interface FulcrumV2Props {
  publicUserData: PublicUserData;
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ publicUserData, navMenuOpen, toggleNavMenu }: FulcrumV2Props) {
  return (
    <ErrorBoundary>
      <>
        <div className={"flex flex-row"}>
          <NavigationMenuV2 publicUserData={publicUserData} navMenuOpen={navMenuOpen} toggleNavMenu={toggleNavMenu} />
          <div
            className={`absolute right-0 top-0 h-screen transition-all duration-200 ease-out ${navMenuOpen ? "w-[calc(100vw-16rem)]" : "w-full"}`}
          >
            <Outlet />
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
}
