import FulcrumButton from "../buttons/FulcrumButton.tsx";
import "../../../css/App.css";
import "../../../css/Auth.css";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import useLoginUser from "../../../hooks/mutations/auth/useLoginUser.ts";
import Loader from "../other/Loader.tsx";
import { LoginFormData } from "../../../utility/types.ts";
import OAuthLoginButton from "../buttons/OAuthLoginButton.tsx";
import useOAuthLoginUrl from "../../../hooks/mutations/auth/useOAuthLoginUrl.ts";
import { LocationContext } from "../../../utility/util.ts";

/**
 * The login page for the Fulcrum application.
 */
export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const routerLocation = useContext(LocationContext);

  const { isSuccess: isLoginSuccess, isPending: isUserLoginPending, mutate: loginUser } = useLoginUser();
  const { isPending: isOAuthURLPending, mutate: openOAuthLogin } = useOAuthLoginUrl();

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
    if (isLoginSuccess) {
      sessionStorage.setItem("email", formData.email);
      setFormData({
        email: "",
        password: "",
      });
    }
  }, [isLoginSuccess, routerLocation]);

  return (
    <>
      <Loader isLoading={isUserLoginPending || isOAuthURLPending} isDarkMode={false} />
      <div className={`${(isUserLoginPending || isOAuthURLPending) && "opacity-80 animate-pulse transition-opacity"}`}>
        <img src="/static/assets/other-assets/login-bg-cmp.webp" className={"hidden"} />
        <div className={"auth-page-container login-page"}>
          <div className={"auth-page-left-column"}>
            <div className={"flex-1"}>
              <img
                src="/static/assets/fulcrum-logos/fulcrum-long-white.webp"
                className={"auth-standard-fulcrum-logo"}
                alt="Fulcrum logo"
              />
            </div>
            <div className={"auth-text"}>
              <b className={"text-5xl"}>Log into your account.</b>
              <p className={"text-lg ml-2 mt-8"}>Every dollar deserves a job.</p>
            </div>
          </div>
          <div className={"auth-page-right-column"}>
            <div className={"flex-1"}>
              <img
                src="/static/assets/fulcrum-logos/fulcrum-long-white.webp"
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
              <div className={"auth-label-input-pair my-6"}>
                <label htmlFor={"password"}>Password</label>
                <input
                  type="password"
                  placeholder={"Your password..."}
                  id={"password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={"current-password"}
                  required
                />
              </div>
              <div className={"flex flex-row justify-between items-end w-full"}>
                <div className={"mr-8 text-xs font-medium"}>
                  <span>Don't have an account? </span>
                  <a href={window.location.origin + "/register"} className={"underline text-[#17423F] font-semibold"}>
                    Register
                  </a>
                </div>
                <FulcrumButton
                  displayText={"Log in"}
                  backgroundColour={"green"}
                  optionalTailwind={"mr-0 text-sm"}
                  hoverShadow={true}
                />
              </div>
              <div className={"flex flex-col justify-start mt-5 items-center gap-3 w-full"}>
                <div className="oauth-divider my-2 text-xs">
                  <span>Or</span>
                </div>
                <OAuthLoginButton
                  backgroundColour={"white"}
                  buttonText={"Continue with Google"}
                  textColour={"black"}
                  borderColour={"#ccc"}
                  provider={"google"}
                  socialIconPath={"/static/assets/auth-icons/google-icon.svg"}
                  openOAuthLogin={openOAuthLogin}
                />
                <OAuthLoginButton
                  backgroundColour={"#1977F2"}
                  buttonText={"Continue with Facebook"}
                  textColour={"white"}
                  borderColour={"#1977F2"}
                  provider={"facebook"}
                  socialIconPath={"/static/assets/auth-icons/facebook-icon-inverted.png"}
                  openOAuthLogin={openOAuthLogin}
                />
              </div>
              <div className={"mt-6 text-xs"}>
                <span>See our </span>
                <span
                  className={"underline text-[#17423F] font-semibold hover:cursor-pointer"}
                  onClick={() => window.open(window.location.origin + "/privacy", "_blank")}
                >
                  Privacy Policy
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
