import FulcrumButton from "@/components-v2/subcomponents/buttons/FulcrumButton.tsx";
import "../../../css/App.css";
import "../../../css/Auth.css";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import useRegisterUser from "../../../hooks/mutations/auth/useRegisterUser.ts";
import Loader from "../other/Loader.tsx";
import { toast } from "sonner";
import { RegisterFormData } from "@/utility/types.ts";
import OAuthLoginButton from "@/components-v2/subcomponents/buttons/OAuthLoginButton.tsx";
import useOAuthLoginUrl from "../../../hooks/mutations/auth/useOAuthLoginUrl.ts";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";

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
  const passwordField = useRef<HTMLInputElement>(null);
  const confirmPasswordField = useRef<HTMLInputElement>(null);

  const { isPending: isRegistrationPending, mutate: registerUser } = useRegisterUser();
  const { isPending: isOAuthURLPending, mutate: openOAuthLogin } = useOAuthLoginUrl();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.warning("Password does not match.");
      confirmPasswordField.current?.classList.add("invalid");
      setTimeout(() => {
        confirmPasswordField.current?.classList.remove("invalid");
      }, 500);
      return;
    } else {
      if (!getPasswordValidation(formData.password).passwordAccepted) {
        setPasswordValidation((prevValidation) => ({
          ...prevValidation,
          attemptedIgnore: true,
        }));
        passwordField.current?.classList.add("invalid");
        setTimeout(() => {
          passwordField.current?.classList.remove("invalid");
        }, 500);
      } else {
        registerUser(formData);
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
    <>
      <Loader isLoading={isRegistrationPending || isOAuthURLPending} isDarkMode={false} />
      <div className={`${(isRegistrationPending || isOAuthURLPending) && "opacity-80 animate-pulse transition-opacity"}`}>
        <img src="/static/assets-v2/other-assets/register-bg-cmp.webp" className={"hidden"} alt={""} />
        <div className={"auth-page-container register-page"}>
          <div className={"auth-page-left-column"}>
            <div className={"flex-1"}>
              <img
                src="/static/assets-v2/fulcrum-logos/fulcrum-logo-white-v2.webp"
                className={"auth-standard-fulcrum-logo"}
                alt="Fulcrum logo"
              />
            </div>
            <div className={"auth-text mt-36"}>
              <b className={"text-5xl"}>Register for an account.</b>
              <p className={"text-lg ml-1 mt-8 font-sans font-light"}>Start saving for free today.</p>
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
              <div className={"auth-label-input-pair"}>
                <Label htmlFor={"email"} className={"font-bold mb-1.5"}>
                  Email
                </Label>
                <Input
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
              <div className={`auth-label-input-pair my-5`}>
                <Label htmlFor={"password"} className={"font-bold mb-1.5"}>
                  Password
                </Label>
                <Input
                  ref={passwordField}
                  type="password"
                  id="password"
                  placeholder={"Create password..."}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={"new-password"}
                  required
                />
                <b
                  className={`mt-2 ${passwordValidation.passwordAccepted ? "text-green-500" : "text-red-500"} ${passwordValidation.attemptedIgnore && "underline"}`}
                >
                  {passwordValidation.feedback}
                </b>
              </div>
              <div className={"auth-label-input-pair mb-6"}>
                <Label htmlFor={"confirmPassword"} className={"font-bold mb-1.5"}>
                  Confirm Password
                </Label>
                <Input
                  ref={confirmPasswordField}
                  type="password"
                  id="confirmPassword"
                  placeholder={"Confirm password..."}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete={"new-password"}
                  required
                />
              </div>
              <div className={"flex flex-row justify-between items-end w-full"}>
                <div className={"mr-8 text-xs font-medium font-sans"}>
                  <span>Already have an account? </span>
                  <a href={"/login"} className={"underline text-[#17423F] font-semibold"}>
                    Login
                  </a>
                </div>
                <FulcrumButton
                  displayText={"Create account"}
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
