import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoginFormData } from "@/utility/types.ts";
import { handleUserLoginDirect } from "@/api/auth-api.ts";

export default function useLoginUser() {
  return useMutation({
    mutationFn: async (formData: LoginFormData) => {
      await handleUserLoginDirect(formData.email, formData.password);
    },
    onSuccess: () => {
      toast.success("Login successful!");
      setTimeout(() => {
        window.location.href = "/app/budget";
      }, 700);
    },
    onError: () => {
      toast.error("User not found. Please check your credentials.");
    },
  });
}
