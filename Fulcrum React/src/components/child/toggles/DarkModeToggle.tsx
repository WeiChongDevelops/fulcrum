import { useState, useEffect } from "react";
import useUpdatePublicUserData from "../../../hooks/mutations/other/useUpdatePublicUserData.ts";
import { PublicUserData } from "../../../utility/types.ts";

interface DarkModeToggleProps {
  publicUserData: PublicUserData;
}

/**
 * A toggle for the user to choose between light and dark mode.
 */
export default function DarkModeToggle({ publicUserData }: DarkModeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(publicUserData.darkModeEnabled);
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();

  useEffect(() => {
    setIsDarkMode(publicUserData.darkModeEnabled);
  }, [publicUserData.darkModeEnabled]);

  async function handleDarkModeToggle() {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, darkModeEnabled: newIsDarkMode };
    updatePublicUserData(updatedPublicUserData);
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
