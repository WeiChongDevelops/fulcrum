import { handleUserOAuthInit, handleUserOAuthLoginAttempt } from "../../../utility/api.ts";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContext, useEffect } from "react";
import { EmailContext } from "../../../utility/util.ts";
import { v4 as uuid } from "uuid";

export default function OAuthRedirect() {
  function getParamFromFragmentURL(url: string, paramKey: string): string | null {
    const hashIndex = url.indexOf("#");
    if (hashIndex === -1) return null;

    const params = new URLSearchParams(url.slice(hashIndex + 1));
    const paramValue = params.get(paramKey);

    return paramValue;
  }

  useEffect(() => {
    toast.loading("Please wait to be redirected.");
    const url = window.location.href;
    const accessToken = getParamFromFragmentURL(url, "access_token");
    const refreshToken = getParamFromFragmentURL(url, "refresh_token");
    console.log(accessToken);
    console.log(refreshToken);
    if (!!accessToken && !!refreshToken) {
      handleUserOAuthLoginAttempt(accessToken, refreshToken).then(oAuthInitMutation.mutate);
    }
  }, []);

  const oAuthInitMutation = useMutation({
    mutationFn: handleUserOAuthInit,
    onSuccess: () => {
      toast.dismiss();
      window.location.href = window.location.origin + "/app";
    },
  });

  //
  // console.log("JWT is:");
  // console.log(getJWTFromURL(window.location.href));

  // function getCodeFromURLFromURL(url: string): string | null {
  //   const hashIndex = url.indexOf("#");
  //   if (hashIndex === -1) return null;
  //
  //   const params = new URLSearchParams(url.slice(hashIndex + 1));
  //   const code = params.get("code");
  //
  //   return code;
  // }
  //
  // // console.log("code is:");
  // // console.log(getCodeFromURL(window.location.href));
  // useEffect(() => {
  //   console.log(window.location.href); // Logs the full URL
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("code");
  //   console.log(code);
  // }, []);

  // useEffect(() => {
  //   handleUserOAuthLoginAttempt(getJWTFromURL(window.location.href));
  // }, []);

  // const oAuthInitMutation = useMutation({
  //   mutationFn: async () => {
  //     await handleUserOAuthInit();
  //     setTimeout(() => {
  //       window.location.href = "/app/budget";
  //     }, 3_000);
  //   },
  //   onMutate: () => {
  //     toast.loading("Please wait while you are redirected.");
  //   },
  //   onSuccess: () => {
  //     toast.dismiss();
  //   },
  // });

  // useEffect(() => {
  //   oAuthInitMutation.mutate();
  // }, [oAuthInitMutation.status]);

  // useEffect(() => {
  //   if (!!email) {
  //     toast.success("User detected.");
  //   } else {
  //     toast.warning("No user detected.");
  //     console.log(email);
  //   }
  // }, []);

  return (
    <div className={"flex flex-col justify-center items-center h-screen gap-14 text-black font-bold"}>
      <p className={"font-bold text-black text-4xl"}>Login successful!</p>
      <img src="/src/assets/fulcrum-logos/fulcrum-icon.png" className={"w-10 h-10"} alt="Fulcrum icon" />
    </div>
  );
}
