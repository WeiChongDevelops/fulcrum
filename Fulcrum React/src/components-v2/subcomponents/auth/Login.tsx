import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import useLoginUser from "../../../hooks/mutations/auth/useLoginUser.ts";
import Loader from "../other/Loader.tsx";
import { LoginFormData } from "@/utility/types.ts";
import OAuthLoginButton from "@/components-v2/subcomponents/buttons/OAuthLoginButton.tsx";
import useOAuthLoginUrl from "../../../hooks/mutations/auth/useOAuthLoginUrl.ts";
import { LocationContext } from "@/utility/util.ts";
import "@/css/Auth.css";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";

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
        <img src="/static/assets-v2/other-assets/login-bg-cmp.webp" className={"hidden"} alt="" />
        <div className={"auth-page-container login-page"}>
          <div className={"auth-page-left-column"}>
            <div className={"flex-1"}>
              <img
                src="/static/assets-v2/fulcrum-logos/fulcrum-logo-white-v2.webp"
                className={"auth-standard-fulcrum-logo"}
                alt="Fulcrum logo"
              />
            </div>
            <div className={"auth-text mt-36"}>
              <b className={"text-5xl"}>Log into your account.</b>
              <p className={"text-lg ml-1 mt-8 font-sans font-light"}>Every dollar deserves a job.</p>
            </div>
          </div>
          <div className={"auth-page-right-column"}>
            <div className={"flex-1"}>
              <img
                src="/static/assets-v2/fulcrum-logos/fulcrum-logo-white-v2.webp"
                className={"auth-mobile-fulcrum-logo"}
                alt="Fulcrum logo"
              />
            </div>
            <form className={"auth-form"} onSubmit={handleSubmit}>
              <div className={"auth-label-input-pair w-full"}>
                <Label htmlFor={"email"} className={"font-bold mb-1.5"}>
                  Email
                </Label>
                <Input
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
                <Label htmlFor={"password"} className={"font-bold mb-1.5"}>
                  Password
                </Label>
                <Input
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
                <div className={"mr-8 text-xs font-medium font-sans"}>
                  <span>Don't have an account? </span>
                  <a href={"/register"} className={"underline text-[#17423F] font-semibold"}>
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
                  socialIconPath={"/static/assets-v2/auth-icons/google-icon.svg"}
                  openOAuthLogin={openOAuthLogin}
                />
                <OAuthLoginButton
                  backgroundColour={"#1977F2"}
                  buttonText={"Continue with Facebook"}
                  textColour={"white"}
                  borderColour={"#1977F2"}
                  provider={"facebook"}
                  socialIconPath={"/static/assets-v2/auth-icons/facebook-icon-inverted.png"}
                  openOAuthLogin={openOAuthLogin}
                />
              </div>
              <div className={"mt-6 text-xs font-sans"}>
                <span>See our </span>
                <a href={"/privacy"} className={"underline text-[#17423F] font-semibold hover:cursor-pointer"}>
                  Privacy Policy
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
