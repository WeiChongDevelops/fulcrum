import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProfileImageUploadDirect, handleUserPreferencesUpdatingDirect } from "@/api/user-prefs-api.ts";
import { useEmail } from "@/utility/util.ts";
import { UserPreferences } from "@/utility/types.ts";
import { toast } from "sonner";

interface UploadProfileImageMutationProps {
  optimisticURL: string;
  byteArray: ArrayBuffer;
  fileName: string;
}

export default function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const email = useEmail();
  return useMutation({
    mutationFn: async (uploadProfileImageMutationProps: UploadProfileImageMutationProps) => {
      const userPreferences: UserPreferences = await queryClient.getQueryData(["userPreferences", email])!;
      await handleUserPreferencesUpdatingDirect({
        ...userPreferences,
        profileIconFileName: uploadProfileImageMutationProps.fileName,
        prefersUploadedAvatar: true,
      });
      await handleProfileImageUploadDirect(
        uploadProfileImageMutationProps.byteArray,
        uploadProfileImageMutationProps.fileName,
      );
    },
    onMutate: async (uploadProfileImageMutationProps: UploadProfileImageMutationProps) => {
      toast.loading("Updating avatar...");
      localStorage.setItem("profileImageURL", uploadProfileImageMutationProps.optimisticURL);

      await queryClient.cancelQueries({ queryKey: ["userPreferences", email] });
      await queryClient.cancelQueries({ queryKey: ["profileImageURL", email] });

      const userPreferencesBeforeOptimisticUpdate: UserPreferences = await queryClient.getQueryData([
        "userPreferences",
        email,
      ])!;
      const profileImageURLBeforeOptimisticUpdate: string = await queryClient.getQueryData(["profileImageURL", email])!;

      await queryClient.setQueryData(["userPreferences", email], {
        ...userPreferencesBeforeOptimisticUpdate,
        profileIconFileName: uploadProfileImageMutationProps.fileName,
        prefersUploadedAvatar: true,
      });
      await queryClient.setQueryData(["profileImageURL", email], uploadProfileImageMutationProps.optimisticURL);

      return { userPreferencesBeforeOptimisticUpdate, profileImageURLBeforeOptimisticUpdate };
    },
    onError: async (_error, _variables, context) => {
      await queryClient.setQueryData(["userPreferences", email], context?.userPreferencesBeforeOptimisticUpdate);
      await queryClient.setQueryData(["profileImageURL", email], context?.profileImageURLBeforeOptimisticUpdate);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userPreferences", email] });
      await queryClient.invalidateQueries({ queryKey: ["profileImageURL", email] });
      setTimeout(() => {
        toast.dismiss();
        toast.success("Avatar updated.");
      }, 1750);
    },
  });
}
