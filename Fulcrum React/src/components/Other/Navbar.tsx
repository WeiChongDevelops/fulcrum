import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {getWindowLocation, logoutOnClick} from "../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";


export default function Navbar() {
    const [email, setEmail] = useState<string>("");
    const [hoveredButton, setHoveredButton] = useState("");

    async function getSessionEmail() {
        try {
            const response = await fetch("http://localhost:8080/api/getUserEmailIfLoggedIn", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!response.ok) {
                console.error(`Email retrieval failed - no user logged in.: ${response.status}`);
            } else {
                const responseData = await response.json();
                console.log(responseData);
                return responseData
            }
        } catch (error) {
            console.error(`Email retrieval api query failed: ${error}`);
        }
    }

    useEffect(() => {
        getSessionEmail()
            .then(response => response.email ? setEmail(response.email) : "")
    }, []);

    function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.target as HTMLButtonElement;
        setHoveredButton(button.id);
    }

    function handleMouseLeave() {
        setHoveredButton("");
    }

    return (
        <div>
            <nav className="flex flex-row justify-between items-center bg-[#efefef] py-2">
                <div className="flex-1"></div>
                <h1 className="flex-1 text-black font-bold text-7xl ">FULCRUM</h1>

                <div className="flex-1 text-right">
                    <div className="flex justify-end items-center">
                        <p className="mx-2 text-black ">{email}</p>
                        {email != "" && <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>}
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
            <div className="background"></div>
            <Outlet/>
        </div>
    );
}