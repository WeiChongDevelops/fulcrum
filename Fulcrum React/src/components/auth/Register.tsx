import FulcrumButton from "../other/FulcrumButton.tsx";
import "../../css/App.css";
import "../../css/Auth.css";
import {FormEvent, useState} from "react";
import {handleUserRegistration} from "../../util.ts";

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
        await handleUserRegistration(email, password);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className={"auth-page-container register-page"}>
            <div className={"auth-page-left-column"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"auth-standard-fulcrum-logo"} alt="Fulcrum logo"/>
                </div>
                <div className={"auth-text"}>
                    <b className={"text-5xl"}>Register for an account.</b>
                    <p className={"text-xl ml-2 mt-8"}>Start saving for free today.</p>
                </div>
            </div>
            <div className={"auth-page-right-column"}>
                <div className={"flex-1"}>
                    <img src="/src/assets/fulcrum-logos/fulcrum-long-white.webp" className={"auth-mobile-fulcrum-logo"} alt="Fulcrum logo"/>
                </div>
                <form className={"auth-form"}
                      onSubmit={handleSubmit}>
                    <div className={"auth-label-input-pair"}>
                        <label htmlFor={"email"}>Email</label>
                        <input type="email"
                               placeholder={"name@example.com"}
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               autoComplete={"email"}
                               required/>
                    </div>
                    <div className={"auth-label-input-pair mt-10"}>
                        <label htmlFor={"password"}>Password</label>
                        <input type="password"
                               placeholder={"Your password"}
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               autoComplete={"new-password"}
                               required/>
                    </div>
                    <div className={"auth-label-input-pair my-10"}>
                        <label htmlFor={"password"}>Confirm Password</label>
                        <input type="password"
                               placeholder={"Confirmed password"}
                               value={confirmPassword}
                               onChange={e => setConfirmPassword(e.target.value)}
                               autoComplete={"new-password"}
                               required/>
                    </div>
                    <div className={"flex flex-row justify-center items-center w-full"}>
                        <div className={"mr-8"}>
                            <span>Already have any account? </span>
                            <a href="/login" className={"underline text-[#17423F] font-semibold"}>Login</a>
                        </div>
                        <FulcrumButton displayText={"Register"} backgroundColour={"green"}/>
                    </div>
                </form>
            </div>
        </div>
    );
}