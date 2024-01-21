import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {logoutOnClick} from "../../util.ts";
import FulcrumButton from "./FulcrumButton.tsx";


export default function Navbar() {
    const [email, setEmail] = useState<string>("");


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
                        <button className={`w-[33.33%] rounded-lg font-bold py-4 ${window.location.href.includes("/expenses") ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/expenses"}>
                            Expenses
                        </button>
                        <button className={`w-[33.33%] rounded-lg font-bold py-4 ${window.location.href.includes("/budget") ? "bg-[#17423F]" : "bg-black"} border-y-2 border-x-4 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/budget"}>
                            Budget
                        </button>
                        <button className={`w-[33.33%] rounded-lg font-bold py-4 ${window.location.href.includes("/tools") ? "bg-[#17423F]" : "bg-black"} border-2 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/tools"}>
                            Tools
                        </button>
                    </div>
                </div>
            </nav>
            <div className="background"></div>
            <Outlet/>
        </div>
    );
}