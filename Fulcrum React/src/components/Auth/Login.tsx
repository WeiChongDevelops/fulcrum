import {FormEvent, useEffect, useState} from "react";
import {checkForUser} from "../../util.ts";
import FulcrumButton from "../Other/FulcrumButton.tsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    useEffect(() => {
        checkForUser()
            .then(userStatus => {
                if (userStatus["loggedIn"]) {
                    console.log("User already logged in.");
                    window.location.href = "/budget";
                } else {
                    console.log("User not logged in, login page access greenlighted.");
                }
            })
    }, []);

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            });
            if (response.status === 500 ) {
                console.error(`HTTP error - status: ${response.status}`);
                console.error("User not found.")
                window.alert("User not found - please check your credentials.")
            } else {
                if (response.status === 400) {
                    console.error(`HTTP error - status: ${response.status}`);
                    console.error("User already logged in.")
                    window.location.href = "/budget"
                }
                else {
                    console.log("Successful login.");
                    console.log(response.json());
                    window.location.href = "/budget";
                }
            }

        } catch (error) {
            console.error("Error:", error);
        }

        setEmail("");
        setPassword("");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen relative bottom-36">
            <form onSubmit={handleSubmit} className="auth-form w-96 p-8 bg-white rounded shadow-md">
                <h2 className="text-lg text-black font-bold mb-6">Sign In.</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-[#17423f] focus:ring-1 focus:ring-[#17423f]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-[#17423f] focus:ring-1 focus:ring-[#17423f]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <FulcrumButton displayText="Login" onClick={()=>{}}/>
            </form>
            <a href="/register" className="mt-6 text-black underline">Don't have an account? Register here.</a>
        </div>
    );
}