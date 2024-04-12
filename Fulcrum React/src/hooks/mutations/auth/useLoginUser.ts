import { useMutation } from "@tanstack/react-query";
import { handleUserLogin, LoginFormData } from "../../../util.ts";

export default function useLoginUser() {
  return useMutation({
    mutationFn: async (formData: LoginFormData) => {
      await handleUserLogin(formData.email, formData.password);
    },
  });
}
