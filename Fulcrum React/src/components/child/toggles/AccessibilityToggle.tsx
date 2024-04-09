import { useState, useEffect, useContext } from "react";
import { EmailContext, handlePublicUserDataUpdating, PublicUserData } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AccessibilityToggleProps {
  publicUserData: PublicUserData;
}

/**
 * A toggle for the user to choose between standard mode and accessibility mode (high contrast + greyscale).
 */
export default function AccessibilityToggle({ publicUserData }: AccessibilityToggleProps) {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(publicUserData.accessibilityEnabled);

  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  const publicUserDataUpdatingMutation = useMutation({
    mutationKey: ["publicUserData", email],
    mutationFn: (updatedPublicUserData: PublicUserData) => handlePublicUserDataUpdating(updatedPublicUserData),
    onMutate: async (updatedPublicUserData: PublicUserData) => {
      await queryClient.cancelQueries({ queryKey: ["publicUserData", email] });
      const publicUserDataBeforeOptimisticUpdate = queryClient.getQueryData(["publicUserData", email]);
      await queryClient.setQueryData(["publicUserData", email], updatedPublicUserData);
      return { publicUserDataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["publicUserData", email], context?.publicUserDataBeforeOptimisticUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicUserData", email] });
    },
  });

  useEffect(() => {
    setIsAccessibilityMode(publicUserData.accessibilityEnabled);
  }, [publicUserData.accessibilityEnabled]);

  async function handleAccessibilityToggle() {
    const newIsAccessibilityMode = !isAccessibilityMode;
    setIsAccessibilityMode(newIsAccessibilityMode);
    // setPublicUserData((prevPublicUserData) => ({
    //   ...prevPublicUserData,
    //   accessibilityEnabled: newIsAccessibilityMode,
    // }));

    const updatedPublicUserData: PublicUserData = { ...publicUserData, accessibilityEnabled: newIsAccessibilityMode };
    publicUserDataUpdatingMutation.mutate(updatedPublicUserData);

    // await handlePublicUserDataUpdating(updatedPublicUserData);
  }

  return (
    <div
      className={`flex flex-row justify-start w-20 rounded-3xl p-1 hover:cursor-pointer ${isAccessibilityMode ? "bg-[#3f4240] sun-glow" : "bg-[#17423F] rgb-glow"} `}
      onClick={handleAccessibilityToggle}
    >
      <div
        className={`rounded-full w-7 h-7 p-1 select-none transition-all ease-in-out ${isAccessibilityMode ? "toggle-right-shift bg-black" : "bg-white "}`}
      >
        <img
          src={`/src/assets/UI-icons/${isAccessibilityMode ? "contrast-mode" : "colour-mode"}.svg`}
          alt="Accessibility mode icon"
        />
      </div>
    </div>
  );
}
