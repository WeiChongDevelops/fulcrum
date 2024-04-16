import { useMutation } from "@tanstack/react-query";
import { handleUserRegistration, RegisterFormData } from "../../../util.ts";
import { toast } from "sonner";

export default function useRegisterUser() {
  return useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      await handleUserRegistration(formData.email, formData.password);
    },
    onSuccess: () => {
      toast.success("Successful registration.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 850);
    },
    onError: () => {
      toast.error("This email is already in use.");
    },
  });
}
