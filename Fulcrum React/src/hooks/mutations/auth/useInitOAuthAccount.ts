import { useMutation } from "@tanstack/react-query";
import { handleUserOAuthInit } from "../../../utility/api.ts";
import { toast } from "sonner";

export default function useInitOAuthAccount() {
  return useMutation({
    mutationFn: handleUserOAuthInit,
    onSuccess: () => {
      toast.dismiss();
      window.location.href = "/app";
    },
  });
}
