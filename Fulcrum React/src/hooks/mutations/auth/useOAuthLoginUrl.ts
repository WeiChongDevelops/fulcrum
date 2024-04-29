import { useMutation } from "@tanstack/react-query";
import { handleUserOAuthLoginPrompt } from "../../../utility/api.ts";

export default function useOAuthLoginUrl() {
  return useMutation({
    mutationFn: (provider: string) => {
      return handleUserOAuthLoginPrompt(provider, window.location.origin);
    },
    onSuccess: (data) => window.open(data, "_blank"),
  });
}
