import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProfileImageDataWipe } from "@/api/user-prefs-api.ts";
import { useEmail } from "@/utility/util.ts";

export default function useWipeProfileImageData() {
  const queryClient = useQueryClient();
  const email = useEmail();
  return useMutation({
    mutationFn: handleProfileImageDataWipe,
    onMutate: async () => {
      await queryClient.setQueryData(["profileImageURL", email], "");
      localStorage.removeItem("profileImageURL");
    },
  });
}
