import {FormEvent, useState} from "react";
import FulcrumButton from "../Other/FulcrumButton.tsx";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Add to users list in supabase (not the table)
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password
                })
            });

            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`);
                console.log(await response.json())
                window.alert("Registration failed - user may already exist.")
            } else {
                console.log("Successful registration.");
                console.log(await response.json());
                window.location.href = "/login";
            }

        } catch (error) {
            console.error("Error:", error);
        }
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen relative bottom-36">
            <form onSubmit={handleSubmit} className="auth-form w-96 p-8 bg-white rounded shadow-md">
                <h2 className="text-lg text-black font-bold mb-6">Join Fulcrum for Free</h2>
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
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-[#17423f] focus:ring-1 focus:ring-[#17423f]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        className="mt-1 block w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-md text-lg shadow-sm placeholder-gray-400
            focus:outline-none focus:border-[#17423f] focus:ring-1 focus:ring-[#17423f]"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <FulcrumButton displayText="Register" onClick={()=>{}}/>
            </form>
            <a href="/login" className="mt-6 text-black underline">Already have an account? Login here.</a>
        </div>
    );
}