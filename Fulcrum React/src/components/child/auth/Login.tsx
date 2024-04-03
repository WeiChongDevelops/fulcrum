import FulcrumButton from "../other/FulcrumButton.tsx";
import "../../../css/App.css";
import "../../../css/Auth.css";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { handleUserLogin } from "../../../util.ts";

interface LoginProps {
  setEmail: Dispatch<SetStateAction<string>>;
}

/**
 * The login page for the Fulcrum application.
 */
export default function Login({ setEmail }: LoginProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loginSuccess = await handleUserLogin(formData.email, formData.password);
    if (loginSuccess) {
      setEmail(formData.email);
      sessionStorage.setItem("email", formData.email);
      setFormData({
        email: "",
        password: "",
      });
    }
  }

  return (
    <div className={"auth-page-container login-page"}>
      <div className={"auth-page-left-column"}>
        <div className={"flex-1"}>
          <img
            src="/src/assets/fulcrum-logos/fulcrum-long-white.webp"
            className={"auth-standard-fulcrum-logo"}
            alt="Fulcrum logo"
          />
        </div>
        <div className={"auth-text"}>
          <b className={"text-5xl"}>Log into your account.</b>
          <p className={"text-xl ml-2 mt-8"}>Every dollar deserves a job.</p>
        </div>
      </div>
      <div className={"auth-page-right-column"}>
        <div className={"flex-1"}>
          <img
            src="/src/assets/fulcrum-logos/fulcrum-long-white.webp"
            className={"auth-mobile-fulcrum-logo"}
            alt="Fulcrum logo"
          />
        </div>
        <form className={"auth-form"} onSubmit={handleSubmit}>
          <div className={"auth-label-input-pair w-full"}>
            <label htmlFor={"email"}>Email</label>
            <input
              type="email"
              placeholder={"name@example.com"}
              id={"email"}
              value={formData.email}
              onChange={handleChange}
              autoComplete={"email"}
              required
              autoFocus
            />
          </div>
          <div className={"auth-label-input-pair my-10"}>
            <label htmlFor={"password"}>Password</label>
            <input
              type="password"
              placeholder={"Your password"}
              id={"password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete={"current-password"}
              required
            />
          </div>
          <div className={"flex flex-row justify-center items-center w-full"}>
            <div className={"mr-8"}>
              <span>Don't have an account? </span>
              <a href="http://localhost:5173/register" className={"underline text-[#17423F] font-semibold"}>
                Register
              </a>
            </div>
            <FulcrumButton displayText={"Log In"} backgroundColour={"green"} />
          </div>
        </form>
      </div>
    </div>
  );
}
