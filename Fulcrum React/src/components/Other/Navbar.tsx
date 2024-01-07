import FulcrumButton from "./FulcrumButton.tsx";
import {Dispatch, SetStateAction, useEffect} from "react";
import {Outlet} from "react-router-dom";


interface NavbarProps {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
}
export default function Navbar({ email, setEmail }: NavbarProps) {

    async function logoutOnClick() {
        try {
            await fetch("http://localhost:8080/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({jwt: localStorage.getItem("jwt")})
            })
                .then( () => window.location.href = "/login")
                .catch( error => console.error(error))
        } catch {
            console.error("Error: Logout failed")
        }
    }

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
            <nav className="bg-gray-500 text-white p-4">
                <div className="flex justify-between items-center mx-auto">

                    <div className="flex-1 flex-row text-left">
                        <b className="mx-8">Fulcrum</b>
                    </div>

                    <ul className="flex-1 justify-center hidden sm:flex">
                        <li className="mx-2">
                            <a href="/about" className="hover:text-gray-300">About</a>
                        </li>
                        <li className="mx-2">
                            <a href="/expenses" className="hover:text-gray-300">Expenses</a>
                        </li>
                        <li className="mx-2">
                            <a href="/budget" className="hover:text-gray-300">Budget</a>
                        </li>
                        <li className="mx-2">
                            <a href="/tools" className="hover:text-gray-300">Tools</a>
                        </li>
                    </ul>

                    <div className="flex-1 text-right">
                        <div className="flex justify-end items-center">
                            <p className="mx-4">{email}</p>
                            {email != "" && <FulcrumButton displayText="Log Out" onClick={logoutOnClick}/>}
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}