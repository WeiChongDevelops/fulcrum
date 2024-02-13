import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {getSessionEmail, getWindowLocation, logoutOnClick, PublicUserData} from "../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";

interface NavbarProps {
    publicUserData: PublicUserData;
}

export default function Navbar({ publicUserData }: NavbarProps) {
    const [hoveredButton, setHoveredButton] = useState("");

    const sessionStoredEmail = sessionStorage.getItem("email");

    const [email, setEmail] = useState<string>(sessionStoredEmail!);

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
    }, []);

    useEffect(() => {
        sessionStorage.setItem("email", email);
    }, [email]);

    function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.target as HTMLButtonElement;
        setHoveredButton(button.id);
    }

    function handleMouseLeave() {
        setHoveredButton("");
    }

    return (
        <div>
            <nav className="flex flex-row justify-between items-center bg-white py-1">
                <div className="flex-1"></div>
                <img src="/src/assets/fulcrum-logos/fulcrum-long.webp" alt="Fulcrum logo in navbar" className="navbar-fulcrum-logo mr-4 hover:cursor-pointer" onClick={() => window.location.href= "/budget"}></img>
                <div className="flex-1 text-right">
                    <div className="flex justify-end items-center">
                        <p className="mx-2 text-black ">{email}</p>
                        <img src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-black.svg`} className="profile-icon h-12" alt="Profile icon"/>
                        {email != "" ? <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>
                            : <FulcrumButton displayText="Register" onClick={() => window.location.href = "/register"}/> }
                    </div>
                </div>
            </nav>
            <nav className="text-white font-bold z-10">
                <div className="flex flex-row justify-center items-center">
                    <div className="flex-1 hidden sm:flex justify-around border-4 border-black bg-black">
                        <button id="expenses" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "expenses" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/expenses"}>
                            <img src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredButton === "expenses") && "opacity-0"}`} alt=""/>
                            <p className="mx-4">Expenses</p>
                            <img src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredButton === "expenses") && "opacity-0"}`} alt=""/>
                        </button>
                        <button id="budget" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "budget" ? "bg-[#17423F]" : "bg-black"} border-y-2 border-x-4 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/budget"}>
                            <img src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredButton === "budget") && "opacity-0"}`} alt=""/>
                            <p className="mx-4">Budget</p>
                            <img src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredButton === "budget") && "opacity-0"}`} alt=""/>
                        </button>
                        <button id="tools" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "tools" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/tools"}>
                            <img src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredButton === "tools") && "opacity-0"}`} alt=""/>
                            <p className="mx-4">Tools</p>
                            <img src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredButton === "tools") && "opacity-0"}`} alt=""/>
                        </button>
                    </div>
                </div>
            </nav>
            {!window.location.href.includes("tools") && <div id="background-grid" className="background"></div>}
            <Outlet/>
        </div>
    );
}
// import {useEffect, useState} from "react";
// import {Outlet} from "react-router-dom";
// import {getPublicUserData, getSessionEmail, getWindowLocation, logoutOnClick, PublicUserData} from "../../util.ts";
// import FulcrumButton from "./FulcrumButton.tsx";
//
//
// export default function Navbar() {
//     const [hoveredButton, setHoveredButton] = useState("");
//
//     const sessionStoredProfileIcon = sessionStorage.getItem("profileIcon");
//     const sessionStoredEmail = sessionStorage.getItem("email");
//
//     const [email, setEmail] = useState<string>(sessionStoredEmail!);
//     const [publicUserData, setPublicUserData] = useState<PublicUserData>({
//         createdAt: new Date(),
//         currency: "",
//         darkModeEnabled: false,
//         accessibilityEnabled: false,
//         profileIconFileName: sessionStoredProfileIcon ? sessionStoredProfileIcon : "profile-icon-default.svg"
//     })
//
//     useEffect(() => {
//         getPublicUserData()
//             .then(results => setPublicUserData(results));
//         getSessionEmail()
//             .then(response => response.email ? setEmail(response.email) : "")
//     }, []);
//
//     useEffect(() => {
//         sessionStorage.setItem("profileIcon", publicUserData.profileIconFileName)
//     }, [publicUserData]);
//
//     useEffect(() => {
//         sessionStorage.setItem("email", email);
//     }, [email]);
//
//     function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
//         const button = e.target as HTMLButtonElement;
//         setHoveredButton(button.id);
//     }
//
//     function handleMouseLeave() {
//         setHoveredButton("");
//     }
//
//     return (
//         <div>
//             <nav className="flex flex-row justify-between items-center bg-white py-1">
//                 <div className="flex-1"></div>
//                 <img src="/src/assets/fulcrum-logos/fulcrum-long.webp" alt="Fulcrum logo in navbar" className="navbar-fulcrum-logo mr-4 hover:cursor-pointer" onClick={() => window.location.href= "/budget"}></img>
//                 <div className="flex-1 text-right">
//                     <div className="flex justify-end items-center">
//                         <p className="mx-2 text-black ">{email}</p>
//                         <img src={`/src/assets/profile-icons/${publicUserData.profileIconFileName.slice(0, -4)}-black.svg`} className="profile-icon h-12" alt="Profile icon"/>
//                         {email != "" ? <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>
//                             : <FulcrumButton displayText="Register" onClick={() => window.location.href = "/register"}/> }
//                     </div>
//                 </div>
//             </nav>
//             <nav className="text-white font-bold z-10">
//                 <div className="flex flex-row justify-center items-center">
//                     <div className="flex-1 hidden sm:flex justify-around border-4 border-black bg-black">
//                         <button id="expenses" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "expenses" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/expenses"}>
//                             <img src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredButton === "expenses") && "opacity-0"}`} alt=""/>
//                             <p className="mx-4">Expenses</p>
//                             <img src={`/src/assets/navbar-icons/expenses-icon-${getWindowLocation() === "expenses" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "expenses" && hoveredButton === "expenses") && "opacity-0"}`} alt=""/>
//                         </button>
//                         <button id="budget" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "budget" ? "bg-[#17423F]" : "bg-black"} border-y-2 border-x-4 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/budget"}>
//                             <img src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredButton === "budget") && "opacity-0"}`} alt=""/>
//                             <p className="mx-4">Budget</p>
//                             <img src={`/src/assets/navbar-icons/budget-icon-${getWindowLocation() === "budget" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "budget" && hoveredButton === "budget") && "opacity-0"}`} alt=""/>
//                         </button>
//                         <button id="tools" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={`flex flex-row justify-center items-center w-[33.33%] rounded-xl font-bold py-4 ${getWindowLocation() === "tools" ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-300 ease-in-out`} onClick={() => window.location.href = "/tools"}>
//                             <img src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredButton === "tools") && "opacity-0"}`} alt=""/>
//                             <p className="mx-4">Tools</p>
//                             <img src={`/src/assets/navbar-icons/tools-icon-${getWindowLocation() === "tools" ? "white" : "black"}.svg`} className={`w-6 transition-opacity duration-300 ${(getWindowLocation() === "tools" && hoveredButton === "tools") && "opacity-0"}`} alt=""/>
//                         </button>
//                     </div>
//                 </div>
//             </nav>
//             {!window.location.href.includes("tools") && <div id="background-grid" className="background"></div>}
//             <Outlet/>
//         </div>
//     );
// }