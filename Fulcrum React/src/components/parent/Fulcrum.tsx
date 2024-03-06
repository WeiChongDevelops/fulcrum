import {Dispatch, SetStateAction, useEffect} from "react";
import {Outlet} from "react-router-dom";
import {getSessionEmail, PublicUserData} from "../../util.ts";
import NavbarUpper from "../navbar/NavbarUpper.tsx";
import NavbarLower from "../navbar/NavbarLower.tsx";

interface FulcrumProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
}

/**
 * The Fulcrum component which renders the navigation bars and the active application section.
 */
export default function Fulcrum({ publicUserData, setPublicUserData, email, setEmail }: FulcrumProps) {

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
    }, []);

    useEffect(() => {
        sessionStorage.setItem("email", email);
    }, [email]);

    return (
        <div className={`transition-filter duration-500 ease-in-out min-h-screen ${publicUserData.accessibilityEnabled && "accessibility-enabled"}`}>
            <NavbarUpper publicUserData={publicUserData} setPublicUserData={setPublicUserData} email={email}/>
            <NavbarLower/>
            {!window.location.href.includes("tools") && <div id="background" className={`${publicUserData.darkModeEnabled ? "bg-dark" : "bg-light"}`}></div>}
            <Outlet/>
        </div>
    );
}