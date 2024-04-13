import FulcrumButton from "../other/FulcrumButton.tsx";
import "../../../css/App.css";
import "../../../css/Auth.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LoginFormData } from "../../../util.ts";
import useLoginUser from "../../../hooks/mutations/auth/useLoginUser.ts";
import Loader from "../other/Loader.tsx";

/**
 * The login page for the Fulcrum application.
 */
export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const { isSuccess, isPending, mutate: loginUser } = useLoginUser();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    loginUser(formData);
  }

  useEffect(() => {
    if (isSuccess) {
      sessionStorage.setItem("email", formData.email);
      setFormData({
        email: "",
        password: "",
      });
      window.location.href = "/app/budget";
    }
  }, [isSuccess]);

  return (
    <>
      <Loader isLoading={isPending} isDarkMode={false} />
      <div className={`${isPending && "opacity-80 animate-pulse transition-opacity"}`}>
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
              <div className={"flex flex-row justify-between items-center w-full"}>
                <div className={"mr-8 text-xs font-medium"}>
                  <span>Don't have an account? </span>
                  <a href="http://localhost:5173/register" className={"underline text-[#17423F] font-semibold"}>
                    Register
                  </a>
                </div>
                <FulcrumButton displayText={"Log In"} backgroundColour={"green"} optionalTailwind={"mr-0"} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
