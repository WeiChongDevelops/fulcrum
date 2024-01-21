import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom";
import {logoutOnClick} from "../../util.ts";


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
            <h1 className="text-black font-bold text-7xl bg-[#efefef] py-2">FULCRUM</h1>
            <nav className="bg-[#17423F] text-white p-4 font-bold z-10">
                <div className="flex justify-between items-center mx-auto">

                    <div className="flex-1 flex-row text-left"></div>

                    <div className="flex-1 hidden sm:flex justify-around ">
                        {/*<div className={`w-[33.33%] py-4 ${window.location.href.includes("/expenses") ? "bg-[#17423F]" : "bg-black"} rounded-l-xl`}>*/}
                        {/*    <a href="/expenses" className="hover:text-gray-300">Expenses</a>*/}
                        {/*</div>*/}
                        {/*<div className={`w-[33.33%] py-4 ${window.location.href.includes("/budget") ? "bg-[#17423F]" : "bg-black"}`}>*/}
                        {/*    <a href="/budget" className="hover:text-gray-300">Budget</a>*/}
                        {/*</div>*/}
                        {/*<div className={`w-[33.33%] py-4 ${window.location.href.includes("/tools") ? "bg-[#17423F]" : "bg-black"} rounded-r-xl`}>*/}
                        {/*    <a href="/tools" className="hover:text-gray-300">Tools</a>*/}
                        {/*</div>*/}
                        <button className={`w-[33.33%] py-4 ${window.location.href.includes("/expenses") ? "bg-[#17423F] font-bold" : "bg-black font-medium"} border-4 border-black rounded-l-xl hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/expenses"}>
                            Expenses
                        </button>
                        <button className={`w-[33.33%] py-4 ${window.location.href.includes("/budget") ? "bg-[#17423F] font-bold" : "bg-black font-medium"} border-y-4 border-black hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/budget"}>
                            Budget
                        </button>
                        <button className={`w-[33.33%] py-4 ${window.location.href.includes("/tools") ? "bg-[#17423F] font-bold" : "bg-black font-medium"} border-4 border-black rounded-r-xl hover:bg-[#efefef] hover:text-black transition-colors duration-400 ease-in-out`} onClick={() => window.location.href = "/tools"}>
                            Tools
                        </button>
                    </div>

                    <div className="flex-1 text-right">
                        <div className="flex justify-end items-center">
                            <p className="mx-4">{email}</p>
                            {email != "" && <button onClick={logoutOnClick} className="bg-[#dee1de] text-black py-2 px-4">Log Out</button>}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="background"></div>
            <Outlet/>
        </div>
    );
}