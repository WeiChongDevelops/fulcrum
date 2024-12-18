import { Outlet } from "react-router-dom";
import HomeNavbar from "../subcomponents/home/shared/HomeNavbar.tsx";
import HomeFooter from "../subcomponents/home/shared/HomeFooter.tsx";
import { getWindowLocation } from "@/utility/util.ts";
import "@/css/Home.css";

/**
 * The main component for the Fulcrum homepage.
 */
export default function Home() {
  return (
    <div className={"relative"} id={"homepage"}>
      <HomeNavbar />
      <Outlet />
      <HomeFooter
        backgroundPath={
          getWindowLocation() === "contact" ? "/static/assets-v2/homepage-assets/footer-background-contact.png" : undefined
        }
      />
    </div>
  );
}
