import { toast } from "sonner";
import { useEffect } from "react";
import useInitOAuthAccount from "../../../hooks/mutations/auth/useInitOAuthAccount.ts";

export default function OAuthRedirect() {
  const { mutate: initOAuthAccount } = useInitOAuthAccount();

  useEffect(() => {
    toast.loading("Please wait to be redirected.");
    initOAuthAccount();
  }, []);

  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-8 text-black"}>
      <p className={"font-bold text-5xl "}>Login successful!</p>
      <p className={"font-medium text-xl"}>Please wait to be redirected...</p>
      <img
        src="/static/assets-v2/fulcrum-logos/fulcrum-icon.png"
        className={"w-12 h-12 animate-bounce"}
        alt="Fulcrum icon"
      />
    </div>
  );
}
