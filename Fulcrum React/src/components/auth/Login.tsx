import FulcrumButton from "../other/FulcrumButton.tsx";
import "../../css/App.css";
import "../../css/Auth.css";
import {FormEvent, useState} from "react";
import {handleUserLogin} from "../../util.ts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();

        await handleUserLogin(email, password);

        setEmail("");
        setPassword("");
    }

    return (
        <div className={"auth-page-container login-page flex flex-row justify-around items-center w-[100vw] h-[100vh]"}>
            <div className={"auth-page-left-column flex flex-col justify-around items-start h-[65vh] pl-[10rem] pb-52"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"select-none w-80 h-auto"} alt="Fulcrum logo"/>
                </div>
                <div className={"flex flex-col justify-center items-start h-[100vh] w-[35vw] text-left"}>
                    <b className={"auth-header text-[3rem]"}>Log into your account.</b>
                    <p className={"text-xl ml-2 mt-8"}>Every dollar deserves a job.</p>
                </div>
            </div>
            <div className={"auth-page-right-column flex flex-col justify-around items-center h-[35vh] mr-24"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"select-none w-96 h-auto auth-mobile-fulcrum-logo"} alt="Fulcrum logo"/>
                </div>
                <form className={"auth-form flex flex-col justify-center items-center bg-white text-black px-12 pt-16 pb-8 w-[37vw] rounded-2xl"}
                      onSubmit={handleSubmit}>
                    <div className={"flex flex-col justify-center items-start w-full"}>
                        <label htmlFor={"email"}>Email</label>
                        <input type="email"
                               className={"w-full py-2 px-4 rounded-md border border-gray-400 mt-2"}
                               placeholder={"name@example.com"}
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               autoComplete={"email"}
                               required/>
                    </div>
                    <div className={"flex flex-col justify-center items-start w-full my-10"}>
                        <label htmlFor={"password"}>Password</label>
                        <input type="password"
                               className={"w-full py-2 px-4 rounded-md border border-gray-400 mt-2"}
                               placeholder={"Your password"}
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               autoComplete={"current-password"}
                               required/>
                    </div>
                    <div className={"flex flex-row justify-center items-center w-full"}>
                        <div className={"mr-8"}>
                            <span>Don't have an account? </span>
                            <a href="/register"
                               className={"underline text-[#17423F] font-semibold"}>Register</a>
                        </div>
                        <FulcrumButton displayText={"Log In"} backgroundColour={"green"}/>
                    </div>
                </form>
                <p className={"text-8xl flex-1"}></p>
            </div>
        </div>
    );
}