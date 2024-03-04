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
        <div className={"auth-page-container login-page"}>
            <div className={"auth-page-left-column"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"auth-standard-fulcrum-logo"} alt="Fulcrum logo"/>
                </div>
                <div className={"auth-text"}>
                    <b className={"text-5xl"}>Log into your account.</b>
                    <p className={"text-xl ml-2 mt-8"}>Every dollar deserves a job.</p>
                </div>
            </div>
            <div className={"auth-page-right-column"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"auth-mobile-fulcrum-logo"} alt="Fulcrum logo"/>
                </div>
                <form className={"auth-form"}
                      onSubmit={handleSubmit}>
                    <div className={"auth-label-input-pair w-full"}>
                        <label htmlFor={"email"}>Email</label>
                        <input type="email"
                               placeholder={"name@example.com"}
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               autoComplete={"email"}
                               required/>
                    </div>
                    <div className={"auth-label-input-pair my-10"}>
                        <label htmlFor={"password"}>Password</label>
                        <input type="password"
                               placeholder={"Your password"}
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               autoComplete={"current-password"}
                               required/>
                    </div>
                    <div className={"flex flex-row justify-center items-center w-full"}>
                        <div className={"mr-8"}>
                            <span>Don't have an account? </span>
                            <a href="/register" className={"underline text-[#17423F] font-semibold"}>Register</a>
                        </div>
                        <FulcrumButton displayText={"Log In"} backgroundColour={"green"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}