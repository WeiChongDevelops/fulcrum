import {useMutation} from "@tanstack/react-query";
import {handleUserRegistration, RegisterFormData} from "../../../util.ts";

export default function useRegisterUser() {
  return useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      await handleUserRegistration(formData.email, formData.password);
    },
  })
}