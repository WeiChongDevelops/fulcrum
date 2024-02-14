import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {getPublicUserData, getSessionEmail, getWindowLocation, logoutOnClick, PublicUserData} from "../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";
import DarkModeToggle from "./DarkModeToggle.tsx";

interface FulcrumProps {
    publicUserData: PublicUserData;
    setPublicUserData: Dispatch<SetStateAction<PublicUserData>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
}

export default function Fulcrum({ publicUserData, setPublicUserData, email, setEmail }: FulcrumProps) {
    const [hoveredNavButton, setHoveredNavButton] = useState("");

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
        getPublicUserData()
            .then(response => setPublicUserData(response));
    }, []);

    useEffect(() => {
        sessionStorage.setItem("email", email);
    }, [email]);

    function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.target as HTMLButtonElement;
        setHoveredNavButton(button.id);
    }

    function handleMouseLeave() {
        setHoveredNavButton("");
    }

    return (
        <div className={`transition-filter duration-500 ease-in-out ${publicUserData.accessibilityEnabled && "accessibility-enabled"}`}>
            <nav className={`flex flex-row justify-between items-center py-1 ${publicUserData.darkModeEnabled ?  "bg-dark" : "bg-light"}`}>
                <div className="flex-1 ml-10">
                    <DarkModeToggle publicUserData={publicUserData} setPublicUserData={setPublicUserData}/>
                </div>
                <img src={`/src/assets/fulcrum-logos/fulcrum-long-${publicUserData.darkModeEnabled ? "white" : "black"}.webp`} alt="Fulcrum logo in navbar"
                     className="navbar-fulcrum-logo mr-12  select-none hover:cursor-pointer "
                     onClick={() => window.location.href = "/budget"}></img>
                <div className="flex-1 text-right">
                    <div className="flex justify-end items-center mr-8">
                        <p className={`select-none ${publicUserData.darkModeEnabled ? "text-white": "text-black"}`}>{email}</p>
                        <img
                            src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-${publicUserData.darkModeEnabled ? "white" : "black"}.svg`}
                            className="profile-icon h-12" alt="Profile icon"/>
                        {email != "" ? <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>
                            : <FulcrumButton displayText="Register"
                                             onClick={() => window.location.href = "/register"}/>}
                    </div>
                </div>
            </nav>
            <nav className="text-white font-bold z-10">
                <div className="flex flex-row justify-center items-center">
                    <div className="flex-1 hidden sm:flex justify-around border-4 border-black bg-black">
                        <button id="expenses" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "expenses" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`}
                                onClick={() => window.location.href = "/expenses"}>
                            <img
                                src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredNavButton === "expenses") && "opacity-0"}`}
                                alt=""/>
                            <p className="mx-4">Expenses</p>
                            <img
                                src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredNavButton === "expenses") && "opacity-0"}`}
                                alt=""/>
                        </button>
                        <button id="budget" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "budget" ? "bg-[#17423F]" : "bg-black"} border-y-2 border-x-4 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`}
                                onClick={() => window.location.href = "/budget"}>
                            <img
                                src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredNavButton === "budget") && "opacity-0"}`}
                                alt=""/>
                            <p className="mx-4">Budget</p>
                            <img
                                src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredNavButton === "budget") && "opacity-0"}`}
                                alt=""/>
                        </button>
                        <button id="tools" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                                className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "tools" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`}
                                onClick={() => window.location.href = "/tools"}>
                            <img
                                src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredNavButton === "tools") && "opacity-0"}`}
                                alt=""/>
                            <p className="mx-4">Tools</p>
                            <img
                                src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`}
                                className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredNavButton === "tools") && "opacity-0"}`}
                                alt=""/>
                        </button>
                    </div>
                </div>
            </nav>
            {!window.location.href.includes("tools") && <div id="background-grid" className={`background min-h-full fixed ${publicUserData.darkModeEnabled ? "bg-dark" : "bg-light"}`}></div>}
            <Outlet/>
        </div>
    );
}