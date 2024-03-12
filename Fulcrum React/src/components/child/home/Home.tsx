import {Outlet} from "react-router-dom";
import HomeNavbar from "./shared/HomeNavbar.tsx";
import HomeFooter from "./shared/HomeFooter.tsx";

export default function Home() {
    return (
        <div>
            <HomeNavbar/>
            <Outlet/>
            <HomeFooter/>
        </div>
    );
}