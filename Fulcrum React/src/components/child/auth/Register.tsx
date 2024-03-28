import FulcrumButton from "../other/FulcrumButton.tsx";
import "../../../css/App.css";
import "../../../css/Auth.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { handleUserRegistration, RegisterFormData } from "../../../util.ts";

/**
 * The registration page for the Fulcrum application.
 */
export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    feedback: "",
    passwordAccepted: false,
    attemptedIgnore: false,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    } else {
      if (!getPasswordValidation(formData.password).passwordAccepted) {
        setPasswordValidation((prevValidation) => ({
          ...prevValidation,
          attemptedIgnore: true,
        }));
        document.querySelector("#password")!.classList.add("invalid");
        setTimeout(() => {
          document.querySelector("#password")!.classList.remove("invalid");
        }, 500);
      } else {
        await handleUserRegistration(formData.email, formData.password);

        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
    if (e.target.id == "password") {
      setPasswordValidation(getPasswordValidation(e.target.value));
    }
  }

  function getPasswordValidation(password: string) {
    let feedback = "";
    let passwordAccepted = false;

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;

    if (password.length < 8) {
      feedback = "Password must be at least 8 characters long.";
    } else if (!uppercaseRegex.test(password)) {
      feedback = "Password must contain at least one uppercase letter.";
    } else if (!lowercaseRegex.test(password)) {
      feedback = "Password must contain at least one lowercase letter.";
    } else if (!numberRegex.test(password)) {
      feedback = "Password must contain at least one number.";
    } else {
      feedback = "Great password!";
      passwordAccepted = true;
    }

    return {
      feedback: feedback,
      passwordAccepted: passwordAccepted,
      attemptedIgnore: false,
    };
  }

  return (
    <div className={"auth-page-container register-page"}>
      <div className={"auth-page-left-column"}>
        <div className={"flex-1"}>
          <img
            src="/src/assets/fulcrum-logos/fulcrum-long-white.webp"
            className={"auth-standard-fulcrum-logo"}
            alt="Fulcrum logo"
          />
        </div>
        <div className={"auth-text"}>
          <b className={"text-5xl"}>Register for an account.</b>
          <p className={"text-xl ml-2 mt-8"}>Start saving for free today.</p>
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
          <div className={"auth-label-input-pair"}>
            <label htmlFor={"email"}>Email</label>
            <input
              type="email"
              id="email"
              placeholder={"name@example.com"}
              value={formData.email}
              onChange={handleChange}
              autoComplete={"email"}
              required
              autoFocus
            />
          </div>
          <div className={`auth-label-input-pair mt-10`}>
            <label htmlFor={"password"}>Password</label>
            <input
              type="password"
              id="password"
              placeholder={"Your password"}
              value={formData.password}
              onChange={handleChange}
              autoComplete={"new-password"}
              required
            />
          </div>
          <b
            className={`mt-2 ${passwordValidation.passwordAccepted ? "text-green-500" : "text-red-500"} ${passwordValidation.attemptedIgnore && "underline"}`}
          >
            {passwordValidation.feedback}
          </b>
          <div className={"auth-label-input-pair my-10"}>
            <label htmlFor={"password"}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder={"Confirmed password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete={"new-password"}
              required
            />
          </div>
          <div className={"flex flex-row justify-center items-center w-full"}>
            <div className={"mr-8"}>
              <span>Already have any account? </span>
              <a
                href="http://localhost:5173/login"
                className={"underline text-[#17423F] font-semibold"}
              >
                Login
              </a>
            </div>
            <FulcrumButton
              displayText={"Create account"}
              backgroundColour={"green"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
