import { useMutation } from "@tanstack/react-query";
import { handleUserOAuthLoginPrompt } from "../../../utility/api.ts";

export default function useOAuthLoginUrl() {
  return useMutation({
    mutationFn: (provider: string) => {
      return handleUserOAuthLoginPrompt(provider);
    },
    onSuccess: (data) => (window.location.href = data),
  });
}
