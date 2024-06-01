import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProfileImageUploadDirect } from "@/api/user-prefs-api.ts";
import { useEmail } from "@/utility/util.ts";
import { UserPreferences } from "@/utility/types.ts";

interface UploadProfileImageMutationProps {
  byteArray: ArrayBuffer;
  fileName: string;
}

export default function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const email = useEmail();
  return useMutation({
    mutationFn: async (uploadProfileImageMutationProps: UploadProfileImageMutationProps) => {
      await handleProfileImageUploadDirect(
        uploadProfileImageMutationProps.byteArray,
        uploadProfileImageMutationProps.fileName,
      );
    },
    onSuccess: async () => {
      await useQueryClient().invalidateQueries({ queryKey: ["userPreferences", email] });
      await useQueryClient().invalidateQueries({ queryKey: ["profileImageURL", email] });

      const userPreferences: UserPreferences = queryClient.getQueryData(["userPreferences", email])!;
      localStorage.setItem("profileIconFileName", userPreferences.profileIconFileName);
      localStorage.setItem("darkModeEnabled", userPreferences.darkModeEnabled.toString());
      localStorage.setItem("accessibilityEnabled", userPreferences.accessibilityEnabled.toString());
      localStorage.setItem("prefersUploadedAvatar", userPreferences.prefersUploadedAvatar.toString());
    },
  });
}
