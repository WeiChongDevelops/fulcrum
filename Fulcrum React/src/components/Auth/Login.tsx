import {FormEvent, useState} from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
            if (!response.ok ) {
                console.error(`HTTP error - status: ${response.status}`);
                console.error("User not found.")
            } else {
                console.log("Successful login.");
                console.log(response.json());
                window.location.href = "/app";
            }

        } catch (error) {
            console.error("Error:", error);
        }

        setEmail("");
        setPassword("");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
                <h2 className="text-lg font-bold mb-6">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full px-4 py-2 text-lg font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
                    Login
                </button>
                <a href="/register" className="mt-6">Don't have an account? Register here.</a>
            </form>
        </div>
    );
}