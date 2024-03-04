import DarkModeToggle from "../toggles/DarkModeToggle.tsx";
import FulcrumButton from "../other/FulcrumButton.tsx";
import {logoutOnClick, PublicUserData} from "../../util.ts";
import {Dispatch, SetStateAction} from "react";

interface NavbarUpperProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
    email: string;
}

export default function NavbarUpper( { publicUserData, setPublicUserData, email }: NavbarUpperProps) {
    return (
        <nav className={`flex flex-row flex-shrink justify-between items-center h-[55px] py-1 ${publicUserData.darkModeEnabled ?  "bg-dark" : "bg-light"}`}>
            <div className="flex-1 ml-10">
                <DarkModeToggle publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>
            </div>
            <img src={`/src/assets/fulcrum-logos/fulcrum-long-${publicUserData.darkModeEnabled ? "white" : "black"}.webp`} alt="Fulcrum logo in navbar"
                 className="navbar-fulcrum-logo"
                 onClick={() => window.location.href = "/budget"}/>
            <div className="flex-1 text-right">
                <div className="flex justify-end items-center mr-8">
                    <p className={`navbar-email select-none ${publicUserData.darkModeEnabled ? "text-white": "text-black"}`}>{email}</p>
                    <img
                        src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-${publicUserData.darkModeEnabled ? "white" : "black"}.svg`}
                        className="profile-icon h-12" alt="Profile icon"/>
                    {email != "" ? <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>
                        : <FulcrumButton displayText="Register"
                                         onClick={() => window.location.href = "/register"}/>}
                </div>
            </div>
        </nav>
    );
}