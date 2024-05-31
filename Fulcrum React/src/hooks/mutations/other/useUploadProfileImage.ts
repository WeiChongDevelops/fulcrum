import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProfileImageUploadDirect } from "@/api/user-prefs-api.ts";
import { useEmail } from "@/utility/util.ts";

interface UploadProfileImageMutationProps {
  byteArray: ArrayBuffer;
  fileName: string;
}

export default function useUploadProfileImage() {
  return useMutation({
    mutationFn: (uploadProfileImageMutationProps: UploadProfileImageMutationProps) =>
      handleProfileImageUploadDirect(uploadProfileImageMutationProps.byteArray, uploadProfileImageMutationProps.fileName),
    onSuccess: async () => {
      await useQueryClient().invalidateQueries({ queryKey: ["userPreferences", useEmail()] });
      await useQueryClient().invalidateQueries({ queryKey: ["profileImageURL", useEmail()] });
    },
  });
}
