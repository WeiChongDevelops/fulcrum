import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailContext, useEmail } from "../../../utility/util.ts";
import { UserPreferences } from "../../../utility/types.ts";
import { handleUserPreferencesUpdating } from "../../../utility/api.ts";

export default function useUpdateUserPreferences() {
  const email = useEmail();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["userPreferences", email],
    mutationFn: (updatedUserPreferences: UserPreferences) => handleUserPreferencesUpdating(updatedUserPreferences),
    onMutate: async (updatedUserPreferences: UserPreferences) => {
      await queryClient.cancelQueries({ queryKey: ["userPreferences", email] });
      const userPreferencesBeforeOptimisticUpdate = queryClient.getQueryData(["userPreferences", email]);
      await queryClient.setQueryData(["userPreferences", email], updatedUserPreferences);
      toast.success("Preferences updated!");
      return { userPreferencesBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["userPreferences", email], context?.userPreferencesBeforeOptimisticUpdate);
      toast.error(
        "Oops! We couldn’t save your changes due to a network issue. We’ve restored your last settings. Please try again later.",
        {
          duration: 7_000,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences", email] });
    },
  });
}
