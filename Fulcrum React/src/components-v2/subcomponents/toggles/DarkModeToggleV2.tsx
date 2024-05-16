import { PublicUserData } from "@/utility/types.ts";
import { useContext, useEffect, useState } from "react";
import useUpdatePublicUserData from "@/hooks/mutations/other/useUpdatePublicUserData.ts";
import { LocationContext } from "@/utility/util.ts";

interface DarkModeToggleV2Props {
  publicUserData: PublicUserData;
}

/**
 * A toggle for the user to choose between light and dark mode.
 */
export default function DarkModeToggleV2({ publicUserData }: DarkModeToggleV2Props) {
  const [isDarkMode, setIsDarkMode] = useState(publicUserData.darkModeEnabled);
  const { mutate: updatePublicUserData } = useUpdatePublicUserData();
  const routerLocation = useContext(LocationContext);

  useEffect(() => {
    setIsDarkMode(publicUserData.darkModeEnabled);
  }, [publicUserData.darkModeEnabled, routerLocation]);

  async function handleDarkModeToggle() {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    const updatedPublicUserData: PublicUserData = { ...publicUserData, darkModeEnabled: newIsDarkMode };
    updatePublicUserData(updatedPublicUserData);
  }

  return (
    <div
      className={`flex flex-row justify-start w-14 rounded-3xl p-1 hover:cursor-pointer ${isDarkMode ? "bg-[#3f4240] moon-shadow" : "bg-[#17423F] sun-glow"}`}
      onClick={handleDarkModeToggle}
    >
      <div
        className={`rounded-full size-5 p-1 select-none transition-all ease-in-out ${isDarkMode ? "toggle-right-shift bg-black" : "bg-white "}`}
      >
        <img
          src={`/static/assets-v2/UI-icons/${isDarkMode ? "dark-mode-moon" : "light-mode-sun"}.svg`}
          alt="Dark or light mode icon"
        />
      </div>
    </div>
  );
}
