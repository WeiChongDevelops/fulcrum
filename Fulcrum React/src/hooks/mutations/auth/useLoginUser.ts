import { useMutation } from "@tanstack/react-query";
import { handleUserLogin, LoginFormData } from "../../../util.ts";
import { toast } from "sonner";

export default function useLoginUser() {
  return useMutation({
    mutationFn: async (formData: LoginFormData) => {
      await handleUserLogin(formData.email, formData.password);
    },
    onSuccess: () => {
      toast.success("Login successful.");
      setTimeout(() => {
        window.location.href = "/app/budget";
      }, 850);
    },
    onError: () => {
      toast.error("User not found. Please check your credentials.");
    },
  });
}
