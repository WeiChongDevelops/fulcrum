import { useMutation } from "@tanstack/react-query";
import { handleUserOAuthLoginPrompt } from "../../../api/api.ts";
import { getOAuthLoginURLDirect } from "@/api/auth-api.ts";

export default function useOAuthLoginUrl() {
  // return useMutation({
  //   mutationFn: (provider: string) => {
  //     return getOAuthLoginURLDirect(provider);
  //   },
  //   onSuccess: (data) => (window.location.href = data),
  // });
  return useMutation({
    mutationFn: (provider: string) => {
      return getOAuthLoginURLDirect(provider);
    },
    onSuccess: (data) => (window.location.href = data),
  });
}
