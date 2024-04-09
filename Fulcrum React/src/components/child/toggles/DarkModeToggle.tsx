import { useState, useEffect, useContext } from "react";
import { EmailContext, handlePublicUserDataUpdating, PublicUserData } from "../../../util.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DarkModeToggleProps {
  publicUserData: PublicUserData;
}

/**
 * A toggle for the user to choose between light and dark mode.
 */
export default function DarkModeToggle({ publicUserData }: DarkModeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(publicUserData.darkModeEnabled);

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
    setIsDarkMode(publicUserData.darkModeEnabled);
  }, [publicUserData.darkModeEnabled]);

  async function handleDarkModeToggle() {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, darkModeEnabled: newIsDarkMode };
    publicUserDataUpdatingMutation.mutate(updatedPublicUserData);

    // await handlePublicUserDataUpdating(updatedPublicUserData);
    // setPublicUserData((prevPublicUserData) => ({
    //   ...prevPublicUserData,
    //   darkModeEnabled: newIsDarkMode,
    // }));
  }

  return (
    <div
      className={`flex flex-row justify-start w-20 rounded-3xl p-1 hover:cursor-pointer ${isDarkMode ? "bg-[#3f4240] moon-shadow" : "bg-[#17423F] sun-glow"}`}
      onClick={handleDarkModeToggle}
    >
      <div
        className={`rounded-full w-7 h-7 p-1 select-none transition-all ease-in-out ${isDarkMode ? "toggle-right-shift bg-black" : "bg-white "}`}
      >
        <img
          src={`/src/assets/UI-icons/${isDarkMode ? "dark-mode-moon" : "light-mode-sun"}.svg`}
          alt="Dark or light mode icon"
        />
      </div>
    </div>
  );
}
