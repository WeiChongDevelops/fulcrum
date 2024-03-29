import { Outlet } from "react-router-dom";
import HomeNavbar from "./shared/HomeNavbar.tsx";
import HomeFooter from "./shared/HomeFooter.tsx";
import { getWindowLocation } from "../../../util.ts";

/**
 * The main component for the Fulcrum homepage.
 */
export default function Home() {
  return (
    <>
      <HomeNavbar />
      <Outlet />
      <HomeFooter
        backgroundPath={
          getWindowLocation() === "contact"
            ? "/src/assets/homepage-assets/footer-background-contact.png"
            : undefined
        }
      />
    </>
  );
}
