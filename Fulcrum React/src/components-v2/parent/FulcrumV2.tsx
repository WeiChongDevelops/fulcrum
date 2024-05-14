import { ErrorBoundary } from "../../components/child/other/ErrorBoundary.tsx";
import { Outlet } from "react-router-dom";
import NavigationMenuV2 from "@/components-v2/child/other/NavigationMenuV2.tsx";
import { useState } from "react";

interface FulcrumV2Props {
  navMenuOpen: boolean;
  toggleNavMenu: () => void;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function FulcrumV2({ navMenuOpen, toggleNavMenu }: FulcrumV2Props) {
  return (
    <ErrorBoundary>
      <>
        <div className={"flex flex-row"}>
          <NavigationMenuV2 navMenuOpen={navMenuOpen} toggleNavMenu={toggleNavMenu} />
          <div className={`h-screen transition-all duration-200 ease-out ${navMenuOpen ? "w-[82vw]" : "w-full"}`}>
            <Outlet />
          </div>
        </div>
      </>
    </ErrorBoundary>
  );
}
