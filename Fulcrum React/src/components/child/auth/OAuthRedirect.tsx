import { handleUserOAuthLoginAttempt } from "../../../utility/api.ts";
import { toast } from "sonner";
import { useEffect } from "react";
import useInitOAuthAccount from "../../../hooks/mutations/auth/useInitOAuthAccount.tsx";
import { getParamFromFragmentURL } from "../../../utility/util.ts";

export default function OAuthRedirect() {
  const { mutate: initOAuthAccount } = useInitOAuthAccount();

  useEffect(() => {
    toast.loading("Please wait to be redirected.");
    const url = window.location.href;
    const accessToken = getParamFromFragmentURL(url, "access_token");
    const refreshToken = getParamFromFragmentURL(url, "refresh_token");
    if (!!accessToken && !!refreshToken) {
      handleUserOAuthLoginAttempt(accessToken, refreshToken).then(initOAuthAccount);
    }
  }, []);

  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
      <p className={"font-bold text-black text-4xl"}>Login successful!</p>
      <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
    </div>
  );
}
