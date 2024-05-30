import { useMutation } from "@tanstack/react-query";
import { handleUserOAuthInit } from "../../../utility/api.ts";
import { toast } from "sonner";
import { handleUserOAuthInitDirect } from "@/api/auth-api.ts";

export default function useInitOAuthAccount() {
  return useMutation({
    mutationFn: handleUserOAuthInitDirect,
    onSuccess: () => {
      toast.dismiss();
      window.location.href = "/app";
    },
  });
}
