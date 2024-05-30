import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RegisterFormData } from "../../../utility/types.ts";
import { handleUserRegistration } from "../../../utility/api.ts";
import { handleUserRegistrationDirect } from "@/api/auth-api.ts";

export default function useRegisterUser() {
  return useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      // await handleUserRegistration(formData.email, formData.password);
      await handleUserRegistrationDirect(formData.email, formData.password);
    },
    onSuccess: () => {
      toast.success("Registration successful!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    },
    onError: () => {
      toast.error("This email is already in use.");
    },
  });
}
